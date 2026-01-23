

import { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { ownerService } from "../../services/ownerService";
import OwnerSidebar from "../../components/Owner/OwnerSidebar";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const OwnerWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); 
const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        // const data = await ownerService.getOwnerWallet();
         const data = await ownerService.getOwnerWallet(page, limit);
        setWallet(data);
         setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch wallet", error);
      }
    };
    fetchWallet();
  }, [page]);

  if (!wallet)
    return <p className="p-6 text-gray-500 text-center">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <OwnerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          My Wallet
        </h1>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl p-8 shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p className="text-sm font-medium uppercase opacity-75">
              Current Balance
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              ₹{wallet.balance}
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-sm opacity-75">
            Updated just now
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
            Transactions
          </h3>

          {wallet.transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No transactions yet
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {wallet.transactions.map((tx: any) => (
                <li
                  key={tx._id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 hover:bg-gray-50 transition-colors px-4 rounded-lg"
                >
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-800">
                      {tx.description || tx.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                      {tx.bookingId && (
                    <p className="text-xs text-gray-400">
                       Booking: {tx.bookingId.bookingId}
                    </p>
                       )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {tx.type === "credit" ? (
                      <FaArrowDown className="text-green-500" />
                    ) : (
                      <FaArrowUp className="text-red-500" />
                    )}
                    <span
                      className={`font-semibold ${
                        tx.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-center mt-4 gap-2">
  <button
    disabled={page <= 1}
    onClick={() => setPage(prev => prev - 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Previous
  </button>
  <span className="px-2 py-2">{page} / {totalPages}</span>
  <button
    disabled={page >= totalPages}
    onClick={() => setPage(prev => prev + 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>
    </div>
  );
};

export default OwnerWallet;
