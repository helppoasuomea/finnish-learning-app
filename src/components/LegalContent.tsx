const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="legal-section">
    <h2 className="legal-h2">{title}</h2>
    <div className="legal-section-body">{children}</div>
  </section>
);

export const PrivacyContent = () => (
  <>
    <p className="legal-lead">
      Lukeā is a language learning app. This policy explains what personal data we collect, why
      we collect it, and what rights you have over it.
    </p>

    <Section title="Data we collect">
      <p>When you create an account we collect:</p>
      <ul>
        <li><strong>Account details</strong> — username, email address, and a hashed password.</li>
        <li><strong>Learning data</strong> — decks, flashcards, review history, saved sentences, and grammar progress.</li>
        <li><strong>Preferences</strong> — language selection, notification settings, and display preferences.</li>
        <li><strong>Device identifier</strong> — a randomly generated ID stored on your device to enable PIN-based quick access. It is not linked to any hardware identifier.</li>
        <li><strong>Google account info</strong> — if you sign in with Google, we receive your profile name and email. If you connect Google Calendar, we store a scoped access token for that calendar only.</li>
      </ul>
      <p>We do not collect payment information, location data, or sell data to third parties.</p>
    </Section>

    <Section title="How we use your data">
      <ul>
        <li>To provide and personalise the service (scheduling reviews, tracking progress).</li>
        <li>To send study reminders if you enable notifications.</li>
        <li>To improve the app based on aggregate, anonymised usage patterns.</li>
      </ul>
      <p>We do not use your data for advertising.</p>
    </Section>

    <Section title="Cookies">
      <p>
        We use a single authentication cookie (<code className="legal-code">token</code>) to keep
        you signed in. This cookie is strictly necessary for the service to function and does not
        require your consent under ePrivacy rules.
      </p>
      <p>
        We also store small preferences in your browser's local storage (dismissed tips, language
        choice, and similar). These contain no personally identifying information.
      </p>
      <p>We do not use advertising, tracking, or analytics cookies.</p>
    </Section>

    <Section title="Data retention">
      <p>
        Your data is kept for as long as your account is active. You can delete your account at
        any time from <strong>Settings → Leave quietly → Delete account</strong>. After deletion,
        a 30-day grace period lets you cancel before all data is permanently erased.
      </p>
    </Section>

    <Section title="Your rights">
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access</strong> your data — export everything from Settings → Library &amp; Data → Export.</li>
        <li><strong>Correct</strong> your data — update your name, username, and email in Settings.</li>
        <li><strong>Delete</strong> your data — use the Delete account option in Settings.</li>
        <li><strong>Withdraw consent</strong> for Google Calendar access — revoke it at any time in Settings → Google.</li>
      </ul>
      <p>
        If you are in the EU or EEA, you also have the right to lodge a complaint with your local
        supervisory authority.
      </p>
    </Section>

    <Section title="Third-party services">
      <p>
        We use Google OAuth for sign-in and optional Calendar integration. Google's privacy
        policy governs data processed by Google. We do not share your data with any other
        third parties.
      </p>
    </Section>

    <Section title="Contact">
      <p>
        Questions about this policy? Email us at{" "}
        <a href="mailto:hello@lukea.app" className="legal-link">hello@lukea.app</a>.
      </p>
    </Section>
  </>
);

export const TermsContent = () => (
  <>
    <p className="legal-lead">
      By creating an account or using Lukeā, you agree to these terms. They're written to be
      understood, not to confuse.
    </p>

    <Section title="Using the service">
      <p>Lukeā is a language learning app. You may use it for personal, non-commercial learning purposes.</p>
      <ul>
        <li>You must be at least 13 years old to create an account.</li>
        <li>You are responsible for keeping your account credentials secure.</li>
        <li>One account per person — shared accounts are not permitted.</li>
      </ul>
    </Section>

    <Section title="Your content">
      <p>
        Decks, cards, and sentences you create belong to you. By saving them in Lukeā, you grant
        us a limited licence to store and display them to you as part of the service.
      </p>
      <p>
        You may not upload content that infringes copyright, is harmful, or violates any
        applicable law. We reserve the right to remove content that violates these rules.
      </p>
    </Section>

    <Section title="Acceptable use">
      <p>You agree not to:</p>
      <ul>
        <li>Attempt to reverse-engineer, scrape, or disrupt the service.</li>
        <li>Create accounts programmatically or in bulk.</li>
        <li>Use the service in a way that could damage, disable, or impair it.</li>
      </ul>
    </Section>

    <Section title="Account termination">
      <p>
        You can delete your account at any time from Settings. We may suspend or terminate accounts
        that violate these terms. In either case, you can export your data before deletion.
      </p>
    </Section>

    <Section title="Availability">
      <p>
        We aim to keep Lukeā available and running well, but we don't guarantee uninterrupted
        access. The service is provided as-is. We are not liable for any loss of data or
        interruption of service.
      </p>
    </Section>

    <Section title="Changes to these terms">
      <p>
        We may update these terms from time to time. If we make significant changes, we'll
        notify you via email or an in-app notice. Continued use after changes take effect
        constitutes acceptance.
      </p>
    </Section>

    <Section title="Contact">
      <p>
        Questions? Email us at{" "}
        <a href="mailto:hello@lukea.app" className="legal-link">hello@lukea.app</a>.
      </p>
    </Section>
  </>
);
