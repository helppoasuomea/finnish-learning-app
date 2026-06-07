import { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "lukea:cookie-notice-dismissed";

export const CookieBanner = () => {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "1"
  );

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie notice">
      <p className="cookie-banner-text">
        We use a cookie to keep you signed in — nothing else.{" "}
        <Link to="/privacy" className="cookie-banner-link">Privacy policy</Link>
      </p>
      <button className="cookie-banner-btn" onClick={handleDismiss}>
        Got it
      </button>
    </div>
  );
};
