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
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type:any, message:any) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 3000); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      showAlert("error", t("alertError"));
      return;
    }

    try {
      const token = localStorage.getItem("token") || undefined;
      const IdToken = localStorage.getItem("IdToken") || undefined;

      await sendQuery(subject, message, token, IdToken);

      showAlert("success", t("failure") || "Your query has been submitted successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", t("failure") || "Failed to submit your query. Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 py-6 md:px-10 md:py-10">
        {alert.show && (
          <div 
            className={`mb-4 p-4 rounded-md ${
              alert.type === "success" 
                ? "bg-green-100 text-green-800 border border-green-400" 
                : "bg-red-100 text-red-800 border border-red-400"
            }`}
          >
            {alert.message}
          </div>
        )}
        
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
              {SUBJECT_OPTIONS_KEYS.map((key) => {
                const translated = t(`subjects.${key}`);
                return (
                  <option key={key} value={translated}>
                    {translated}
                  </option>
                );
              })}
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
