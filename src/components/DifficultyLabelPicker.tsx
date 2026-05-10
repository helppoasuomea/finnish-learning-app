type DifficultyLabel = 'plain' | 'cefr' | 'both'

interface Props {
    value: DifficultyLabel
    onChange: (v: DifficultyLabel) => void
    compact?: boolean
}

const OPTIONS: { v: DifficultyLabel; title: string; examples: string }[] = [
    { v: 'plain', title: 'Plain',  examples: 'Beginner · Intermediate · Advanced' },
    { v: 'cefr',  title: 'CEFR',   examples: 'A1 · B1 · C1' },
    { v: 'both',  title: 'Both',   examples: 'Beginner · A1' },
]

export function DifficultyLabelPicker({ value, onChange, compact = false }: Props) {
    return (
        <div className={`dl-seg${compact ? " dl-seg--compact" : ""}`}>
            {OPTIONS.map(opt => (
                <button
                    key={opt.v}
                    type="button"
                    className="dl-seg-opt"
                    data-active={value === opt.v}
                    onClick={() => onChange(opt.v)}
                    aria-pressed={value === opt.v}
                >
                    <span className="dl-seg-title">{opt.title}</span>
                    <span className="dl-seg-examples">{opt.examples}</span>
                </button>
            ))}
        </div>
    )
}
