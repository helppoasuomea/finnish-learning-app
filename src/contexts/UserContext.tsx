import axios from "axios";
import { createContext, useEffect, useState } from "react";

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
    difficultyLabel?: 'plain' | 'cefr' | 'both'
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated: boolean;
    isLoading: boolean;
    refreshUserStats: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    isAuthenticated: false,
    isLoading: true,
    refreshUserStats: async () => {}
});

const PROFILE_KEYS: (keyof User)[] = [
    '_id', 'username', 'name', 'avatarUrl', 'authProvider',
    'currentStreak', 'maxStreak', 'lastReviewDate', 'totalReviews',
    'flashcardWordForm', 'audioOnCardFlip', 'googleConsents', 'hasCalendarToken',
    'hasQuickPin', 'quickPinExpiresAt', 'quickPinIsExpired',
    'nudgeEnabled', 'nudgeTime', 'nudgeChannel', 'nudgeQuietDays', 'nudgeStreakGrace',
    'email', 'difficultyLabel',
];

function pickProfile(data: any): User {
    const out: Partial<User> = {};
    for (const k of PROFILE_KEYS) {
        if (k in data) (out as any)[k] = data[k];
    }
    out.avatarUrl = out.avatarUrl || "https://github.com/shadcn.png";
    return out as User;
}

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refreshUserStats = async () => {
        try {
            const { data } = await axios.get('/profile');
            setUser(prevUser => prevUser ? { ...prevUser, ...pickProfile(data) } : pickProfile(data));
        } catch (error) {
            console.error('Error refreshing user stats: ', error);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const { data } = await axios.get<User>('/profile');
            setUser(pickProfile(data));
            setIsAuthenticated(true);
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserProfile();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, isLoading, refreshUserStats }}>
            {children}
        </UserContext.Provider>
    );
};
