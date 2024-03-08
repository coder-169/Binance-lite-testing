"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { useGlobalContext } from "../Context";
const Sidebar = () => {
  const [menu, setMenu] = useState(true);
  const { getUserInfo, logOutUser, isAuthenticated } = useGlobalContext();
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={`bg-white w-full relative h-full`}>
      <div className="!z-50 md:hidden absolute top-4 left-4">
        {!menu ? (
          <button onClick={() => setMenu(true)}>
            <MenuRoundedIcon />{" "}
          </button>
        ) : (
          <button onClick={() => setMenu(false)}>
            {" "}
            <HighlightOffRoundedIcon />
          </button>
        )}
      </div>
      <div
        className={`${
          menu ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-300 w-full relative h-full flex justify-center flex-col items-center`}
      >
        <Link href={"/"} className="mb-12">
          <h3 className="text-3xl font-medium">Binance Lite</h3>
        </Link>
        <ul className="w-full">
          <li className="my-4">
            <Link
              className="flex px-8 transition-all duration-200 py-4 gap-4 hover:bg-gray-100"
              href="/"
            >
              {" "}
              <HomeRoundedIcon /> Home
            </Link>
          </li>
          <li className="my-4">
            <Link
              className="flex px-8 transition-all duration-200 py-4 gap-4 hover:bg-gray-100"
              href="/trade"
            >
              {" "}
              <CurrencyBitcoinRoundedIcon /> Trade
            </Link>
          </li>
          {isAuthenticated ? (
            <li className="my-4">
              <button
                onClick={logOutUser}
                className="w-full flex px-8 transition-all duration-200 py-4 gap-4 hover:bg-gray-100"
              >
                {" "}
                <ExitToAppRoundedIcon /> Logout
              </button>
            </li>
          ) : (
            <li className="my-4">
              <Link
                className="flex px-8 transition-all duration-200 py-4 gap-4 hover:bg-gray-100"
                href="/login"
              >
                {" "}
                <ExitToAppRoundedIcon /> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
