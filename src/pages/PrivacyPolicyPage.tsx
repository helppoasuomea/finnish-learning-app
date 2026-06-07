import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PrivacyContent } from "@/components/LegalContent";

export const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-root">
      <div className="legal-inner">
        <button className="au-back-link" style={{ marginBottom: 32 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={13} /> Back
        </button>
        <div className="legal-header">
          <div className="tk-eyebrow" style={{ marginBottom: 10 }}>Legal</div>
          <h1 className="tk-display-lg" style={{ marginBottom: 8 }}>Privacy Policy</h1>
          <p className="legal-meta">Last updated: June 2026</p>
        </div>
        <PrivacyContent />
      </div>
    </div>
  );
};
