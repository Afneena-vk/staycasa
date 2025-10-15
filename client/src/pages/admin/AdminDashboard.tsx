
import { useEffect, useState } from "react";
import ModernAdminLayout from "../../layouts/admin/AdminLayout";
import { authService } from "../../services/authService";
import { FaUsers, FaCrown, FaBuilding, FaCheckCircle, FaTimesCircle, FaClock, FaBan, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalOwners: number;
  approvedOwners: number;
  pendingOwners: number;
  rejectedOwners: number;
  totalProperties: number;
  activeProperties: number;
  pendingProperties: number;
  rejectedProperties: number;
  blockedProperties: number;
  bookedProperties: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalOwners: 0,
    approvedOwners: 0,
    pendingOwners: 0,
    rejectedOwners: 0,
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    rejectedProperties: 0,
    blockedProperties: 0,
    bookedProperties: 0,
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchAllUsers = async () => {
    try {
      
      const response = await authService.getUsers({ limit: 10000 });
      return response.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchAllOwners = async () => {
    try {
     
      const response = await authService.getOwners({ limit: 10000 });
      return response.owners || [];
    } catch (error) {
      console.error("Error fetching owners:", error);
      return [];
    }
  };

  const fetchAllProperties = async () => {
    try {
      const response = await authService.getAllPropertiesAdmin();
      return response.properties || [];
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [users, owners, properties] = await Promise.all([
        fetchAllUsers(),
        fetchAllOwners(),
        fetchAllProperties(),
      ]);

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.userStatus === "active").length,
        blockedUsers: users.filter((u: any) => u.userStatus === "blocked").length,
        totalOwners: owners.length,
        approvedOwners: owners.filter((o: any) => o.approvalStatus === "approved").length,
        pendingOwners: owners.filter((o: any) => o.approvalStatus === "pending").length,
        rejectedOwners: owners.filter((o: any) => o.approvalStatus === "rejected").length,
        totalProperties: properties.length,
        activeProperties: properties.filter((p: any) => p.status === "active").length,
        pendingProperties: properties.filter((p: any) => p.status === "pending").length,
        rejectedProperties: properties.filter((p: any) => p.status === "rejected").length,
        blockedProperties: properties.filter((p: any) => p.status === "blocked").length,
        bookedProperties: properties.filter((p: any) => p.status === "booked").length,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} active, ${stats.blockedUsers} blocked`,
      icon: FaUsers,
      color: "bg-blue-500",
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Property Owners",
      value: stats.totalOwners,
      subtitle: `${stats.approvedOwners} approved, ${stats.pendingOwners} pending`,
      icon: FaCrown,
      color: "bg-purple-500",
      onClick: () => navigate("/admin/owners"),
    },
    {
      title: "Total Properties",
      value: stats.totalProperties,
      subtitle: `${stats.activeProperties} active, ${stats.pendingProperties} pending`,
      icon: FaBuilding,
      color: "bg-green-500",
      onClick: () => navigate("/admin/properties"),
    },
    {
      title: "Booked Properties",
      value: stats.bookedProperties,
      subtitle: `${stats.blockedProperties} blocked`,
      icon: FaCheckCircle,
      color: "bg-orange-500",
      onClick: () => navigate("/admin/properties"),
    },
  ];

  const propertyStatusBreakdown = [
    { label: "Active", count: stats.activeProperties, icon: FaCheckCircle, color: "text-green-500" },
    { label: "Pending", count: stats.pendingProperties, icon: FaClock, color: "text-yellow-500" },
    { label: "Rejected", count: stats.rejectedProperties, icon: FaTimesCircle, color: "text-red-500" },
    { label: "Blocked", count: stats.blockedProperties, icon: FaBan, color: "text-gray-500" },
    { label: "Booked", count: stats.bookedProperties, icon: FaCheckCircle, color: "text-blue-500" },
  ];

  const ownerStatusBreakdown = [
    { label: "Approved", count: stats.approvedOwners, icon: FaCheckCircle, color: "text-green-500" },
    { label: "Pending", count: stats.pendingOwners, icon: FaClock, color: "text-yellow-500" },
    { label: "Rejected", count: stats.rejectedOwners, icon: FaTimesCircle, color: "text-red-500" },
  ];

  const quickActions = [
    { name: "Manage Users", path: "/admin/users", icon: FaUsers, color: "bg-blue-500" },
    { name: "Manage Owners", path: "/admin/owners", icon: FaCrown, color: "bg-purple-500" },
    { name: "Property Listings", path: "/admin/properties", icon: FaBuilding, color: "bg-green-500" },
    { name: "View Analytics", path: "/admin/analytics", icon: FaChartLine, color: "bg-pink-500" },
  ];

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-admin-card-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your platform's performance and key metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors text-sm font-medium"
            >
              Refresh Data
            </button>
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.title}
                onClick={stat.onClick}
                className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border hover:shadow-elevated transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-admin-card-foreground mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p>
                  </div>
                  <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border">
            <h2 className="text-xl font-semibold text-admin-card-foreground mb-6">
              Property Status Breakdown
            </h2>
            <div className="space-y-4">
              {propertyStatusBreakdown.map((item) => {
                const IconComponent = item.icon;
                const percentage = stats.totalProperties > 0 
                  ? ((item.count / stats.totalProperties) * 100).toFixed(1) 
                  : 0;
                
                return (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg hover:bg-admin-bg/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`${item.color} text-xl`} />
                      <span className="font-medium text-admin-card-foreground">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-admin-card-foreground">{item.count}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

 
          <div className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border">
            <h2 className="text-xl font-semibold text-admin-card-foreground mb-6">
              Owner Status Breakdown
            </h2>
            <div className="space-y-4">
              {ownerStatusBreakdown.map((item) => {
                const IconComponent = item.icon;
                const percentage = stats.totalOwners > 0 
                  ? ((item.count / stats.totalOwners) * 100).toFixed(1) 
                  : 0;
                
                return (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg hover:bg-admin-bg/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`${item.color} text-xl`} />
                      <span className="font-medium text-admin-card-foreground">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-admin-card-foreground">{item.count}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      
        <div className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border">
          <h2 className="text-xl font-semibold text-admin-card-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.name}
                  onClick={() => navigate(action.path)}
                  className="group flex items-center space-x-4 p-4 rounded-lg border border-admin-border hover:border-admin-primary/50 hover:bg-admin-bg/50 transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-admin-card-foreground group-hover:text-admin-primary transition-colors">
                      {action.name}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-card text-white">
            <h3 className="text-lg font-semibold mb-2">User Activity</h3>
            <p className="text-3xl font-bold">{stats.activeUsers}</p>
            <p className="text-sm opacity-90 mt-1">Active users on platform</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-card text-white">
            <h3 className="text-lg font-semibold mb-2">Available Properties</h3>
            <p className="text-3xl font-bold">{stats.activeProperties}</p>
            <p className="text-sm opacity-90 mt-1">Ready for booking</p>
          </div>
          
          {/* <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-card text-white">
            <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold">{stats.pendingProperties + stats.pendingOwners}</p>
            <p className="text-sm opacity-90 mt-1">Awaiting approval</p>
          </div> */}
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminDashboard;