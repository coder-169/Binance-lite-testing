import React from "react";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="w-full flex h-[100vh]">
      <div className={` w-96 lg:w-80 md:w-72`}>
        <Sidebar />
      </div>
      <div className="w-5/6 overflow-y-scroll">{children}</div>
    </div>
  );
};

export default AdminLayout;
