"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import AdminSidebar from "@/components/dashboard/Sidebar";
import withAuth from "@/auth/authUtils";

function SettingsPage() {
  const { t, i18n } = useTranslation("settings");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar facilityId="" />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            {t("title")}
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("languageSelector.title")}
              </label>
              <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                {[
                  { code: "en", label: "English" },
                  { code: "da", label: "Danish" },
                  { code: "de", label: "German" },
                ].map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`
                      py-2 px-4 rounded-md transition-all duration-300
                      ${
                        i18n.language === code
                          ? "bg-blue-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(SettingsPage);
