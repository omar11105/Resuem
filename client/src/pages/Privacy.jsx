import LegalDocument from '../components/LegalDocument';

const LAST_UPDATED = 'May 22, 2025';

export default function Privacy() {
  return (
    <LegalDocument title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p className="legal-lead">
        This Privacy Policy describes how Omar Mohamed (&quot;we&quot;, &quot;us&quot;)
        collects, uses, and protects information when you use Resuem at resuem.org. Operated by
        Omar Mohamed.
      </p>

      <section>
        <h2>1. Data We Collect</h2>
        <p>We collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Account data:</strong> name and email address provided through Clerk
            authentication when you create or sign in to your account.
          </li>
          <li>
            <strong>Resume content:</strong> text you paste or upload (including PDF-derived text)
            for the purpose of tailoring, plus job descriptions you provide.
          </li>
          <li>
            <strong>Usage data:</strong> number of tailorings performed, timestamps, and related
            metadata needed to enforce plan limits and show your history.
          </li>
          <li>
            <strong>Payment data:</strong> subscriptions are processed by Lemon Squeezy. We do not store
            credit card numbers or full payment instrument details on our servers.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Data</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and operate the resume tailoring service;</li>
          <li>Enforce free tier and Pro subscription limits;</li>
          <li>Display your tailoring history in your account;</li>
          <li>Respond to support requests and legal inquiries;</li>
          <li>Maintain security and prevent abuse of the platform.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal data or resume content to third parties.
          We do <strong>not</strong> use your resume content to train general-purpose AI models.
        </p>
      </section>

      <section>
        <h2>3. Third-Party Services</h2>
        <p>Resuem relies on trusted processors to operate:</p>
        <ul>
          <li>
            <strong>Clerk</strong> (authentication) —{' '}
            <a
              href="https://clerk.com/privacy"
              className="legal-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              clerk.com/privacy
            </a>
          </li>
          <li>
            <strong>Lemon Squeezy</strong> (payments) —{' '}
            <a
              href="https://www.lemonsqueezy.com/privacy"
              className="legal-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              lemonsqueezy.com/privacy
            </a>
          </li>
          <li>
            <strong>Anthropic Claude API</strong> (AI processing) —{' '}
            <a
              href="https://www.anthropic.com/privacy"
              className="legal-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              anthropic.com/privacy
            </a>
          </li>
        </ul>
        <p>
          Resume content is sent to Anthropic&apos;s API for processing and is subject to
          Anthropic&apos;s privacy policy. We do not store resume content beyond your account
          history required to provide the service.
        </p>
      </section>

      <section>
        <h2>4. Data Retention</h2>
        <p>
          We retain account and tailoring history data while your account remains active. You may
          request deletion of your account and associated data by emailing support@resuem.org. We will
          delete or anonymize data within a reasonable period unless we must retain it for legal,
          security, or billing obligations.
        </p>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct, or delete
          personal data we hold about you. To exercise these rights, contact us at support@resuem.org.
          We will respond within a reasonable timeframe.
        </p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>
          We use only essential session cookies required for authentication through Clerk. We do
          not use advertising cookies or third-party tracking cookies for marketing purposes.
        </p>
      </section>

      <section>
        <h2>7. Contact</h2>
        <p>
          Privacy questions:{' '}
          <a href="mailto:support@resuem.org" className="legal-link">
            support@resuem.org
          </a>
        </p>
      </section>
    </LegalDocument>
  );
}
