import { useRouter } from "next/navigation";

interface Facility {
  facilityId?: number;
  name?: string;
  xrgiID?: string;
  modelNumber?: string;
  status?: string;
}
export default function GridView({ facilities }: { facilities: Facility[] }) {
  const inactiveFacilities = facilities.filter(
    (facility) => facility.status !== "Active"
  );

  const activeFacilities = facilities.filter(
    (facility) => facility.status === "Active"
  );

  const router = useRouter();
  return (
    <div className="space-y-6">
      {/* Inactive Section */}
      {inactiveFacilities.length > 0 && (
        <div className="cursor-pointer">
          <h2 className="text-gray-600 text-lg font-semibold mb-3">Inactive</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities
              .filter((facility) => facility.status !== "Active")
              .map((facility, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
                  onClick={() =>
                    router.push(`/admin/user/plantDetail/${facility.facilityId}`)
                  }
                >
                  <div>
                    <h3 className="text-gray-800 text-sm font-semibold">
                      {facility.name}
                    </h3>
                    <p className="text-gray-600 text-xs">{facility.xrgiID}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <img
                        src={
                          facility.status === "Data Missing"
                            ? "/Missing.png"
                            : facility.status === "Inactive"
                            ? "/Inactive.png"
                            : facility.status === "Maintenance"
                            ? "/Maintenance.jpg"
                            : "/warning.png"
                        }
                        alt={facility.status}
                        className="w-5 h-5"
                      />
                      <span className="text-sm text-gray-700">
                        {facility.status}
                      </span>
                    </div>
                  </div>
                  <img
                    src="/Rectangle 137.png"
                    alt="facility"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Active Section */}
      {activeFacilities.length > 0 && (
        <div className="cursor-pointer">
          <h2 className="text-gray-600 text-lg font-semibold mb-3">Active</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities
              .filter((facility) => facility.status === "Active")
              .map((facility, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
                  onClick={() =>
                    router.push(`/admin/user/plantDetail/${facility.facilityId}`)
                  }
                >
                  <div>
                    <h3 className="text-gray-800 text-sm font-semibold">
                      {facility.name}
                    </h3>
                    <p className="text-gray-600 text-xs">{facility.xrgiID}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <img src="/Active.png" alt="Active" className="w-5 h-5" />
                      <span className="text-sm text-gray-700">
                        {facility.status}
                      </span>
                    </div>
                  </div>
                  <img
                    src="/Rectangle 137.png"
                    alt="facility"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* No Data Message */}
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
