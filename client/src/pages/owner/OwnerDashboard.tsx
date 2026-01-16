import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaWallet,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ["#38a169", "#ecc94b", "#e53e3e", "#4299e1"];
const PROPERTY_COLORS = ["#ecc94b", "#38a169", "#e53e3e", "#718096"]; 

const OwnerDashboard = () => {
  // const { userData, fetchOwnerBookingStats, ownerBookingStats } =
  //   useAuthStore();

    const { userData, fetchOwnerBookingStatis, ownerBookingStatis, ownerPropertyStats, fetchOwnerPropertyStats } =
    useAuthStore();

  const [loadingStats, setLoadingStats] = useState(false);

  const isApproved = userData?.approvalStatus === "approved";

  useEffect(() => {
    if (!userData) return;

    let mounted = true;

    const loadStats = async () => {
      setLoadingStats(true);
      try {
       // await fetchOwnerBookingStats();
           // full stats
        await fetchOwnerBookingStatis(); 
        await fetchOwnerPropertyStats(); 
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [userData]);

  //   const pieData = useMemo(() => {
  //   if (!ownerBookingStatis) return [];
  //   return [
  //     { name: "Confirmed", value: ownerBookingStatis.confirmed },
  //     { name: "Pending", value: ownerBookingStatis.pending },
  //     { name: "Cancelled", value: ownerBookingStatis.cancelled },
  //     { name: "Completed", value: ownerBookingStatis.completed },
  //   ];
  // }, [ownerBookingStatis]);
const pieData = useMemo(() => {
  if (!ownerBookingStatis) {
    return [
      { name: "Confirmed", value: 0 },
      { name: "Pending", value: 0 },
      { name: "Cancelled", value: 0 },
      { name: "Completed", value: 0 },
    ];
  }
  return [
    { name: "Confirmed", value: ownerBookingStatis.confirmed },
    { name: "Pending", value: ownerBookingStatis.pending },
    { name: "Cancelled", value: ownerBookingStatis.cancelled },
    { name: "Completed", value: ownerBookingStatis.completed },
  ];
}, [ownerBookingStatis]);

const totalBookings = useMemo(() => {
  if (!ownerBookingStatis) return 0;

  const { confirmed, pending, cancelled, completed } = ownerBookingStatis;
  return confirmed + pending + cancelled + completed;
}, [ownerBookingStatis]);

const propertyPieData = useMemo(() => {
  if (!ownerPropertyStats) {
    return [
      { name: "Pending", value: 0 },
      { name: "Active", value: 0 },
      { name: "Blocked", value: 0 },
      { name: "Rejected", value: 0 },
    ];
  }

  return [
    { name: "Pending", value: ownerPropertyStats.pending },
    { name: "Active", value: ownerPropertyStats.active },
    { name: "Blocked", value: ownerPropertyStats.blocked },
    { name: "Rejected", value: ownerPropertyStats.rejected },
  ];
}, [ownerPropertyStats]);

 
  // const stats = useMemo(() => {
  //   // if (!ownerBookingStats) return [];
  //      if (!ownerBookingStatis) return [];

  //   return [
  //     {
  //       title: "Total Bookings",
  //       value: ownerBookingStats.totalBookings,
  //       icon: <FaCalendarAlt />,
  //       color: "from-indigo-500 to-indigo-700",
  //     },
  //     {
  //       title: "Upcoming Bookings",
  //       value: ownerBookingStats.bookingsByTimeline.upcoming,
  //       icon: <FaClock />,
  //       color: "from-blue-500 to-blue-700",
  //     },
  //     {
  //       title: "Ongoing Bookings",
  //       value: ownerBookingStats.bookingsByTimeline.ongoing,
  //       icon: <FaCalendarAlt />,
  //       color: "from-emerald-500 to-emerald-700",
  //     },
  //     {
  //       title: "Past Bookings",
  //       value: ownerBookingStats.bookingsByTimeline.past,
  //       icon: <FaCalendarAlt />,
  //       color: "from-slate-500 to-slate-700",
  //     },
  //     {
  //       title: "Confirmed Bookings",
  //       value: ownerBookingStats.bookingsByStatus.confirmed,
  //       icon: <FaCheckCircle />,
  //       color: "from-green-500 to-green-700",
  //     },
  //     {
  //       title: "Cancelled Bookings",
  //       value: ownerBookingStats.bookingsByStatus.cancelled,
  //       icon: <FaTimesCircle />,
  //       color: "from-red-500 to-red-700",
  //     },
  //     {
  //       title: "Total Revenue",
  //       value: `₹${ownerBookingStats.revenue.totalRevenue}`,
  //       icon: <FaWallet />,
  //       color: "from-purple-500 to-purple-700",
  //     },
  //     {
  //       title: "Refunded Amount",
  //       value: `₹${ownerBookingStats.revenue.refundedAmount}`,
  //       icon: <FaWallet />,
  //       color: "from-orange-500 to-orange-700",
  //     },
  //   ];
  // }, [ownerBookingStats]);

  return (
    <OwnerLayout>
      <div>
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          Dashboard Overview
        </h1>

        {/* Approval Warning */}
        {!isApproved && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              userData?.approvalStatus === "pending"
                ? "bg-yellow-50 border-yellow-400"
                : "bg-red-50 border-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {userData?.approvalStatus === "pending" ? (
                <FaClock className="text-yellow-500" />
              ) : (
                <FaExclamationTriangle className="text-red-500" />
              )}
              <div>
                <h3 className="font-medium">
                  {userData?.approvalStatus === "pending"
                    ? "Account Under Review"
                    : "Account Action Required"}
                </h3>
                <p className="text-sm mt-1">
                  {userData?.approvalStatus === "pending"
                    ? "Your account is being reviewed. Property listing will be available once approved."
                    : "Your account needs attention. Please contact support or resubmit documents."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Account Status + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Account Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Account Status</p>
                <p className="text-2xl font-bold capitalize">
                  {userData?.approvalStatus}
                </p>
              </div>
              {userData?.approvalStatus === "approved" && (
                <FaCheckCircle className="text-green-500 text-2xl" />
              )}
              {userData?.approvalStatus === "pending" && (
                <FaClock className="text-yellow-500 text-2xl" />
              )}
              {userData?.approvalStatus === "rejected" && (
                <FaTimesCircle className="text-red-500 text-2xl" />
              )}
            </div>
          </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">Total Bookings</p>
        <p className="text-2xl font-bold">{totalBookings}</p>
      </div>
      <FaCalendarAlt className="text-indigo-500 text-2xl" />
    </div>
  </div>
       <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500">Total Revenue</p>
      <p className="text-2xl font-bold">₹{ownerBookingStatis?.revenue?.totalRevenue || 0}</p>
    </div>
    <FaWallet className="text-purple-500 text-2xl" />
  </div>
</div>

<div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500">Refunded Amount</p>
      <p className="text-2xl font-bold">₹{ownerBookingStatis?.revenue?.refundedAmount || 0}</p>
    </div>
    <FaWallet className="text-orange-500 text-2xl" />
  </div>
</div>
  

        </div>
          <div className="flex flex-col md:flex-row gap-6 mb-8">
         {/* <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8"> */}
           <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Booking Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8"> */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
  <h2 className="text-lg font-bold mb-4">Property Status Overview</h2>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={propertyPieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {propertyPieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PROPERTY_COLORS[index % PROPERTY_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
</div>
</div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;
