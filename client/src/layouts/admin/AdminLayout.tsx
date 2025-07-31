import { ReactNode } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-4 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
