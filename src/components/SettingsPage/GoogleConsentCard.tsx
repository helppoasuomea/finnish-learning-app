import { useContext, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { FcGoogle } from "react-icons/fc"
import { FaCalendarAlt } from "react-icons/fa"
import axios from "axios"
import { UserContext } from "@/contexts/UserContext"
import { useToast } from "../ui/use-toast"

type ConsentKey = 'calendar'

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2323'

const CONSENT_ITEMS: Array<{ id: ConsentKey; icon: React.ReactNode; label: string; description: string }> = [
    {
        id: "calendar",
        icon: <FaCalendarAlt className="h-4 w-4 text-blue-500" />,
        label: "Google Calendar",
        description: "Allow the app to create study reminder events in your Google Calendar."
    }
]

export const GoogleConsentCard = () => {
    const { user, setUser } = useContext(UserContext)
    const { toast } = useToast()

    const [consents, setConsents] = useState<Record<ConsentKey, boolean>>({
        calendar: user?.googleConsents?.calendar ?? false
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setConsents({ calendar: user?.googleConsents?.calendar ?? false })
    }, [user?.googleConsents?.calendar])

    const toggle = async (id: ConsentKey) => {
        if (saving) return
        setSaving(true)

        if (!consents[id]) {
            // Turning ON — check if we already have a stored token
            if (user?.hasCalendarToken) {
                // Token exists, just re-enable in DB without OAuth redirect
                try {
                    await axios.put('/auth/google/calendar/enable')
                    const updated = { ...consents, [id]: true }
                    setConsents(updated)
                    setUser((prev: any) => prev ? { ...prev, googleConsents: updated } : prev)
                    toast({ title: '📅 Google Calendar enabled', description: 'Calendar access has been re-enabled.' })
                } catch (err) {
                    toast({ title: 'Failed to enable', description: 'Could not re-enable calendar access.', variant: 'destructive' })
                } finally {
                    setSaving(false)
                }
                return
            }
            // No token yet — redirect to Google OAuth
            window.location.href = `${BACKEND_URL}/api/auth/google/calendar`
            return
        }

        // Turning OFF → revoke via backend
        try {
            await axios.delete('/auth/google/calendar')
            const updated = { ...consents, [id]: false }
            setConsents(updated)
            setUser((prev: any) => prev ? { ...prev, googleConsents: updated } : prev)
            toast({ title: 'Calendar access removed', description: 'Google Calendar permission has been revoked.' })
        } catch (err) {
            toast({ title: 'Failed to revoke', description: 'Could not remove calendar permission.', variant: 'destructive' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FcGoogle className="h-5 w-5" />
                    Google Permissions
                </CardTitle>
                <p className="text-sm text-slate-600">Control what this app can access from your Google account.</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {CONSENT_ITEMS.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">{item.icon}</div>
                            <div>
                                <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                                    {item.label}
                                </Label>
                                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                            </div>
                        </div>
                        <Switch
                            id={item.id}
                            checked={consents[item.id]}
                            onCheckedChange={() => toggle(item.id)}
                            disabled={saving}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
