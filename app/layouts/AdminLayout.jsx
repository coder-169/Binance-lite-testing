import React from "react";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="w-full flex h-[100vh]">
      <div className={`w-0 lg:w-auto`}>
        <Sidebar />
      </div>
      <div className="lg:w-5/6 w-full overflow-y-scroll">{children}</div>
    </div>
  );
};

export default AdminLayout;
