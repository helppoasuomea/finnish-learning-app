import { useState } from "react"
import axios from "axios"
import { PACE_CONFIG, type LearningPace } from "@/utils/srs"
import { useToast } from "@/components/ui/use-toast"

const PACES: { key: LearningPace; emoji: string; title: string }[] = [
  { key: "light",    emoji: "🌱", title: "Light" },
  { key: "balanced", emoji: "🌿", title: "Balanced" },
  { key: "intense",  emoji: "🌳", title: "Intense" },
]

interface Props {
  currentPace: LearningPace
  activeCount: number
  onPaceChange: (pace: LearningPace) => void
}

export const LearningPaceCard: React.FC<Props> = ({ currentPace, activeCount, onPaceChange }) => {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleChange = async (pace: LearningPace) => {
    if (pace === currentPace) return
    setSaving(true)
    try {
      await axios.put("/update", { learningPace: pace })
      onPaceChange(pace)
      toast({ title: "Learning pace updated" })
    } catch {
      toast({ title: "Could not save pace", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const poolSize = PACE_CONFIG[currentPace].activePoolSize
  const pct = poolSize > 0 ? Math.min(100, Math.round(activeCount / poolSize * 100)) : 0

  return (
    <div className="lp-card">
      <div className="lp-card-head">
        <div className="lp-card-title">Learning pace</div>
        <div className="lp-card-sub">Controls how many new words enter your queue each day.</div>
      </div>

      <div className="lp-options">
        {PACES.map(p => {
          const cfg = PACE_CONFIG[p.key]
          const selected = p.key === currentPace
          return (
            <button
              key={p.key}
              className={`lp-option${selected ? " is-selected" : ""}`}
              onClick={() => handleChange(p.key)}
              disabled={saving}
            >
              <div className="lp-option-emoji">{p.emoji}</div>
              <div className="lp-option-title">{p.title}</div>
              <div className="lp-option-stats">
                <span>{cfg.newPerDay} new / day</span>
                <span>~{cfg.reviewBudgetMin} min</span>
                <span>{cfg.activePoolSize} word pool</span>
              </div>
              <div className="lp-option-label">{cfg.label}</div>
            </button>
          )
        })}
      </div>

      <div className="lp-pool">
        <div className="lp-pool-row">
          <span className="lp-pool-label">Active garden</span>
          <span className="lp-pool-count">{activeCount} / {poolSize}</span>
        </div>
        <div className="lp-pool-track">
          <div className="lp-pool-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="lp-pool-desc">
          {pct >= 100
            ? "Your active garden is full. New words wait until some settle."
            : `${pct}% of your pool in use — ${Math.max(0, poolSize - activeCount)} spots available.`
          }
        </div>
      </div>
    </div>
  )
}
