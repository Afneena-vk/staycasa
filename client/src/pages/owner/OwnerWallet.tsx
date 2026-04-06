

import { useEffect, useState } from "react";
//import { authService } from "../../services/authService";
import { ownerService } from "../../services/ownerService";
//import OwnerSidebar from "../../components/Owner/OwnerSidebar";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

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
      
      } catch (error: unknown) {
  let message = "Failed to fetch wallet";

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error("Failed to fetch wallet:", message);
  toast.error(message);
}
    };
    fetchWallet();
  }, [page]);

  if (!wallet)
    return <p className="p-6 text-gray-500 text-center">Loading...</p>;

  return (
       <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          My Wallet
        </h1>

        {/* Wallet Balance Card */}
<div className="relative overflow-hidden rounded-2xl border border-blue-100 shadow-sm bg-gradient-to-br from-blue-950 via-blue-800 to-blue-500 p-6 md:p-8 mb-8">
  
  {/* Glow effect */}
  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full"></div>

  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
    <div>
      <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
        Current Balance
      </p>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
        ₹{wallet.balance}
      </h2>
    </div>

    <div className="mt-3 md:mt-0 text-xs text-white/60">
      Updated just now
    </div>
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
                      <FaArrowDown className="text-grey-800" />
                    ) : (
                      <FaArrowUp className="text-red-500" />
                    )}
                    <span
                      className={`font-semibold ${
                        tx.type === "credit" ? "text-grey-800" : "text-red-600"
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
    // className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg text-sm disabled:opacity-40 hover:opacity-90 transition"
  >
    Previous
  </button>
  <span className="px-2 py-2">Page {page} of {totalPages}</span>
  <button
    disabled={page >= totalPages}
    onClick={() => setPage(prev => prev + 1)}
    // className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
         className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg text-sm disabled:opacity-40 hover:opacity-90 transition"
  >
    Next
  </button>
</div>

      </div>
    
  );
};

export default OwnerWallet;
