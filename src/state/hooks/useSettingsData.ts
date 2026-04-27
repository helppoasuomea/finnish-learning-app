import { UserContext } from "@/contexts/UserContext"
import { useContext } from "react"

export const useSettingsData = () => {
    const { user } = useContext(UserContext)

    return {
        currentStreak: user?.currentStreak ?? 0,
        maxStreak: user?.maxStreak ?? 0,
        totalReviews: user?.totalReviews ?? 0,
        loading: !user,
    }
}
