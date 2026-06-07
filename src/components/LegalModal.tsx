import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PrivacyContent, TermsContent } from "./LegalContent";

const UPDATED = "June 2026";

const TITLES: Record<LegalType, string> = {
  privacy: "Privacy Policy",
  terms:   "Terms of Service",
};

export type LegalType = "privacy" | "terms";

interface LegalModalProps {
  type: LegalType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LegalModal = ({ type, open, onOpenChange }: LegalModalProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="legal-modal-overlay" />
      <DialogPrimitive.Content className="legal-modal-content" aria-describedby={undefined}>
        <div className="legal-modal-header">
          <div>
            <div className="tk-eyebrow" style={{ marginBottom: 4 }}>Legal</div>
            <DialogPrimitive.Title className="tk-display-md" style={{ margin: 0 }}>
              {TITLES[type]}
            </DialogPrimitive.Title>
            <p className="legal-meta" style={{ marginTop: 4 }}>Last updated: {UPDATED}</p>
          </div>
          <DialogPrimitive.Close className="legal-modal-close" aria-label="Close">
            <X size={16} />
          </DialogPrimitive.Close>
        </div>

        <div className="legal-modal-body">
          {type === "privacy" ? <PrivacyContent /> : <TermsContent />}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);
