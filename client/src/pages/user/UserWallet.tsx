
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const UserWallet = () => {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await userService.getUserWallet();
        setWallet(data);
      } catch (error) {
        console.error("Failed to fetch wallet", error);
      }
    };
    fetchWallet();
  }, []);

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
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                  {tx.bookingId && (
                    <p className="text-gray-300 text-xs mt-1">
                      Booking: {tx.bookingId.bookingId}
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
      </main>

      <Footer />
    </div>
  );
};

export default UserWallet;

// import { useEffect, useState } from "react";
// import { userService } from "../../services/userService";
// import Header from "../../components/User/Header";
// import Footer from "../../components/User/Footer";
// import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// const UserWallet = () => {
//   const [wallet, setWallet] = useState<any>(null);

//   useEffect(() => {
//     const fetchWallet = async () => {
//       try {
//         const data = await userService.getUserWallet();
//         setWallet(data);
//       } catch (error) {
//         console.error("Failed to fetch wallet", error);
//       }
//     };
//     fetchWallet();
//   }, []);

//   if (!wallet)
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <div className="flex-1 flex items-center justify-center text-gray-500">
//           Loading Wallet...
//         </div>
//         <Footer />
//       </div>
//     );

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Header />

//       {/* Main Content */}
//       <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
//           My Wallet
//         </h1>

//         {/* Wallet Balance */}
//         <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <p className="text-sm font-medium uppercase opacity-75">Current Balance</p>
//             <h2 className="text-3xl md:text-4xl font-bold mt-2">₹{wallet.balance}</h2>
//           </div>
//           <div className="mt-4 md:mt-0 text-sm opacity-75">Updated just now</div>
//         </div>

//         {/* Transactions */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
//             Transactions
//           </h2>

//           {wallet.transactions.length === 0 ? (
//             <p className="text-gray-500 text-center py-10">
//               No transactions yet
//             </p>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {wallet.transactions.map((tx: any) => (
//                 <li
//                   key={tx._id}
//                   className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex flex-col">
//                     <p className="font-medium text-gray-800">
//                       {tx.description || tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(tx.date).toLocaleString()}
//                     </p>
//                     {tx.bookingId && (
//                       <p className="text-xs text-gray-400">
//                         Booking: {tx.bookingId.bookingId}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2 mt-2 md:mt-0">
//                     {tx.type === "credit" ? (
//                       <FaArrowDown className="text-green-500" />
//                     ) : (
//                       <FaArrowUp className="text-red-500" />
//                     )}
//                     <span
//                       className={`font-semibold ${
//                         tx.type === "credit" ? "text-green-600" : "text-red-600"
//                       }`}
//                     >
//                       {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
//                     </span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default UserWallet;