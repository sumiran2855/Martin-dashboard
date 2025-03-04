import { useState } from "react";

export default function StepFour() {
  const [isYearly, setIsYearly] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#082351DE] mb-2">
        Create a Subscription
      </h2>
      <p className="text-gray-600">
        The subscription charges monthly. Create a subscription today and start
        saving money on your first system. You can easily add more systems
        later.
      </p>
      <p className="text-gray-600 mb-6 font-bold">
        Read about your terms here.
      </p>

      <div className="bg-white px-6 py-4 rounded-lg mb-6 border border-gray-200 relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            className={`px-4 py-1 border rounded-md ${
              isYearly
                ? "bg-blue-600 text-white"
                : "border-blue-600 text-blue-600"
            }`}
            onClick={() => setIsYearly(true)}
          >
            Yearly
          </button>
          <button
            className={`px-4 py-1 border rounded-md ${
              !isYearly
                ? "bg-blue-600 text-white"
                : "border-blue-600 text-blue-600"
            }`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
        </div>

        <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
          Subscription Price
        </h2>
        <p className="text-2xl font-semibold text-[#082351DE]">
          20% <span className="text-gray-600 text-base">expected savings.</span>
        </p>
        <p className="text-sm text-gray-600">
          Based on your inputs from the previous page. This is calculated from
          your consumption data and our database... placeholder.
        </p>

        <p className="text-3xl font-bold text-blue-600 mt-4">
          {isYearly ? "1200/-" : "100/-"}{" "}
          <span className="text-lg text-gray-600">
            {isYearly ? "per year" : "per month"}
          </span>
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="w-5 h-5 flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold">
            ✓
          </span>
          <span>Green energy consumption</span>
          <span className="w-5 h-5 flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold">
            ✓
          </span>
          <span>Equipment from top suppliers</span>
          <span className="w-5 h-5 flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold">
            ✓
          </span>
          <span>Self-service with analytical insights</span>
        </div>
      </div>

      <div className="bg-white px-6 py-4 rounded-lg mb-6 border border-gray-200 relative">
        <div className="p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
            Payment Details
          </h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="installation"
                value="service_check"
                checked={selectedOption === "service_check"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">Invoice</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="installation"
                  value="local_partner"
                  checked={selectedOption === "local_partner"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">Credit Card</span>
              </label>

              {selectedOption === "local_partner" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 p-4 rounded-lg">
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="p-2 border rounded-md w-full"
                  />
                  <input
                    type="text"
                    placeholder="Registration Number"
                    className="p-2 border rounded-md w-full"
                  />
                </div>
              )}
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="installation"
                value="self_install"
                checked={selectedOption === "self_install"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">Payment Service</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-4 rounded-lg mb-6 border border-gray-200 relative">
        <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
          Billing Address
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md flex items-start space-x-3 mb-4">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"
            />
          </svg>
          <p className="text-sm mb-[-5]">
            We have pre-filled the fields from the information entered during
            profile creation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              placeholder="EC Power"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              CVR Number
            </label>
            <input
              type="text"
              placeholder="19228509"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              placeholder="Samsøvej 25"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Post Code
              </label>
              <input
                type="text"
                placeholder="8382"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                placeholder="Hinnerup"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="example123@gmail.eu"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Country Code
              </label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>+45</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                placeholder="87 43 41 00"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
