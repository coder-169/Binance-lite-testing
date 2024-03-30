"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Home from "../components/Home";

const UserLayout = ({ children }) => {
  return (
    <div className="w-full flex h-[100vh]">
      <div className={`w-0 lg:w-auto`}>
        <Header />
      </div>
      <div className="lg:w-5/6 w-full overflow-y-scroll z-30">{children}</div>
    </div>
    // <div className="w-3/5 mx-auto">
    //   <Header />
    //   {children}
    // </div>
  );
};

export default UserLayout;
