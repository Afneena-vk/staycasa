


import ModernAdminLayout from "../../layouts/admin/AdminLayout";
import { FaUsers, FaCrown, FaBuilding, FaCalendarAlt, FaConciergeBell, FaCog, FaArrowUp, FaEye } from "react-icons/fa";

const statsCards = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: FaUsers,
    description: "Active registered users"
  },
  {
    title: "Property Owners",
    value: "89",
    change: "+5%",
    changeType: "positive" as const,
    icon: FaCrown,
    description: "Verified property owners"
  },
  {
    title: "Properties",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: FaBuilding,
    description: "Listed properties"
  },
  {
    title: "Bookings Today",
    value: "23",
    change: "-2%",
    changeType: "negative" as const,
    icon: FaCalendarAlt,
    description: "New bookings today"
  }
];

const quickActions = [
  { name: "Manage Users", path: "/admin/users", icon: FaUsers, color: "bg-blue-500" },
  { name: "Property Listings", path: "/admin/properties", icon: FaBuilding, color: "bg-green-500" },
  { name: "View Bookings", path: "/admin/bookings", icon: FaCalendarAlt, color: "bg-purple-500" },
  { name: "Services & Features", path: "/admin/services", icon: FaConciergeBell, color: "bg-orange-500" },
  { name: "System Settings", path: "/admin/settings", icon: FaCog, color: "bg-gray-500" },
  { name: "Analytics", path: "/admin/analytics", icon: FaEye, color: "bg-pink-500" },
];

const AdminDashboard = () => {
  return (
    <ModernAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-admin-card-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.title} className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border hover:shadow-elevated transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-admin-card-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <IconComponent className="text-white" size={20} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className={`flex items-center space-x-1 text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-admin-success' : 'text-admin-danger'
                  }`}>
                    <FaArrowUp className={`${stat.changeType === 'negative' ? 'rotate-180' : ''}`} size={10} />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border">
          <h2 className="text-xl font-semibold text-admin-card-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <a
                  key={action.name}
                  href={action.path}
                  className="group flex items-center space-x-4 p-4 rounded-lg border border-admin-border hover:border-admin-primary/50 hover:bg-admin-bg/50 transition-all duration-300"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-admin-card-foreground group-hover:text-admin-primary transition-colors">
                      {action.name}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border">
            <h2 className="text-xl font-semibold text-admin-card-foreground mb-4">Recent Users</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-admin-bg/50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-admin-card-foreground">New user registered</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border">
            <h2 className="text-xl font-semibold text-admin-card-foreground mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-admin-bg/50 transition-colors">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-xs" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-admin-card-foreground">New booking received</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminDashboard;