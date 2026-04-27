import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { hasToken } from "../utils/cookies";

export interface User {
    _id: string;
    username: string;
    name: string;
    avatarUrl?: string;
    authProvider?: 'local' | 'google' | 'both';
    currentStreak?: number;
    maxStreak?: number;
    lastReviewDate?: Date;
    totalReviews?: number;
    flashcardWordForm: 'original' | 'base';
    audioOnCardFlip?: boolean;
    googleConsents?: {
        calendar: boolean
    }
    hasCalendarToken?: boolean
    hasQuickPin?: boolean
    quickPinExpiresAt?: string
    quickPinIsExpired?: boolean
    nudgeEnabled?: boolean
    nudgeTime?: string
    nudgeChannel?: 'calendar' | 'email' | 'push' | 'none'
    nudgeQuietDays?: 'never' | 'weekends'
    nudgeStreakGrace?: boolean
    email?: string
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated: boolean;
    refreshUserStats: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    isAuthenticated: false,
    refreshUserStats: async () => {}
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const refreshUserStats = async () => {
        try {
            const { data } = await axios.get('/profile');
            setUser(prevUser => prevUser ? { ...prevUser, ...data } : data);
        } catch (error) {
            console.error('Error refreshing user stats: ', error);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const tokenExists = hasToken();
            if (tokenExists) {
                setIsAuthenticated(true);
                const { data } = await axios.get<User>('/profile');
                const defaultAvatarUrl = "https://github.com/shadcn.png";
                data.avatarUrl = data.avatarUrl || defaultAvatarUrl;
                setUser(data);
                localStorage.setItem('userId', data._id);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('userId');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('userId');
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserProfile();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, refreshUserStats }}>
            {children}
        </UserContext.Provider>
    );
};
