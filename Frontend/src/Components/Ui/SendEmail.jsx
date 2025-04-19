import { useState } from "react";
import InputLabel from "./InputLabel.jsx";
import Button from "./Button.jsx";
import RoundButton from "./RoundButton.jsx";
import PropTypes from "prop-types";
import { sendEmail } from "../../Api/Mail.js";

function SendEmail({ handleNewMail }) {
  const [form, setForm] = useState({ recipients: "", subject: "", text: "" });
  const [errors, setErrors] = useState({ recipients: "", subject: "", text: "" });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // фронт‑валидация
    const newErrors = {
      recipients: !form.recipients
        ? "Recipient is required"
        : form.recipients.length < 3
          ? "Recipient must be at least 3 characters"
          : "",
      subject: !form.subject
        ? "Subject is required"
        : form.subject.length < 3
          ? "Subject must be at least 3 characters"
          : "",
      text: !form.text
        ? "Message text is required"
        : form.text.length < 3
          ? "Message must be at least 3 characters"
          : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      await sendEmail({
        recipients: form.recipients.trim().toLowerCase(),
        subject: form.subject.trim(),
        text: form.text.trim(),
      });
      alert("Message sent successfully");
      setForm({ recipients: "", subject: "", text: "" });
    } catch (err) {
      console.error("SendEmail error:", err);
      setErrors((e) => ({ ...e, recipients: err.message }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="z-40 flex flex-col absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-container max-w-[1127px] w-[97%] border border-stroke py-[20px] rounded-[24px]"
    >
      <div className="flex flex-col px-[24px] space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-text-primary text-[24px] font-bold">Send email</div>
          <RoundButton onClick={handleNewMail} />
        </div>

        <InputLabel text="Recipients" />
        <input
          name="recipients"
          onChange={handleChange}
          value={form.recipients}
          placeholder="Enter recipient"
          className={`focus:outline-none placeholder:opacity-60 font-sans font-light w-full p-[12px] rounded-[10px] bg-input text-text-secondary border ${
            errors.recipients ? "border-red-500" : "border-stroke"
          }`}
        />
        {errors.recipients && <p className="text-red-500 text-sm">{errors.recipients}</p>}

        <InputLabel text="Subject" />
        <input
          name="subject"
          onChange={handleChange}
          value={form.subject}
          placeholder="Enter subject"
          className={`focus:outline-none placeholder:opacity-60 font-sans font-light w-full p-[12px] rounded-[10px] bg-input text-text-secondary border ${
            errors.subject ? "border-red-500" : "border-stroke"
          }`}
        />
        {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}

        <InputLabel text="Enter message text" />
        <textarea
          name="text"
          onChange={handleChange}
          value={form.text}
          placeholder="Write your message..."
          rows={5}
          className={`resize-none focus:outline-none placeholder:opacity-60 font-sans font-light w-full p-[12px] rounded-[10px] bg-input text-text-secondary border ${
            errors.text ? "border-red-500" : "border-stroke"
          }`}
        />
        {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}

        <div className="mt-4 w-full">
          <Button type="submit" className="w-full">
            Send Email
          </Button>
        </div>
      </div>
    </form>
  );
}

SendEmail.propTypes = {
  handleNewMail: PropTypes.func.isRequired,
};

export default SendEmail;
