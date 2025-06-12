import { getQuery, markAsRead, sendReply } from "@/services/customerServices";
import { useEffect, useState, useCallback } from "react";

interface Contact {
  id: string;
  email: string;
  companyName: string;
  subject: string;
  body: string;
  createdAt: string;
  seen: boolean;
}

interface ContactListProps {
  onUnreadCountChange?: (count: number) => void;
}

export default function ContactList({ onUnreadCountChange }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type: string, message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 3000);
  };

  const fetchQueries = useCallback(async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";
      
      if (!token || !IdToken) {
        throw new Error("Missing authentication tokens");
      }
      
      const data = await getQuery(token, IdToken);
      setContacts(data);
      
      const unreadCount = data.filter((contact: Contact) => !contact.seen).length;
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }
      
      console.log('Fetched contacts:', data.length, 'Unread:', unreadCount);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      showAlert("error", "Failed to fetch queries. Please try again.");
    } finally {
      if (showLoadingSpinner) {
        setLoading(false);
      }
    }
  }, [onUnreadCountChange]);

  useEffect(() => {
    fetchQueries(true);
  }, [fetchQueries]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchQueries(false);
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [fetchQueries]);

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
      
      const updatedContacts = contacts.map((contact) =>
        contact.id === id ? { ...contact, seen: true } : contact
      );
      setContacts(updatedContacts);
      
      const unreadCount = updatedContacts.filter((contact) => !contact.seen).length;
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }
      
      showAlert("success", "Marked as resolved successfully!");
      
      setTimeout(() => {
        fetchQueries(false);
      }, 60000);
      
    } catch (err) {
      console.error("Failed to mark as read:", err);
      showAlert("error", "Failed to mark as resolved. Please try again.");
    }
  };

  const openReplyModal = (contact: Contact) => {
    setCurrentContact(contact);
    setReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setReplyText("");
    setCurrentContact(null);
  };

  const handleSendReply = async () => {
    if (!currentContact) return;

    try {
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";

      await sendReply(
        currentContact.subject,
        replyText,
        currentContact.email,
        token,
        IdToken
      );
      await markAsRead(currentContact.id, token, IdToken);

      const updatedContacts = contacts.map((contact) =>
        contact.id === currentContact.id
          ? { ...contact, seen: true }
          : contact
      );
      setContacts(updatedContacts);
      
      const unreadCount = updatedContacts.filter((contact) => !contact.seen).length;
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }

      closeReplyModal();
      showAlert("success", "Reply sent successfully!");
      
      setTimeout(() => {
        fetchQueries(false);
      }, 1000);
      
    } catch (error) {
      console.error("Failed to send reply:", error);
      showAlert("error", "Failed to send reply. Please try again.");
    }
  };

  const unresolvedCount = contacts.filter(contact => !contact.seen).length;
  const resolvedCount = contacts.filter(contact => contact.seen).length;

  return (
    <>
      {alert.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 sm:w-1/3 min-w-64">
          <div 
            className={`mb-4 p-3 sm:p-4 rounded-md shadow-lg ${
              alert.type === "success" 
                ? "bg-green-100 text-green-800 border border-green-400" 
                : "bg-red-100 text-red-800 border border-red-400"
            }`}
          >
            {alert.message}
          </div>
        </div>
      )}
      
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div
            className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )}

      {replyModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
          <div className="absolute inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm"></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg z-10 max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium truncate pr-4">
                  Reply to {currentContact?.email}
                </h3>
                <button
                  onClick={closeReplyModal}
                  className="text-gray-400 hover:text-gray-500 flex-shrink-0"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2 break-words">
                  Subject: {currentContact?.subject}
                </p>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={6}
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={closeReplyModal}
                  className="w-full sm:w-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendReply}
                  className="w-full sm:w-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!replyText.trim()}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-600 mb-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">Unresolved</p>
                        <p className="text-2xl font-bold text-red-900">{unresolvedCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-600 mb-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Resolved</p>
                        <p className="text-2xl font-bold text-green-900">{resolvedCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-600 mb-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">Total Messages</p>
                        <p className="text-2xl font-bold text-blue-900">{contacts.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
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
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="Search by email, company, or subject"
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contact List */}
                <div className="overflow-hidden bg-white sm:rounded-md">
                  {filteredContacts.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <li
                          key={contact.id}
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            !contact.seen 
                              ? "bg-red-50 border-l-4 border-red-400" 
                              : "bg-green-50 border-l-4 border-green-400"
                          }`}
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div
                              onClick={() => toggleExpand(contact.id)}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-blue-600">
                                    {contact.email}
                                  </p>
                                  <div className="flex-shrink-0">
                                    {contact.seen ? (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Resolved
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        Unresolved
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <p className="flex items-center text-sm text-gray-500">
                                    <svg
                                      className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
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
                                    <span className="truncate">{contact.companyName}</span>
                                  </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-900">Subject:</span>{" "}
                                  <span className="break-words">{contact.subject}</span>
                                </div>
                              </div>
                            </div>

                            {expandedId === contact.id && (
                              <div className="mt-4 bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-800 mb-2">
                                  Message:
                                </h4>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap break-words mb-4">
                                  {contact.body}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  {!contact.seen && (
                                    <button
                                      type="button"
                                      onClick={() => handleMarkAsRead(contact.id)}
                                      className="w-full sm:w-auto inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                      Mark as Resolved
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => openReplyModal(contact)}
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
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
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
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