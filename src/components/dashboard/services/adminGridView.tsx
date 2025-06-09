"use client";
import { Mail, Phone, User } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Facility {
  id?: number;
  facilityId?: string;
  name?: string;
  xrgiID?: string;
  modelNumber?: string;
  status?: string;
  hasServiceContract?: boolean;
  needServiceContract?: boolean;
  serviceProvider?: {
    name?: string | null;
    mailAddress?: string | null;
    phone?: string | null;
  } | null;
}

export default function GridView({ facilities }: { facilities: Facility[] }) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getFacilityStatus = (facility: Facility): "Active" | "Pending" => {
    if (
      facility.hasServiceContract &&
      facility.serviceProvider &&
      facility.serviceProvider.name &&
      facility.serviceProvider.mailAddress &&
      facility.serviceProvider.phone
    ) {
      return "Active";
    }

    if (facility.needServiceContract) {
      return "Pending";
    }

    return "Pending";
  };

  const withServiceProvider = facilities.filter(
    (facility) =>
      facility.hasServiceContract &&
      facility.serviceProvider &&
      facility.serviceProvider.name &&
      facility.serviceProvider.mailAddress &&
      facility.serviceProvider.phone
  );

  const requestingECPowerService = facilities.filter(
    (facility) =>
      (facility.hasServiceContract &&
        (!facility.serviceProvider ||
          (!facility.serviceProvider.name &&
            !facility.serviceProvider.mailAddress &&
            !facility.serviceProvider.phone))) ||
      (!facility.hasServiceContract && facility.needServiceContract === true)
  );

  const handleCardClick = (facilityId: string) => {
    setExpandedCard(expandedCard === facilityId ? null : facilityId);
  };

  const renderFacilityCards = (
    facilitiesList: Facility[],
    hasServiceProvider: boolean = false
  ) => {
    const cardsPerRow = 3;
    const rows = [];

    for (let i = 0; i < facilitiesList.length; i += cardsPerRow) {
      const rowFacilities = facilitiesList.slice(i, i + cardsPerRow);
      const expandedInThisRow = rowFacilities.find((facility) => {
        const facilityId = facility.id?.toString() || facility.facilityId || "";
        return expandedCard === facilityId;
      });

      rows.push(
        <div key={`row-${i}`} className="contents">
          {expandedInThisRow &&
            renderSingleCard(expandedInThisRow, hasServiceProvider, true)}

          {rowFacilities.map((facility, index) => {
            const facilityId =
              facility.id?.toString() || facility.facilityId || "";
            const isExpanded = expandedCard === facilityId;
            if (isExpanded) return null;
            return renderSingleCard(facility, hasServiceProvider, false);
          })}
        </div>
      );
    }

    return rows;
  };

  const renderSingleCard = (
    facility: Facility,
    hasServiceProvider: boolean = false,
    isExpandedView: boolean = false
  ) => {
    const facilityId = facility.id?.toString() || facility.facilityId || "";
    const isExpanded = expandedCard === facilityId;
    const currentStatus = getFacilityStatus(facility);

    const getStatusConfig = () => {
      switch (currentStatus) {
        case "Active":
          return {
            image: "/Active.png",
            text: "Active",
            color: "text-green-600",
          };
        case "Pending":
        default:
          return {
            image: "/Missing.png",
            text: "Pending",
            color: "text-orange-600",
          };
      }
    };

    const statusConfig = getStatusConfig();

    return (
      <div
        key={`${facilityId}-${isExpandedView ? "expanded" : "normal"}`}
        className={`border rounded-lg shadow-sm bg-white cursor-pointer transition-all duration-300 overflow-hidden ${
          isExpanded ? "shadow-lg ring-2 ring-blue-100" : "hover:shadow-md"
        } ${isExpandedView ? "col-span-full mb-4" : ""}`}
        onClick={() => hasServiceProvider && handleCardClick(facilityId)}
      >
        <div className="flex justify-between items-center p-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-800 text-sm font-semibold truncate">
              {facility.name}
            </h3>
            <p className="text-gray-600 text-xs">{facility.xrgiID}</p>
            <div className="flex items-center space-x-2 mt-2">
              <img
                src={statusConfig.image}
                alt={currentStatus}
                className="w-5 h-5"
              />
              <span className={`text-sm ${statusConfig.color}`}>
                {statusConfig.text}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <img
              src="/Rectangle 137.png"
              alt="facility"
              className="w-16 h-16 object-contain"
            />
            {hasServiceProvider && (
              <div
                className={`transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {!hasServiceProvider && facility.hasServiceContract && (
          <div className="px-4 pb-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-xs text-orange-600 font-medium">
                Has a service contract but requested a service partner.
              </span>
            </div>
          </div>
        )}

        {hasServiceProvider && facility.serviceProvider && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded || isExpandedView
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <h4 className="text-sm font-semibold text-gray-700">
                  Service Provider Details
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 font-medium">
                    Provider Name:
                  </span>
                  <span className="ml-2 text-gray-800 font-semibold">
                    {facility.serviceProvider.name}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 font-medium">
                    Email Address:
                  </span>
                  <span
                    className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer break-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {facility.serviceProvider.mailAddress}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 font-medium">
                    Phone Number:
                  </span>
                  <a
                    href={`tel:${facility.serviceProvider.phone}`}
                    className="ml-2 text-green-600 hover:text-green-800 font-medium cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {facility.serviceProvider.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {withServiceProvider.length > 0 && (
        <div>
          <h2 className="text-gray-600 text-lg font-semibold mb-3">
            XRGI® systems with a service partner
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderFacilityCards(withServiceProvider, true)}
          </div>
        </div>
      )}

      {requestingECPowerService.length > 0 && (
        <div>
          <h2 className="text-gray-600 text-lg font-semibold mb-3">
            XRGI® systems requesting service contract
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderFacilityCards(requestingECPowerService, false)}
          </div>
        </div>
      )}

      {facilities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <img
            src="/Folder Not Found.png"
            alt="No Data"
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
          <p className="text-gray-500 text-sm md:text-base mt-2">
            No registered facilities
          </p>
        </div>
      )}
    </div>
  );
}
