import { Button } from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useGlobalContext } from "../Context";

const Header = () => {
  const { logOutUser, user, isAuthenticated, loading, getUserInfo } =
    useGlobalContext();
  useEffect(() => {
    if ((Object.keys(user).length === 0 && !loading) || !user) {
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <header className="py-4 flex justify-between ">
      <h3 className="text-2xl font-medium">Logo</h3>
      <ul className="flex gap-8">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/wallet"}>Wallet</Link>
        </li>
        <li>
          <Link href={"/contact"}>Contact us</Link>
        </li>
      </ul>
      <div className="">
        {isAuthenticated ? (
          <Button
            onClick={logOutUser}
            variant="contained"
            size="small"
            className="bg-red-500 transition-all duration-200 hover:bg-red-600"
            color="error"
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            className="bg-green-500 transition-all duration-200 hover:bg-green-600"
            color="error"
          >
            <Link href={"/login"}>Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
