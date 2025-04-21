import PropTypes from "prop-types";
import { getDate } from "../../Utils/Main.js";

export default function MailView({ mail }) {
  return (
    <div className="flex flex-col h-full bg-main">
      {/* Header */}
      <div className="p-6 border-b border-stroke flex flex-col space-y-2">
        <div className="text-text-secondary text-sm">
          From: <span className="font-bold text-text-primary">{mail.from}</span>
        </div>
        <div className="text-text-secondary text-sm">
          To: <span className="font-bold text-text-primary">{mail.to}</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{mail.subject}</h1>
        <div className="text-text-secondary text-xs">{getDate(mail.date)}</div>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1 prose max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: mail.html }}
        />
      </div>
    </div>
  );
}

MailView.propTypes = {
  mail: PropTypes.shape({
    from:       PropTypes.string.isRequired,
    to:         PropTypes.string,
    subject:    PropTypes.string,
    date:       PropTypes.string.isRequired,
    html:       PropTypes.string.isRequired,
  }).isRequired,
};
