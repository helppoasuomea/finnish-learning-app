import { LoginHistoryResponse, XpHistoryResponse } from "@/components/SettingsPage/SettingsTypes"
import { UserContext } from "@/contexts/UserContext"
import axios from "axios";
import { useContext, useEffect, useState } from "react"

interface GamificationStats {
    currentStreak: number;
    maxStreak: number;
    totalReviews: number;
    xp: number;
    level: number;
}

export const useSettingsData = () => {
    const { user } = useContext(UserContext)
    const [loginHistory, setLoginHistory] = useState<LoginHistoryResponse | null>(null)
    const [xpHistory, setXpHistory] = useState<XpHistoryResponse | null>(null)
    const [gamificationStats, setGamificationStats] = useState<GamificationStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) return;
            setLoading(true)
            try {
                const [loginRes, xpRes, statsRes] = await Promise.all([
                    axios.get('/login-history'),
                    axios.get('/xp-history'),
                    axios.get('/gamification/stats'),
                ])
                setLoginHistory(loginRes.data)
                setXpHistory(xpRes.data)
                setGamificationStats(statsRes.data)
            } catch (err) {
                return;
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user?._id])

    return { loginHistory, xpHistory, gamificationStats, loading }
}