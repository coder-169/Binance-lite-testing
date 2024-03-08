"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Home from "../components/Home";

const UserLayout = ({ children }) => {
  return (
    <div className="w-3/5 mx-auto">
      <Header />
      {children}
    </div>
  );
};

export default UserLayout;
