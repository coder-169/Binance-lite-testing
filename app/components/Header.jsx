import { Button } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useGlobalContext } from "../Context";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import WalletIcon from '@mui/icons-material/Wallet';
const Header = () => {
  const { logOutUser, user, isAuthenticated, loading, getUserInfo } =
    useGlobalContext();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className="!z-50 lg:hidden absolute top-4 left-4">
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
      {/* <div className={`w-full relative h-full`}> */}
      <div
        className={`${
          menu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 -translate-x-full w-72 z-49 transition-all duration-300 bg-white relative h-full flex justify-center flex-col items-center`}
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
              href="/wallet"
            >
              {" "}
              <CurrencyBitcoinRoundedIcon /> Wallet
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
        {/* </div> */}
      </div>
    </>
  );
};

export default Header;
