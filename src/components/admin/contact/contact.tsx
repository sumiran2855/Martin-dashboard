import { getQuery, markAsRead } from "@/services/customerServices";
import { useEffect, useState } from "react";

interface Contact {
  id: string;
  email: string;
  companyName: string;
  subject: string;
  body: string;
  createdAt: string;
  seen: boolean;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        const IdToken = localStorage.getItem("IdToken") || "";
        const data = await getQuery(token, IdToken);
        setContacts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const filteredContacts = [...contacts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .filter(
      (contact) =>
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";
      await markAsRead(id, token, IdToken);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, seen: true } : contact
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div
            className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )}
      {!loading && (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6 max-w-7xl">
                <div className="mb-6">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search by email, company, or subject"
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-hidden bg-white sm:rounded-md">
                  {filteredContacts.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <li
                          key={contact.id}
                          className={`hover:bg-gray-50 ${
                            !contact.seen ? "bg-yellow-50" : ""
                          }`}
                        >
                          {" "}
                          <div className="px-4 py-4 sm:px-6">
                            <div
                              onClick={() => toggleExpand(contact.id)}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <p className="truncate text-sm font-medium text-blue-600">
                                  {contact.email}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {new Date(
                                      contact.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    <svg
                                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v-1H5v1h10zm0 3v-1H5v1h10zM7 8h10V5H7v3z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {contact.companyName}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <p>
                                    <span className="font-medium text-gray-900">
                                      Subject:
                                    </span>{" "}
                                    {contact.subject}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {expandedId === contact.id && (
                              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                <h4 className="text-sm font-medium text-gray-800 mb-2">
                                  Message:
                                </h4>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                  {contact.body}
                                </p>
                                <div className="mt-4 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                                  <button
                                    type="button"
                                    onClick={() => handleMarkAsRead(contact.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Mark as Resolved
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No contacts found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No contacts match your search criteria.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
