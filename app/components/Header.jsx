import { AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
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
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
const Header = () => {
  const { logOutUser, user, isAuthenticated, loading, getUserInfo } =
    useGlobalContext();
  const [menu, setMenu] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [pathName, setPathName] = useState("");
   const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  useEffect(() => {
  setPathName(window.location.pathname);
  }, []);
  return (
    <>
      <div className="!z-50 lg:hidden absolute top-4 left-4">
        {!menu ? (
          <button onClick={() => setMenu(true)}>
            <MenuRoundedIcon  />{" "}
          </button>
        ) : (
          <button onClick={() => setMenu(false)}>
            {" "}
            <HighlightOffRoundedIcon  />
          </button>
        )}
      </div>
      {/* <div className={`w-full relative h-full`}> */}
      <div
        className={`${menu ? "translate-x-0" : "-translate-x-full"
          } z-40 lg:translate-x-0 -translate-x-full w-72 z-49 transition-all duration-300 bg-white relative h-full flex justify-center flex-col items-center`}
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
          {isAuthenticated ? <li className="my-4">
            <Accordion
              expanded={
                expanded ||
                pathName === "/wallet/kucoin"
              }
              onChange={handleExpansion}
              slots={{ transition: Fade }}
              slotProps={{ transition: { timeout: 400 } }}
              className={`!border-0 shadow-none px-4 transition-all duration-200 py-1.5 gap-4 ${(!expanded ||
                  !pathName === "/wallet/binance" ||
                  !pathName === "/wallet/bybit") &&
                "hover:bg-gray-100"
                }`}
              sx={{
                "& .MuiAccordion-region": {
                  height:
                    pathName === "/wallet/binance" ||
                      pathName === "/wallet/kucoin" ||
                      expanded
                      ? "auto"
                      : 0,
                },
                "& .MuiAccordionDetails-root": {
                  display:
                    pathName === "/wallet/kucoin" ||
                      pathName === "/wallet/bybit" ||
                      expanded
                      ? "block"
                      : "none",
                  border: 0,

                  shadow: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="flex gap-4 transition-all duration-200">
                  <CurrencyBitcoinRoundedIcon />
                  <Typography>Wallet</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Link
                  href="/wallet/kucoin"
                  className={`${pathName === "/wallet/kucoin" && "bg-gray-200"
                    } flex gap-4 px-4 transition-all duration-200 py-1.5 hover:bg-gray-200`}
                >
                  <CurrencyBitcoinRoundedIcon />
                  <Typography>KuCoin</Typography>
                </Link>
                <Link
                  href="/wallet/binance"
                  className={`${pathName === "/wallet/binance" && "bg-gray-200"
                    } flex gap-4 px-4 transition-all duration-200 py-1.5 hover:bg-gray-200`}
                >
                  <CurrencyBitcoinRoundedIcon />
                  <Typography>Binance</Typography>
                </Link>
                <Link
                  href="/wallet/bybit"
                  className={`${pathName === "/wallet/bybit" && "bg-gray-200"
                    } flex gap-4 px-4 transition-all duration-200 py-1.5 hover:bg-gray-200`}
                >
                  <CurrencyBitcoinRoundedIcon />
                  <Typography>ByBit</Typography>
                </Link>
              </AccordionDetails>
            </Accordion>
          </li>:""}
        {isAuthenticated?  <li className="my-4">
            <Link
              className="flex px-8 transition-all duration-200 py-4 gap-4 hover:bg-gray-100"
              href="/trade/join"
            >
              {" "}
              <CurrencyBitcoinRoundedIcon /> Join
            </Link>
          </li>:""}
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
