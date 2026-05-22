import LegalDocument from '../components/LegalDocument';

const LAST_UPDATED = 'May 22, 2025';

export default function Refund() {
  return (
    <LegalDocument title="Refund Policy" lastUpdated={LAST_UPDATED}>
      <div className="space-y-lg text-sm leading-relaxed text-resuem-text-secondary">
        <p>
          Resuem offers a 30-day money-back guarantee on all Pro subscription purchases.
        </p>
        <p>
          If you are not satisfied with Resuem for any reason, contact us at support@resuem.org
          within 30 days of your purchase date and we will issue a full refund. No questions asked.
        </p>
        <p>
          Refund requests submitted after 30 days of the original purchase date may not be honored.
        </p>
        <p>
          To request a refund, email support@resuem.org with the subject line &apos;Refund Request&apos;
          and include the email address associated with your account. We will process your refund
          within 5 business days.
        </p>
        <p>
          Payments are processed by Paddle.com. Refunds will be returned to the original payment
          method.
        </p>
      </div>
    </LegalDocument>
  );
}
