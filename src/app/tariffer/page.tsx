"use client";
import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface Tariff {
  id: number;
  type: string;
  tariff: string;
  unit: string;
  year: string;
  isVariable: boolean;
}

const tariffTypes = ["Consumption Tariff", "Environmental Tariff"];
const years = ["2023", "2024"];

export default function Tariffs() {
  const [tariffs, setTariffs] = useState<Tariff[]>([
    {
      id: 1,
      type: "Consumption Tariff",
      tariff: "0.54",
      unit: "0re/kWh",
      year: "2023",
      isVariable: true,
    },
    {
      id: 2,
      type: "Environmental Tariff",
      tariff: "0.20",
      unit: "0re/kWh",
      year: "2023",
      isVariable: true,
    },
  ]);

  const [newTariff, setNewTariff] = useState<Tariff>({
    id: 0,
    type: "Select from List",
    tariff: "0.00",
    unit: "0re/kWh",
    year: "Select from List",
    isVariable: true,
  });

  const addNewTariff = () => {
    if (
      newTariff.type !== "Select from List" &&
      newTariff.year !== "Select from List"
    ) {
      setTariffs([...tariffs, { ...newTariff, id: tariffs.length + 1 }]);
      setNewTariff({
        id: 0,
        type: "Select from List",
        tariff: "0.00",
        unit: "0re/kWh",
        year: "Select from List",
        isVariable: true,
      });
    }
  };

  const removeTariff = (id: number) => {
    setTariffs(tariffs.filter((tariff) => tariff.id !== id));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-10 ">
      <div className="bg-white px-8 py-20 rounded-lg shadow w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-[#082351] mb-4">
          Region-Specific Tariffs
        </h2>
        <p className="text-gray-600 mb-8">
          Enter your tariffs for this facility so we can calculate your expenses
          and optimize our software to best utilize the energy market. If you
          cannot find your information, you can contact your local office at 45
          66 78 88.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-6 text-sm font-medium text-[#082351] mb-2">
            <div className="col-span-3">Type</div>
            <div className="col-span-2">Tariff</div>
            <div className="col-span-1"></div>
            <div className="col-span-2">Applicable</div>
            <div className="col-span-3">Billing</div>
            <div className="col-span-1"></div>
          </div>

          {tariffs.map((tariff) => (
            <div
              key={tariff.id}
              className="grid grid-cols-12 gap-6 items-center border-t border-gray-200 pt-4"
            >
              <div className="col-span-3">{tariff.type}</div>
              <div className="col-span-2">{tariff.tariff}</div>
              <div className="col-span-1 text-gray-500">{tariff.unit}</div>
              <div className="col-span-2 ml-4">{tariff.year}</div>
              <div className="col-span-3 flex space-x-3">
                <button
                  className={`py-2 px-4 rounded-md border ${
                    tariff.isVariable
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 border-gray-300"
                  }`}
                >
                  Variable
                </button>
                <button
                  className={`py-2 px-4 rounded-md border ${
                    !tariff.isVariable
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 border-gray-300"
                  }`}
                >
                  Constant
                </button>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => removeTariff(tariff.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-12 gap-6 items-center pt-4">
            <div className="relative col-span-3">
              <select
                value={newTariff.type}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, type: e.target.value })
                }
                className="w-full p-3 border rounded-md appearance-none pr-10 cursor-pointer"
              >
                <option value="Select from List">Select from List</option>
                {tariffTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="col-span-2">
              <input
                type="text"
                value={newTariff.tariff}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, tariff: e.target.value })
                }
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div className="col-span-1 text-gray-500">{newTariff.unit}</div>
            <div className="relative col-span-2 ml-4">
              <select
                value={newTariff.year}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, year: e.target.value })
                }
                className="w-full p-3 border rounded-md appearance-none cursor-pointer pr-10"
              >
                <option value="Select from List">Select from List</option>
                {years.map((year) => (
                  <option
                    key={year}
                    value={year}
                    className="p-2 text-gray-700 bg-white"
                  >
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="col-span-3 flex space-x-3">
              <button
                onClick={() => setNewTariff({ ...newTariff, isVariable: true })}
                className={`py-2 px-4 rounded-md border ${
                  newTariff.isVariable
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-gray-300"
                }`}
              >
                Variable
              </button>
              <button
                onClick={() =>
                  setNewTariff({ ...newTariff, isVariable: false })
                }
                className={`py-2 px-4 rounded-md border ${
                  !newTariff.isVariable
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-gray-300"
                }`}
              >
                Constant
              </button>
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={addNewTariff}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Plus size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
