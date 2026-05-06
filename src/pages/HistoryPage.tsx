import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ReviewEntry {
    id: string;
    front: string;
    back: string;
    deckId: string;
    deckName: string;
    grade: 'again' | 'hard' | 'good' | 'easy';
    prevStability: number;
    newStability: number;
    reviewedAt: string;
}

interface ReviewLogData {
    total: number;
    matching: number;
    deckNames: string[];
    heatmap: Record<string, number>;
    entries: ReviewEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtStab(days: number): string {
    if (days <= 0) return 'new';
    if (days < 1) return '<1d';
    if (days < 30) return `${Math.round(days)}d`;
    if (days < 365) return `${(days / 30).toFixed(1)}mo`;
    return `${(days / 365).toFixed(1)}y`;
}

function buildHeatmapGrid(heatmap: Record<string, number>) {
    // Use UTC throughout so timezone offsets don't shift "today" to yesterday.
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // current UTC date

    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    start.setUTCDate(start.getUTCDate() - 52 * 7);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay()); // rewind to Sunday

    const weeks: { date: string; count: number; future: boolean }[][] = [];
    const cur = new Date(start);

    while (weeks.length < 54) {
        const week: typeof weeks[0] = [];
        for (let i = 0; i < 7; i++) {
            const dateStr = cur.toISOString().split('T')[0];
            week.push({ date: dateStr, count: heatmap[dateStr] || 0, future: dateStr > todayStr });
            cur.setUTCDate(cur.getUTCDate() + 1);
        }
        weeks.push(week);
        if (week[6].date >= todayStr) break;
    }
    return weeks;
}

function heatColor(count: number) {
    if (count === 0) return 'var(--tk-paper-edge)';
    if (count < 5)   return '#C5D9C8';
    if (count < 15)  return '#8FB09C';
    if (count < 30)  return 'var(--tk-accent)';
    return 'var(--tk-accent-deep)';
}

function getMonthLabels(weeks: { date: string }[][]) {
    const labels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, col) => {
        const [y, m, dd] = week[0].date.split('-').map(Number);
        const month = m - 1; // 0-indexed
        if (month !== lastMonth) {
            const label = new Date(Date.UTC(y, month, dd)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
            labels.push({ col, label });
            lastMonth = month;
        }
    });
    return labels;
}

function groupEntries(entries: ReviewEntry[]) {
    const groups = new Map<string, { label: string; count: number; entries: ReviewEntry[] }>();
    entries.forEach(e => {
        const d = new Date(e.reviewedAt);
        const key = d.toISOString().split('T')[0];
        if (!groups.has(key)) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const diff = Math.round((today.getTime() - target.getTime()) / 86400000);
            let label: string;
            if (diff === 0) label = 'Today';
            else if (diff === 1) label = 'Yesterday';
            else label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            groups.set(key, { label, count: 0, entries: [] });
        }
        const g = groups.get(key)!;
        g.entries.push(e);
        g.count++;
    });
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

// ── Grade badge ───────────────────────────────────────────────────────────────

const GRADE_STYLE: Record<string, { bg: string; color: string }> = {
    again: { bg: 'var(--tk-persimmon-soft)', color: 'var(--tk-persimmon)' },
    hard:  { bg: '#F0E8D8',                  color: '#9B6E3A' },
    good:  { bg: 'var(--tk-paper-edge)',      color: 'var(--tk-ink-2)' },
    easy:  { bg: 'var(--tk-accent-wash)',     color: 'var(--tk-accent-deep)' },
};

const GradeBadge: React.FC<{ grade: ReviewEntry['grade'] }> = ({ grade }) => {
    const s = GRADE_STYLE[grade] || GRADE_STYLE.good;
    return (
        <span className="hl-grade-badge" style={{ background: s.bg, color: s.color }}>
            {grade.toUpperCase()}
        </span>
    );
};

// ── Constants ─────────────────────────────────────────────────────────────────

const RANGE_OPTS = [
    { value: '30',  label: '30 days' },
    { value: '90',  label: '90 days' },
    { value: '180', label: '6 months' },
    { value: '365', label: '1 year' },
    { value: 'all', label: 'All time' },
];

const GRADE_OPTS = [
    { value: 'any',    label: 'All grades' },
    { value: 'again',  label: 'Again' },
    { value: 'hard',   label: 'Hard' },
    { value: 'good',   label: 'Good' },
    { value: 'easy',   label: 'Easy' },
];

