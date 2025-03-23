import { useRouter } from "next/navigation";

interface Users {
  userId?: number;
  companyName?: string;
  cvrNumber?: string;
  status?: string;
}
export default function GridView({ users }: { users: Users[] }) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      {/* Inactive Section */}
      <div
        className="cursor-pointer"
      >
        <h2 className="text-gray-600 text-lg font-semibold mb-3">Inactive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users
            .filter((user) => user.status !== "Active")
            .map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
                onClick={() =>
                  router.push(`/admin/user/${user.userId}`)
                }
              >
                <div>
                  <h3 className="text-gray-800 text-sm font-semibold">
                    {user.companyName}
                  </h3>
                  <p className="text-gray-600 text-xs">{user.cvrNumber}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <img
                      src={
                        user.status === "Data Missing"
                          ? "/Missing.png"
                          : user.status === "Inactive"
                          ? "/Inactive.png"
                          : user.status === "Maintenance"
                          ? "/Maintenance.jpg"
                          : "/warning.png"
                      }
                      alt={user.status}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      {user.status}
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

      {/* Active Section */}
      <div className="cursor-pointer">
        <h2 className="text-gray-600 text-lg font-semibold mb-3">Active</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users
            .filter((user) => user.status === "Active")
            .map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
                onClick={() =>
                  router.push(`/admin/user/${user.userId}`)
                }
              >
                <div>
                  <h3 className="text-gray-800 text-sm font-semibold">
                    {user.companyName}
                  </h3>
                  <p className="text-gray-600 text-xs">{user.cvrNumber}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <img src="/Active.png" alt="Active" className="w-5 h-5" />
                    <span className="text-sm text-gray-700">
                      {user.status}
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

      {/* No Data Message */}
      {users.length === 0 && (
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
