
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const UserWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await userService.getUserWallet(page, limit);
        setWallet(data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch wallet", error);
      }
    };
    fetchWallet();
  }, [page]);

  if (!wallet)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Loading Wallet...
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-10 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">  </h1>

        {/* Wallet Balance Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Current Balance
            </p>
            <h2 className="text-5xl font-extrabold text-gray-900 mt-2">₹{wallet.balance}</h2>
          </div>
          <div className="mt-4 md:mt-0 text-gray-500 text-sm">
            Updated just now
          </div>
        </div>

        {/* Transactions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wallet.transactions.length === 0 ? (
            <div className="col-span-full bg-white p-6 rounded-2xl shadow-lg text-gray-500 text-center">
              No transactions yet
            </div>
          ) : (
            wallet.transactions.map((tx: any) => (
              <div
                key={tx._id}
                className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div>
                  <p className="text-gray-900 font-semibold text-lg">{tx.description || tx.type}</p>
                  <p className="text-gray-700 text-sm mt-1">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                  {tx.bookingId && (
                    <p className="text-gray-600 text-xs mt-1">
                      BookingId: {tx.bookingId.bookingId}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {tx.type === "credit" ? (
                    <FaArrowDown className="text-green-500 text-xl" />
                  ) : (
                    <FaArrowUp className="text-red-500 text-xl" />
                  )}
                  <span
                    className={`text-lg font-bold ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-6 gap-2">
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

      </main>

      <Footer />
    </div>
  );
};

export default UserWallet;
