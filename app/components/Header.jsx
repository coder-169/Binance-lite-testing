import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="py-4 flex justify-between ">
      <h3 className="text-2xl font-medium">Logo</h3>
      <ul className="flex gap-8">
        <li>
          <Link href={"/"}>HOME</Link>
        </li>
        <li>
          <Link href={"/trade"}>TRADE</Link>
        </li>
        <li>
          <Link href={"/contact"}>CONTACT US</Link>
        </li>
      </ul>
      <div className="">
        {localStorage.getItem("auth-token") ? (
          <Button variant="contained" size="small" color="error">
            Logout
          </Button>
        ) : (
          <Button variant="contained" size="small" color="success">
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
