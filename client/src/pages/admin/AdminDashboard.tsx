import AdminLayout from "../../layouts/admin/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Grid Cards Example */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Users</h2>
            <p className="text-gray-600">Manage all registered users.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Owners</h2>
            <p className="text-gray-600">View and verify property owners.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Properties</h2>
            <p className="text-gray-600">Manage property listings.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Bookings</h2>
            <p className="text-gray-600">Check booking stats.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Services</h2>
            <p className="text-gray-600">Control additional services offered.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Settings</h2>
            <p className="text-gray-600">App-wide settings and preferences.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