const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];
const COL_PX = 13;
const DAY_LABEL_W = 24;

// ── Component ─────────────────────────────────────────────────────────────────

export const HistoryPage = () => {
    const navigate = useNavigate();
    const [range, setRange] = useState('90');
    const [grade, setGrade] = useState('any');
    const [data, setData] = useState<ReviewLogData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({ range });
        if (grade !== 'any') params.set('grade', grade);
        axios.get(`/review/log?${params}`)
            .then(r => { setData(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [range, grade]);

    const weeks = useMemo(() => data ? buildHeatmapGrid(data.heatmap) : [], [data]);
    const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
    const grouped = useMemo(() => data ? groupEntries(data.entries) : [], [data]);

    return (
        <div className="hl-page">
            <div className="hl-container">
                <button className="hl-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={14} /> Back
                </button>

                <div className="hl-header">
                    <div className="tk-eyebrow">Your data</div>
                    <h1 className="tk-page-title" style={{ marginBottom: 6 }}>Review history</h1>
                    {data && (
                        <p className="hl-subtitle">
                            {data.total} review{data.total !== 1 ? 's' : ''} across {data.deckNames.length} deck{data.deckNames.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Heatmap */}
                <div className="hl-card">
                    <div className="tk-eyebrow" style={{ marginBottom: 14 }}>Activity · past year</div>
                    <div className="hl-heatmap-scroll">
                        <div style={{ position: 'relative', minWidth: weeks.length * COL_PX + DAY_LABEL_W + 4 }}>
                            <div style={{ position: 'relative', height: 16, marginBottom: 4 }}>
                                {monthLabels.map(({ col, label }) => (
                                    <span key={col} className="hl-month-lbl" style={{ left: DAY_LABEL_W + col * COL_PX }}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                                <div className="hl-day-labels">
                                    {DAY_LABELS.map((d, i) => <div key={i} className="hl-day-lbl">{d}</div>)}
                                </div>
                                <div className="hl-weeks">
                                    {weeks.map((week, wi) => (
                                        <div key={wi} className="hl-week">
                                            {week.map((cell, di) => (
                                                <div
                                                    key={di}
                                                    className="hl-cell"
                                                    style={{ background: cell.future ? 'transparent' : heatColor(cell.count) }}
                                                    title={cell.future ? '' : `${cell.date}: ${cell.count} review${cell.count !== 1 ? 's' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="hl-legend">
                                <span className="hl-legend-lbl">Less</span>
                                {[0, 3, 10, 20, 35].map(n => (
                                    <div key={n} className="hl-legend-cell" style={{ background: heatColor(n) }} />
                                ))}
                                <span className="hl-legend-lbl">More</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="hl-filters">
                    <select className="hl-select" value={range} onChange={e => setRange(e.target.value)}>
                        {RANGE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select className="hl-select" value={grade} onChange={e => setGrade(e.target.value)}>
                        {GRADE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {data && !loading && (
                        <span className="hl-match-count">
                            {data.matching} review{data.matching !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Entry list */}
                {loading ? (
                    <div className="hl-empty">Loading…</div>
                ) : !data || data.entries.length === 0 ? (
                    <div className="hl-empty">No reviews in this period.</div>
                ) : (
                    <div className="hl-sessions">
                        {grouped.map(([dateKey, { label, count, entries }]) => (
                            <div key={dateKey} className="hl-group">
                                <div className="hl-group-date">
                                    {label}
                                    <span className="hl-group-count">{count} review{count !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="hl-log-rows">
                                    {entries.map(e => {
                                        const time = new Date(e.reviewedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                                        const deckShort = e.deckName.length > 16 ? e.deckName.slice(0, 14) + '…' : e.deckName;
                                        return (
                                            <div key={e.id} className="hl-log-row">
                                                <span className="hl-log-time">{time}</span>
                                                <span className="hl-log-front">{e.front}</span>
                                                <span className="hl-log-back">{e.back}</span>
                                                <span className="hl-log-meta">
                                                    {deckShort}
                                                    <span className="hl-log-stab">
                                                        {fmtStab(e.prevStability)} → {fmtStab(e.newStability)}
                                                    </span>
                                                </span>
                                                <GradeBadge grade={e.grade} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
