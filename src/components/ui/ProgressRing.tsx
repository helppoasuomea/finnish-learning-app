export const ProgressRing = ({
    value,
    size = 38,
    stroke = 2.5,
}: {
    value: number | string;
    size?: number;
    stroke?: number;
}) => {
    const pct = Math.min(parseFloat(String(value)) || 0, 100);
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const fill = (pct / 100) * circ;
    const c = size / 2;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
            <circle cx={c} cy={c} r={r} fill="none" stroke="var(--tk-rule)" strokeWidth={stroke} />
            <circle cx={c} cy={c} r={r} fill="none" stroke="var(--tk-accent)" strokeWidth={stroke}
                strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
                transform={`rotate(-90 ${c} ${c})`} />
            <text x={c} y={c} dominantBaseline="middle" textAnchor="middle"
                style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${Math.round(size * 0.265)}px`,
                    fontWeight: 600,
                    fill: 'var(--tk-ink-2)',
                }}>
                {Math.round(pct)}
            </text>
        </svg>
    );
};
