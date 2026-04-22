import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { AcctEditSheet, AcctEditField } from "./AcctEditSheet";

interface PersonalInfoCardProps {
  user: any;
  onSaved?: () => void;
  isGoogleUser?: boolean;
}

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  apple:  "Apple",
  github: "GitHub",
};

export const PersonalInfoCard = ({ user, onSaved, isGoogleUser = false }: PersonalInfoCardProps) => {
  const { toast } = useToast();
  const [sheet, setSheet] = useState<{ field: AcctEditField } | null>(null);

  const connectedProviders: string[] = (() => {
    const ap = user?.authProvider ?? "";
    if (ap === "both") return ["google"];
    if (ap === "google") return ["google"];
    return [];
  })();

  const handleSave = async ({ field, value }: { field: AcctEditField; value: any }) => {
    try {
      const payload: Record<string, any> = {
        name: user?.name,
        username: user?.username,
        avatarUrl: user?.avatarUrl,
      };
      if (field === "name")     payload.name = value;
      if (field === "username") payload.username = value;
      if (field === "email")    payload.email = value;
      if (field === "password") payload.password = value.next;
      await axios.put("/update", payload);
      onSaved?.();
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.error ?? "Could not save — try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="st-section">
        <div className="st-section-title">Account</div>
        <div className="st-section-sub">How you sign in and how we reach you.</div>

        <div className="acct-section">
          {/* Name */}
          <div className="acct-row">
            <div className="acct-row-label">Name</div>
            <div className="acct-row-value">
              {user?.name ?? "—"}
              <span className="acct-row-sub">Shown on your profile and seal.</span>
            </div>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setSheet({ field: "name" })}>
              Edit
            </button>
          </div>

          {/* Username — hidden for pure Google users */}
          {!isGoogleUser && (
            <div className="acct-row">
              <div className="acct-row-label">Username</div>
              <div className="acct-row-value mono">
                {user?.username ? `@${user.username}` : "—"}
                <span className="acct-row-sub">Used for sign-in. 3–20 characters, letters and numbers.</span>
              </div>
              <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setSheet({ field: "username" })}>
                Change
              </button>
            </div>
          )}

          {/* Email */}
          <div className="acct-row">
            <div className="acct-row-label">Email</div>
            <div className="acct-row-value">
              {user?.email ?? "—"}
              <span className="acct-row-sub">
                {isGoogleUser
                  ? "Managed by Google."
                  : "For account recovery and (if you choose) daily reading nudges."}
              </span>
            </div>
            {!isGoogleUser && (
              <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setSheet({ field: "email" })}>
                Change
              </button>
            )}
            {isGoogleUser && <div style={{ width: 80 }} />}
          </div>

          {/* Password — hidden for pure Google users */}
          {!isGoogleUser && (
            <div className="acct-row">
              <div className="acct-row-label">Password</div>
              <div className="acct-row-value">
                <span className="acct-pw-dots">· · · · · · · · · ·</span>
                <span className="acct-row-sub">Change anytime. Minimum 8 characters.</span>
              </div>
              <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setSheet({ field: "password" })}>
                Change password
              </button>
            </div>
          )}

          {/* Quick-access PIN */}
          <div className="acct-row">
            <div className="acct-row-label">Quick-access PIN</div>
            <div className="acct-row-value">
              <span className="acct-pw-dots">· · · ·</span>
              <span className="acct-row-sub">Skip the full password when opening Lukeā on this device.</span>
            </div>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setSheet({ field: "pin" })}>
              Set PIN
            </button>
          </div>

          {/* Connected accounts */}
          <div className="acct-row acct-row--providers">
            <div className="acct-row-label">Connected accounts</div>
            <div className="acct-providers">
              {["google", "apple", "github"].map(p => {
                const connected = connectedProviders.includes(p);
                return (
                  <button
                    key={p}
                    className={`acct-provider-chip${connected ? " is-connected" : ""}`}
                    disabled={connected}
                  >
                    {connected ? <Check size={11} /> : <Plus size={11} />}
                    {PROVIDER_LABELS[p]}
                  </button>
                );
              })}
            </div>
            <div style={{ width: 80 }} />
          </div>
        </div>
      </div>

      <AcctEditSheet
        open={sheet}
        onClose={() => setSheet(null)}
        onSave={handleSave}
        user={{ name: user?.name, username: user?.username, email: user?.email }}
      />
    </>
  );
};
