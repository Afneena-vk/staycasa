

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import OwnerSidebar from "../../components/Owner/OwnerSidebar";
import { FaBars } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { NotificationBell } from "../../pages/user/NotificationBell";

const OwnerLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fetchCurrentSubscription = useAuthStore(
    (state) => state.fetchCurrentSubscription
  );

   const userData = useAuthStore((state) => state.userData);
  const isApproved = userData?.approvalStatus === "approved";

  useEffect(() => {
    if (isApproved) {
      fetchCurrentSubscription();
    }
  }, [isApproved]);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-admin-bg flex">

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-3 bg-admin-card rounded-xl shadow-card border border-admin-border"
        >
          <FaBars className="text-admin-card-foreground" size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Wrapper
          - Mobile: fixed overlay (slide in/out)
          - Desktop: sticky so it stays in view while content scrolls
      */}
      <div
        className={`
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:sticky lg:top-0 lg:self-start
          top-0 left-0
          h-screen
          z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          flex-shrink-0
        `}
      >
        <OwnerSidebar onMobileClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Mobile Header Spacer */}
        {/* <div className="lg:hidden h-16" /> */}


  {/* Desktop Header with Notification on Left */}
<div className="hidden lg:flex items-center p-4 border-b border-gray-200 bg-admin-bg z-50 relative">
  {/* Place notification near the left edge */}
  <div className="mr-4">
    <NotificationBell role="Owner" />
  </div>
</div>

  {/* Mobile Header Spacer with Notification */}
  <div className="lg:hidden h-16 flex items-center justify-end px-4">
    <NotificationBell role="Owner" />
  </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
};

export default OwnerLayout;



// import { ReactNode, useState } from "react";
// import OwnerSidebar from "../../components/Owner/OwnerSidebar";
// import { FaBars } from "react-icons/fa";

// interface OwnerLayoutProps {
//   children: ReactNode;
// }

// const OwnerLayout = ({ children }: OwnerLayoutProps) => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarCollapsed(!sidebarCollapsed);
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-admin-bg flex">
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={toggleMobileMenu}
//           className="p-3 bg-admin-card rounded-xl shadow-card border border-admin-border"
//         >
//           <FaBars className="text-admin-card-foreground" size={20} />
//         </button>
//       </div>

//       {/* Mobile Overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`${
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static top-0 left-0 h-full z-50 transition-transform duration-300 ease-smooth`}
//       >
//         {/* <OwnerSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} /> */}
//         <OwnerSidebar />

//       </div>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col min-w-0">
//         {/* Mobile Header Spacer */}
//         <div className="lg:hidden h-16" />

//         {/* Content Area */}
//         <div className="flex-1 p-6">
//           <div className="max-w-full mx-auto">{children}</div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default OwnerLayout;



// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import OwnerSidebar from "../../components/Owner/OwnerSidebar";
// import { FaBars } from "react-icons/fa";

// const OwnerLayout = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-admin-bg flex">
      
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={toggleMobileMenu}
//           className="p-3 bg-admin-card rounded-xl shadow-card border border-admin-border"
//         >
//           <FaBars className="text-admin-card-foreground" size={20} />
//         </button>
//       </div>

//       {/* Mobile Overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`${
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 fixed lg:static top-0 left-0 h-full z-50 transition-transform duration-300`}
//       >
//         <OwnerSidebar />
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col min-w-0">
        
//         {/* Mobile Header Spacer */}
//         <div className="lg:hidden h-16" />

//         {/* Page Content */}
//         <div className="flex-1 p-6">
//           <div className="max-w-full mx-auto">
//             <Outlet />
//           </div>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default OwnerLayout;