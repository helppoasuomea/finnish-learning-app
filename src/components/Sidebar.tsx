import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { DeckContext } from "@/contexts/DeckContext";
import { useSidebar } from "@/contexts/SidebarContext";
import {
    Languages,
    Library,
    Settings,
    LogOut,
    Bookmark,
    Flame,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
    Compass,
    ArrowRight,
    User,
    Play,
    BookOpen,
    Globe,
} from "lucide-react";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { WelcomeScreen } from "./WelcomeScreen";

/* Small circular seal — signature Lukeā motif */
const Seal = ({
    letter,
    size = 32,
    filled = false,
}: {
    letter: string;
    size?: number;
    filled?: boolean;
}) => (
    <span
        style={{
            width: size,
            height: size,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: 'var(--font-display)',
            fontSize: size * 0.44,
            lineHeight: 1,
            flexShrink: 0,
            color: filled ? "var(--tk-paper)" : "var(--tk-accent)",
            background: filled ? "var(--tk-accent)" : "var(--tk-card)",
            border: `1.25px solid var(--tk-accent)`,
            letterSpacing: 0,
        }}
    >
        {letter}
    </span>
);

/* Tiny dot-indicator for recent decks */
const DeckDot = ({ pct }: { pct: number }) => (
    <span
        style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            flexShrink: 0,
            background:
                pct > 70
                    ? "var(--tk-accent)"
                    : pct > 30
                    ? "var(--tk-tag-moss)"
                    : "var(--tk-ink-5)",
        }}
    />
);

