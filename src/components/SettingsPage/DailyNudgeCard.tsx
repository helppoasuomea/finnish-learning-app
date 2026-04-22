import { useState } from "react";
import { Calendar, Mail, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

type NudgeChannel  = "calendar" | "email" | "push" | "none";
type QuietDays     = "never" | "weekends";

interface Props {
    enabled:       boolean;
    time:          string;
    channel:       NudgeChannel;
    quietDays:     QuietDays;
    streakGrace:   boolean;
    hasCalendar:   boolean;
    isGoogleUser:  boolean;
    userEmail?:    string;
    streak?:       number;
    onSave:        (patch: Partial<{
        nudgeEnabled: boolean; nudgeTime: string;
        nudgeChannel: NudgeChannel; nudgeQuietDays: QuietDays;
        nudgeStreakGrace: boolean;
    }>) => Promise<void>;
}

export const DailyNudgeCard: React.FC<Props> = ({
    enabled, time, channel, quietDays, streakGrace,
    hasCalendar, isGoogleUser, userEmail, streak = 0, onSave,
}) => {
    const [on,       setOn]       = useState(enabled);
    const [t,        setT]        = useState(time);
    const [ch,       setCh]       = useState<NudgeChannel>(channel);
    const [qd,       setQd]       = useState<QuietDays>(quietDays);
    const [sg,       setSg]       = useState(streakGrace);
    const [preview,  setPreview]  = useState(false);
    const [saving,   setSaving]   = useState(false);

    const save = async (patch: Parameters<Props["onSave"]>[0]) => {
        setSaving(true);
        try { await onSave(patch); } finally { setSaving(false); }
    };

    const toggle = async (v: boolean) => {
        setOn(v);
        await save({ nudgeEnabled: v });
    };
    const changeChannel = async (c: NudgeChannel) => {
        setCh(c);
        await save({ nudgeChannel: c });
    };
    const changeQD = async (v: QuietDays) => {
        setQd(v);
        await save({ nudgeQuietDays: v });
    };
    const changeGrace = async (v: boolean) => {
        setSg(v);
        await save({ nudgeStreakGrace: v });
    };
    const blurTime = async () => {
        await save({ nudgeTime: t });
    };

    // Next-nudge display string
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    const channelLabel = ch === "calendar" ? "posted to your Google Calendar"
        : ch === "email"  ? "sent to your email"
        : ch === "push"   ? "as a browser notification"
        : "· no reminder set";

    const CHANNELS: { id: NudgeChannel; icon: React.ReactNode; label: string; sub: string; available: boolean }[] = [
        {
            id: "calendar",
            icon: <Calendar size={16} />,
            label: "Google Calendar",
            sub: "One recurring event. Respects your calendar's quiet hours & meetings.",
            available: isGoogleUser && hasCalendar,
        },
        {
            id: "email",
            icon: <Mail size={16} />,
            label: "Email",
            sub: userEmail ? `To ${userEmail} · one message, one link` : "One message, one link",
            available: true,
        },
        {
            id: "push",
            icon: <Bell size={16} />,
            label: "Browser push",
            sub: "Lukeā will ask permission the first time",
            available: true,
        },
    ];

    return (
        <div className="st-section">
            <div className="nd-header">
                <div>
                    <div className="st-section-title" style={{ marginBottom: 2 }}>Daily nudge</div>
                    <div className="st-section-sub">A single, quiet reminder — never a notification storm.</div>
                </div>
                <Switch checked={on} onCheckedChange={toggle} disabled={saving} />
            </div>

            {on && (
                <>
                    {/* Status row */}
                    {ch !== "none" && (
                        <div className="nd-status">
                            <span className="nd-status-dot" />
                            Next nudge <strong>tomorrow at {t}</strong> · {channelLabel}
                        </div>
                    )}

                    {/* Time + Quiet days */}
                    <div className="nd-row-pair">
                        <div className="nd-field">
                            <div className="nd-field-label">Time</div>
                            <div className="nd-time-input-wrap">
                                <input
                                    className="nd-time-input"
                                    type="time"
                                    value={t}
                                    onChange={e => setT(e.target.value)}
                                    onBlur={blurTime}
                                />
                            </div>
                        </div>
                        <div className="nd-field">
                            <div className="nd-field-label">Quiet days</div>
                            <div className="nd-seg">
                                {(["never", "weekends"] as QuietDays[]).map(v => (
                                    <button
                                        key={v}
                                        className={`nd-seg-btn${qd === v ? " nd-seg-btn--active" : ""}`}
                                        onClick={() => changeQD(v)}
                                    >
                                        {v === "never" ? "Never" : "Weekends off"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Deliver via */}
                    <div className="nd-field-label" style={{ marginTop: 20, marginBottom: 8 }}>Deliver via</div>
                    <div className="nd-channels">
                        {CHANNELS.map(c => {
                            const selected = ch === c.id;
                            const blocked  = !c.available;
                            return (
                                <button
                                    key={c.id}
                                    className={`nd-channel${selected ? " nd-channel--selected" : ""}${blocked ? " nd-channel--blocked" : ""}`}
                                    onClick={() => !blocked && changeChannel(c.id)}
                                    disabled={blocked}
                                >
                                    <div className="nd-channel-radio">
                                        <div className={`nd-channel-dot${selected ? " nd-channel-dot--on" : ""}`} />
                                    </div>
                                    <div className="nd-channel-icon">{c.icon}</div>
                                    <div className="nd-channel-body">
                                        <div className="nd-channel-label">
                                            {c.label}
                                            {c.id === "calendar" && <span className="nd-rec-badge">Recommended</span>}
                                        </div>
                                        <div className="nd-channel-sub">
                                            {blocked && c.id === "calendar"
                                                ? <a className="nd-cal-link" href="/api/auth/google/calendar">Connect Google Calendar →</a>
                                                : c.sub}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Streak grace */}
                    <div className="nd-grace">
                        <div>
                            <div className="nd-grace-label">Streak grace</div>
                            <div className="nd-grace-sub">Keep your streak if you come back within 24 hours — silent, no shame.</div>
                        </div>
                        <Switch checked={sg} onCheckedChange={changeGrace} disabled={saving} />
                    </div>

                    {/* Preview toggle */}
                    <button className="nd-preview-toggle" onClick={() => setPreview(p => !p)}>
                        {preview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        See what the nudge looks like
                    </button>

                    {preview && (
                        <div className="nd-preview">
                            <div className="nd-preview-time">{t} – {formatEndTime(t)}</div>
                            <div className="nd-preview-title">🌿 Lukeā · daily review</div>
                            <div className="nd-preview-sub">5-minute review{streak > 0 ? ` · Streak day ${streak}` : ""}</div>
                            <div className="nd-preview-note">
                                Appears in your Google Calendar with a 10-minute popup reminder.
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

function formatEndTime(start: string): string {
    const [h, m] = start.split(":").map(Number);
    const end = new Date();
    end.setHours(h, m + 15, 0, 0);
    return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
}
