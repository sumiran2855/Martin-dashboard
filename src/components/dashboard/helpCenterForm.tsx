"use client";

import { sendQuery } from "@/services/customerServices";
import React, { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";

const SUBJECT_OPTIONS_KEYS = [
  "problemXRGi",
  "problemAddingInfo",
  "questionSuperSaver",
  "contactEC",
  "otherInquiry",
];

export default function HelpCenterForm() {
  const { t } = useTranslation("helpCenter");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return alert(t("alertError"));

    try {
      const token = localStorage.getItem("token") || undefined;
      const IdToken = localStorage.getItem("IdToken") || undefined;

      await sendQuery(subject, message, token, IdToken);

      alert(t("alertSuccess"));
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("alertError"));
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-10 py-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("subject")}
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t("selectSubject")}</option>
              {SUBJECT_OPTIONS_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`subjects.${key}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("message")}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t("placeholder")}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t("sendMessage")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
