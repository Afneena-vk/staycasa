import { Outlet } from "react-router-dom";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;