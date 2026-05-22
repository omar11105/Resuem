import { Link } from 'react-router-dom';
import LegalDocument from '../components/LegalDocument';

const LAST_UPDATED = 'May 22, 2025';

export default function Terms() {
  return (
    <LegalDocument title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p className="legal-lead">
        Resuem (resuem.org) is operated by Omar Mohamed (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
        By accessing or using Resuem, you agree to be bound by these Terms of Service. If you
        do not agree, do not use the service.
      </p>

      <p className="legal-callout">
        Resuem is an automated software platform. All resume tailoring is performed by AI
        algorithms. No human consultants, career coaches, or advisors are involved in the
        tailoring process.
      </p>

      <section>
        <h2>1. About Resuem</h2>
        <p>
          Resuem is a web-based software application that helps job seekers tailor their
          resumes to specific job descriptions. You provide your resume content and a target job
          posting; our software uses artificial intelligence to suggest revised bullet points,
          project descriptions, and summaries aligned with that role. The service includes
          comparison views, change explanations, usage limits on the free tier, and optional Pro
          features such as unlimited tailorings and export options.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years of age to use Resuem. By using the service, you
          represent that you meet this requirement and that you have the legal capacity to enter
          into these terms. If you are using Resuem on behalf of an organization, you represent
          that you have authority to bind that organization to these terms.
        </p>
      </section>

      <section>
        <h2>3. Account Registration</h2>
        <p>
          Access to Resuem requires an account, provided through our authentication partner
          Clerk. You are responsible for maintaining the confidentiality of your login
          credentials and for all activity that occurs under your account. Notify us immediately
          at support@resuem.org if you suspect unauthorized access. We are not liable for losses arising
          from your failure to secure your account.
        </p>
      </section>

      <section>
        <h2>4. Subscription and Billing</h2>
        <p>
          Resuem offers a free tier that includes one resume tailoring per calendar day, and a
          Pro subscription at $9 USD per month that includes unlimited tailorings and additional
          features as described on our{' '}
          <Link to="/pricing">pricing page</Link>.
        </p>
        <p>
          Payments are processed by Paddle.com, our Merchant of Record. Paddle handles all
          billing, invoicing, and tax compliance. When you purchase a Pro subscription, you
          are purchasing from Paddle, not directly from Omar Mohamed. Subscription fees renew
          automatically each billing period until you cancel. You may cancel at any time through
          your account or by contacting us; cancellation takes effect at the end of the current
          billing period unless otherwise required by law.
        </p>
      </section>

      <section>
        <h2>5. Refund Policy</h2>
        <p>
          Pro subscriptions are eligible for our 30-day money-back guarantee. See our{' '}
          <Link to="/refund">Refund Policy</Link> for full details.
        </p>
      </section>

      <section>
        <h2>6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Scrape, crawl, or use automated means to access the service except as we expressly
            permit;
          </li>
          <li>
            Upload resume content belonging to another person without their permission;
          </li>
          <li>
            Misrepresent AI-generated tailoring output as human-written professional career
            advice or guarantee employment outcomes;
          </li>
          <li>
            Attempt to reverse engineer, disrupt, or overload the platform or its underlying
            systems;
          </li>
          <li>Use Resuem for any unlawful purpose or in violation of applicable law.</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules without prior notice
          where permitted by law.
        </p>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <p>
          You retain ownership of the resume content you submit. By using Resuem, you grant us
          a limited license to process that content solely to provide the tailoring service,
          including transmitting it to our AI processing providers as described in our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <p>
          Resuem, including its software, design, branding, and the structure of AI-generated
          outputs as delivered through the platform, is owned by Omar Mohamed or its
          licensors. You may not copy, modify, or redistribute the platform except as allowed by
          these terms or applicable law.
        </p>
      </section>

      <section>
        <h2>8. Disclaimer</h2>
        <p>
          Resuem tailoring suggestions are provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. We do not guarantee interview invitations, job offers, or any
          particular hiring outcome. AI output may contain errors or omissions. You are solely
          responsible for reviewing, editing, and approving any resume content before you submit
          it to employers or other third parties.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Omar Mohamed and its affiliates will not
          be liable for any indirect, incidental, special, consequential, or punitive damages,
          or for lost profits or data, arising from your use of Resuem. Our total liability for
          any claim relating to the service is limited to the amount you paid to us (or through
          Paddle on our behalf) in the three months preceding the event giving rise to the claim.
        </p>
      </section>

      <section>
        <h2>10. Governing Law</h2>
        <p>These terms are governed by the laws of Kuwait.</p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about these terms:{' '}
          <a href="mailto:support@resuem.org" className="legal-link">
            support@resuem.org
          </a>
        </p>
      </section>
    </LegalDocument>
  );
}