export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const { decks } = useContext(DeckContext);
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [recentDecks, setRecentDecks] = useState<any[]>([]);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        if (decks && decks.length > 0) {
            setRecentDecks([...decks].slice(0, 5));
        }
    }, [decks]);

    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            setUser(null);
            localStorage.clear();
            window.location.reload();
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: "/", label: "Translate", icon: Languages },
        { path: "/grammar", label: "Grammar", icon: BookOpen },
        ...(user
            ? [
                  { path: "/view-all-decks", label: "Decks", icon: Library },
                  { path: "/review", label: "Review", icon: RotateCcw },
                  { path: "/vocabulary", label: "Vocabulary", icon: Compass },
                  { path: "/saved-sentences", label: "Saved sentences", icon: Bookmark },
                  { path: "/browse", label: "Browse", icon: Globe },
              ]
            : []),
    ];

    const sidebarW = isCollapsed ? 64 : 248;

    return (
        <TooltipProvider delayDuration={300}>
            <aside
                className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300"
                style={{
                    width: sidebarW,
                    background: "var(--tk-paper)",
                    borderRight: "1px solid var(--tk-rule)",
                }}
            >
                {/* ── Wordmark ── */}
                <div
                    style={{
                        padding: isCollapsed ? "20px 12px 14px" : "24px 20px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "space-between",
                    }}
                >
                    {!isCollapsed && (
                        <button
                            onClick={() => navigate("/")}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: 2,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 26,
                                    color: "var(--tk-ink)",
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1,
                                    fontWeight: 400,
                                }}
                            >
                                Lukeā
                            </span>
                            <span className="tk-eyebrow" style={{ marginTop: 4 }}>
                                reading room
                            </span>
                        </button>
                    )}

                    {/* Collapse toggle */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={toggleSidebar}
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--tk-ink-3)",
                                    background: "transparent",
                                    border: "1px solid var(--tk-rule)",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    transition: "background 160ms, color 160ms",
                                }}
                                className="hover:bg-[var(--tk-paper-deep)] hover:text-[var(--tk-ink)]"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-3.5 w-3.5" />
                                ) : (
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {isCollapsed ? "Expand" : "Collapse"}
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* ── Main nav ── */}
                <nav
                    style={{
                        flex: 1,
                        padding: isCollapsed ? "8px 10px" : "8px 12px",
                        overflowY: "auto",
                    }}
                >
                    {!isCollapsed && (
                        <div className="tk-eyebrow" style={{ padding: "12px 10px 8px" }}>
                            Library
                        </div>
                    )}

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        const navBtn = (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: isCollapsed ? "9px 10px" : "8px 10px",
                                    borderRadius: 8,
                                    fontSize: 13.5,
                                    color: active ? "var(--tk-accent-deep)" : "var(--tk-ink-2)",
                                    background: active ? "var(--tk-accent-wash)" : "transparent",
                                    fontWeight: active ? 500 : 450,
                                    marginBottom: 2,
                                    transition: "background 160ms, color 160ms",
                                    textDecoration: "none",
                                    justifyContent: isCollapsed ? "center" : "flex-start",
                                }}
                                className={!active ? "hover:bg-[var(--tk-paper-deep)] hover:text-[var(--tk-ink)]" : ""}
                            >
                                <Icon size={17} strokeWidth={1.6} style={{ flexShrink: 0 }} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );

                        if (isCollapsed) {
                            return (
                                <Tooltip key={item.path}>
                                    <TooltipTrigger asChild>{navBtn}</TooltipTrigger>
                                    <TooltipContent side="right">{item.label}</TooltipContent>
                                </Tooltip>
                            );
                        }
                        return navBtn;
                    })}

                    {/* ── Recent decks ── */}
                    {user && recentDecks.length > 0 && !isCollapsed && (
                        <div style={{ marginTop: 24 }}>
                            <div className="tk-eyebrow" style={{ padding: "12px 10px 8px" }}>
                                Recent decks
                            </div>
                            {recentDecks.map((deck) => {
                                const active = location.pathname === `/view-decks/${deck._id}`;
                                return (
                                    <Link
                                        key={deck._id}
                                        to={`/view-decks/${deck._id}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "6px 10px",
                                            borderRadius: 8,
                                            fontSize: 12.5,
                                            color: active ? "var(--tk-accent-deep)" : "var(--tk-ink-3)",
                                            background: active ? "var(--tk-accent-wash)" : "transparent",
                                            marginBottom: 2,
                                            transition: "background 160ms, color 160ms",
                                            textDecoration: "none",
                                        }}
                                        className={!active ? "hover:bg-[var(--tk-paper-deep)] hover:text-[var(--tk-ink)]" : ""}
                                    >
                                        <DeckDot pct={deck.deckPercentage || 0} />
                                        <span
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {deck.deckName}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Settings (in nav) ── */}
                    {user && (
                        <div style={{ marginTop: isCollapsed ? 8 : 24 }}>
                            {!isCollapsed && (
                                <div style={{ height: 1, background: "var(--tk-rule)", marginBottom: 12 }} />
                            )}
                            {(() => {
                                const active = isActive("/settings");
                                const btn = (
                                    <Link
                                        to="/settings"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: isCollapsed ? "9px 10px" : "8px 10px",
                                            borderRadius: 8,
                                            fontSize: 13.5,
                                            color: active ? "var(--tk-accent-deep)" : "var(--tk-ink-2)",
                                            background: active ? "var(--tk-accent-wash)" : "transparent",
                                            fontWeight: active ? 500 : 450,
                                            marginBottom: 2,
                                            transition: "background 160ms, color 160ms",
                                            textDecoration: "none",
                                            justifyContent: isCollapsed ? "center" : "flex-start",
                                        }}
                                        className={!active ? "hover:bg-[var(--tk-paper-deep)] hover:text-[var(--tk-ink)]" : ""}
                                    >
                                        <Settings size={17} strokeWidth={1.6} style={{ flexShrink: 0 }} />
                                        {!isCollapsed && <span>Settings</span>}
                                    </Link>
                                );
                                if (isCollapsed) {
                                    return (
                                        <Tooltip>
                                            <TooltipTrigger asChild>{btn}</TooltipTrigger>
                                            <TooltipContent side="right">Settings</TooltipContent>
                                        </Tooltip>
                                    );
                                }
                                return btn;
                            })()}
                        </div>
                    )}
                </nav>

                {/* ── Footer ── */}
                <div
                    style={{
                        borderTop: "1px solid var(--tk-rule)",
                        padding: isCollapsed ? 10 : 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                    }}
                >
                    {/* "How Lukeā studies" button */}
                    {!isCollapsed && (
                        <button
                            onClick={() => setShowWelcome(true)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 10px",
                                fontSize: 10.5,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontFamily: "var(--tk-mono)",
                                color: "var(--tk-ink-3)",
                                background: "transparent",
                                border: "1px solid var(--tk-rule-soft, var(--tk-rule))",
                                borderRadius: 6,
                                width: "100%",
                                justifyContent: "flex-start",
                                cursor: "pointer",
                                transition: "all 120ms",
                            }}
                            className="hover:bg-[var(--tk-paper-deep)] hover:!text-[var(--tk-ink)]"
                        >
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--tk-accent)", flexShrink: 0 }} />
                            How Lukeā studies
                        </button>
                    )}
                    {isCollapsed && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setShowWelcome(true)}
                                    style={{
                                        width: 28, height: 28,
                                        borderRadius: 6,
                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--tk-ink-3)",
                                        background: "transparent",
                                        border: "1px solid var(--tk-rule)",
                                        cursor: "pointer",
                                        margin: "0 auto",
                                        transition: "background 160ms, color 160ms",
                                    }}
                                    className="hover:bg-[var(--tk-paper-deep)] hover:text-[var(--tk-ink)]"
                                >
                                    <Play size={12} strokeWidth={1.6} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">How Lukeā studies</TooltipContent>
                        </Tooltip>
                    )}

                    {user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {/* User chip */}
                            <button
                                onClick={() => navigate("/settings")}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: 6,
                                    borderRadius: 8,
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    minWidth: 0,
                                    transition: "background 160ms",
                                }}
                                className="hover:bg-[var(--tk-paper-deep)]"
                            >
                                <Seal
                                    letter={(user.name || user.username || "U")[0].toUpperCase()}
                                    size={isCollapsed ? 28 : 30}
                                    filled
                                />
                                {!isCollapsed && (
                                    <div style={{ overflow: "hidden", flex: 1 }}>
                                        <div
                                            style={{
                                                fontWeight: 500,
                                                fontSize: 13,
                                                color: "var(--tk-ink)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {user.name || user.username}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: "var(--tk-ink-3)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            <Flame size={11} style={{ color: "var(--tk-persimmon)" }} strokeWidth={1.8} />
                                            <span className="tk-mono">{user.currentStreak || 0}</span>
                                            <span>day streak</span>
                                        </div>
                                    </div>
                                )}
                            </button>

                            {/* Logout */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: isCollapsed ? 28 : 32,
                                            height: isCollapsed ? 28 : 32,
                                            borderRadius: 8,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--tk-ink-3)",
                                            border: isCollapsed ? "none" : "1px solid var(--tk-rule)",
                                            background: "transparent",
                                            cursor: "pointer",
                                            flexShrink: 0,
                                            transition: "background 160ms, color 160ms",
                                        }}
                                        className="hover:bg-[var(--tk-paper-deep)] hover:!text-[var(--tk-persimmon)] hover:!border-[var(--tk-persimmon)]"
                                    >
                                        <LogOut size={14} strokeWidth={1.6} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Sign out</TooltipContent>
                            </Tooltip>
                        </div>
                    ) : (
                        /* Guest chip → navigates to /login */
                        isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => navigate("/login")}
                                        style={{
                                            width: 28, height: 28,
                                            borderRadius: 8,
                                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                                            color: "var(--tk-accent)",
                                            background: "transparent",
                                            border: "1.5px dashed var(--tk-accent)",
                                            cursor: "pointer",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <User size={14} strokeWidth={1.6} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Sign in</TooltipContent>
                            </Tooltip>
                        ) : (
                            <button className="tk-guest-chip" onClick={() => navigate("/login")}>
                                <span className="tk-guest-seal">
                                    <User size={15} strokeWidth={1.6} />
                                </span>
                                <span className="tk-guest-body">
                                    <span className="tk-guest-title">Sign in</span>
                                    <span className="tk-guest-sub">to save words</span>
                                </span>
                                <ArrowRight size={14} style={{ color: "var(--tk-ink-3)", flexShrink: 0 }} />
                            </button>
                        )
                    )}
                </div>
            </aside>

            {showWelcome && <WelcomeScreen onDismiss={() => setShowWelcome(false)} />}
        </TooltipProvider>
    );
};
