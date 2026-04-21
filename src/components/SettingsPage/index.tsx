import { UserContext } from "@/contexts/UserContext"
import { DeckContext } from "@/contexts/DeckContext"
import { useProfileEdit } from "@/state/hooks/useProfileEdit"
import { useSettingsData } from "@/state/hooks/useSettingsData"
import { getTimeStamp } from "@/utils/getTimestamp"
import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { PersonalInfoCard } from "./PersonalInfoCard"
import { GoogleConsentCard } from "./GoogleConsentCard"
import { DailyNudgeCard } from "./DailyNudgeCard"
import { Switch } from "../ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import ProfilePicture from "./ProfilePicture"
import { useToast } from "../ui/use-toast"
import axios from "axios"

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function joinedLabel(id: string) {
    const d = getTimeStamp(id)
    return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
}

const DEFAULT_AVATAR = "https://github.com/shadcn.png"

interface PrefRowProps {
    label: string
    desc: string
    checked: boolean
    onChange: (v: boolean) => void
}
function PrefRow({ label, desc, checked, onChange }: PrefRowProps) {
    return (
        <div className="st-pref-row">
            <div>
                <div className="st-pref-label">{label}</div>
                <div className="st-pref-desc">{desc}</div>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )
}

export const SettingsPage = () => {
    const { user, refreshUserStats } = useContext(UserContext)
    const { decks } = useContext(DeckContext)
    const { gamificationStats } = useSettingsData()
    const profileEditProps = useProfileEdit()
    const { toast } = useToast()
    const [searchParams, setSearchParams] = useSearchParams()
    const [avatarOpen, setAvatarOpen] = useState(false)

    // Preferences state — seeded from user object
    const [baseForm, setBaseForm] = useState(user?.flashcardWordForm === 'base')
    const [audioFlip, setAudioFlip] = useState(user?.audioOnCardFlip ?? false)

    useEffect(() => {
        const calendar = searchParams.get('calendar')
        if (!calendar) return
        if (calendar === 'success') {
            refreshUserStats()
            toast({ title: 'Google Calendar connected', description: 'Study reminders will appear in your calendar.' })
        } else {
            const reason = searchParams.get('reason') || 'unknown'
            toast({ title: 'Calendar connection failed', description: `Could not connect (${reason}).`, variant: 'destructive' })
        }
        setSearchParams({}, { replace: true })
    }, [])

    const handlePref = async (field: string, value: boolean) => {
        if (field === 'baseForm') setBaseForm(value)
        if (field === 'audioFlip') setAudioFlip(value)
        try {
            await axios.put('/update', {
                name: user?.name,
                username: user?.username,
                avatarUrl: user?.avatarUrl,
                flashcardWordForm: field === 'baseForm' ? (value ? 'base' : 'original') : user?.flashcardWordForm,
                audioOnCardFlip: field === 'audioFlip' ? value : audioFlip,
            })
            refreshUserStats()
        } catch {
            toast({ title: 'Failed to save preference', variant: 'destructive' })
        }
    }

    // Stats derived from gamification endpoint + deck data
    const currentStreak = gamificationStats?.currentStreak ?? user?.currentStreak ?? 0
    const maxStreak = gamificationStats?.maxStreak ?? user?.maxStreak ?? 0
    const totalReviews = gamificationStats?.totalReviews ?? 0
    const cardsLearned = decks.reduce((sum: number, d: any) =>
        sum + d.cards.filter((c: any) => (c.cardScore ?? 0) >= 5).length, 0)

    const displayName = user?.name || user?.username || "You"
    const initial = displayName[0]?.toUpperCase() ?? "?"
    const showImg = user?.avatarUrl && user.avatarUrl !== DEFAULT_AVATAR
    const handle = user?.username ? `@${user.username}` : user?.email ?? ""
    const joined = user?._id ? joinedLabel(user._id) : ""

    return (
        <div className="tk-page">
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Your Account</div>
                <h1 className="tk-page-title">Settings</h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Profile card */}
                <div className="st-profile-card">
                    <div className="st-avatar">
                        {showImg ? <img src={user!.avatarUrl} alt={displayName} /> : initial}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="st-profile-name">{displayName}</div>
                        <div className="st-profile-meta">
                            {handle}{handle && joined ? " · " : ""}{joined ? `joined ${joined}` : ""}
                        </div>
                    </div>
                    <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
                        <DialogTrigger asChild>
                            <button className="tk-btn" style={{ whiteSpace: "nowrap" }}>
                                Change avatar seal
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>Pick an avatar</DialogTitle>
                            </DialogHeader>
                            <ProfilePicture
                                selectedAvatar={profileEditProps.selectedAvatar}
                                setSelectedAvatar={profileEditProps.setSelectedAvatar}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats card */}
                <div className="st-section">
                    <div className="st-section-title">Stats</div>
                    <div className="st-section-sub">Quiet numbers, quiet progress.</div>
                    <div className="st-stat-grid">
                        <div className="st-stat">
                            <div className="st-stat-label">🔥 Current streak</div>
                            <div className="st-stat-num">{currentStreak}<span className="st-stat-unit">days</span></div>
                        </div>
                        <div className="st-stat" style={{ paddingLeft: 20 }}>
                            <div className="st-stat-label">Longest streak</div>
                            <div className="st-stat-num">{maxStreak}<span className="st-stat-unit">days</span></div>
                        </div>
                        <div className="st-stat" style={{ paddingLeft: 20 }}>
                            <div className="st-stat-label">Cards learned</div>
                            <div className="st-stat-num">{cardsLearned}</div>
                        </div>
                        <div className="st-stat" style={{ paddingLeft: 20 }}>
                            <div className="st-stat-label">Total reviews</div>
                            <div className="st-stat-num">{totalReviews}</div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="st-section">
                    <div className="st-section-title">Preferences</div>
                    <PrefRow
                        label="Save as base form by default"
                        desc="Use dictionary form instead of the inflection you saw."
                        checked={baseForm}
                        onChange={v => handlePref('baseForm', v)}
                    />
                    <PrefRow
                        label="Audio on card flip"
                        desc="Play pronunciation automatically."
                        checked={audioFlip}
                        onChange={v => handlePref('audioFlip', v)}
                    />
                </div>

                {/* Daily nudge */}
                <DailyNudgeCard
                    enabled={user?.nudgeEnabled ?? true}
                    time={user?.nudgeTime ?? "08:00"}
                    channel={user?.nudgeChannel ?? "none"}
                    quietDays={user?.nudgeQuietDays ?? "never"}
                    streakGrace={user?.nudgeStreakGrace ?? true}
                    hasCalendar={user?.hasCalendarToken ?? false}
                    isGoogleUser={user?.authProvider === 'google' || user?.authProvider === 'both'}
                    userEmail={user?.email}
                    streak={currentStreak}
                    onSave={async (patch) => {
                        await axios.put('/update', {
                            name: user?.name,
                            username: user?.username,
                            avatarUrl: user?.avatarUrl,
                            ...patch,
                        })
                        refreshUserStats()
                    }}
                />

                {/* Personal info */}
                <PersonalInfoCard
                    formData={profileEditProps.formData}
                    editMode={profileEditProps.editMode}
                    showPassword={profileEditProps.showPassword}
                    isEditing={profileEditProps.isEditing}
                    isGoogleUser={user?.authProvider === 'google'}
                    onInputChange={profileEditProps.handleInputChange}
                    onToggleEdit={profileEditProps.toggleEdit}
                    onTogglePasswordVisibility={() => profileEditProps.setShowPassword(!profileEditProps.showPassword)}
                    onSaveChanges={profileEditProps.saveChanges}
                />

                {user?.authProvider === 'google' && <GoogleConsentCard />}
            </div>
        </div>
    )
}
