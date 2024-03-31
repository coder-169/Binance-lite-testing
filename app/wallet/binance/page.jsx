"use client";
import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserLayout from "@/app/layouts/UserLayout";
import { Button } from "@mui/material";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; import AdminLayout from "@/app/layouts/AdminLayout";
import { useGlobalContext } from "@/app/Context";
import axios from "axios";
import Loader from "@/app/components/Loader";
import CoinData from "@/app/components/CoinData";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log(newValue)
    if (newValue === 0) {
      getUserWallet('spot')
    }
    if (newValue === 1) {
      getUserWallet('future')
    }
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const { getUserInfo, isAuthenticated, loading, setLoading, user, setUser } =
    useGlobalContext();
  const router = useRouter();
  const [wallet, setWallet] = useState([]);
  const getUserWallet = async (mark = 'spot') => {
    if (!localStorage.getItem("auth-token")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/binance/${mark}/wallet`, {
        method: "GET",
        headers: {
          token: localStorage.getItem("auth-token"),
        },
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) toast.error(data.message);
      setWallet(data.assets);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const handleUnSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/user/subscribe", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("auth-token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserInfo();
    getUserWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <UserLayout>
      <div className="w-full text-center mx-auto">
        {user?.binanceSubscribed ? <Box
          sx={{
            bgcolor: "background.paper",
            width: "85%",
            height: "85vh",
            margin: "3rem auto",
            overflowY: "scroll",
          }}
        >
          <AppBar position="static" className="sticky top-0 z-50">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="SPOT WALLET" {...a11yProps(0)} />
              <Tab label="FUTURE WALLET" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <div value={value} index={0} dir={theme.direction}>
              {loading ? (
                <Loader />
              ) : (
                <div className="w-full wallet mx-auto">
                  <div className="mt-8 mx-8">
                    <div className="mt-4 grid gap-4 p-4 grid-cols-12">
                      {wallet?.map((coin, idx) => {
                        return (
                          <CoinData
                            key={coin.asset + idx}
                            symbol={coin.asset}
                            amount={parseFloat(coin.free).toFixed(3)}
                            inOrder={parseFloat(coin.used).toFixed(3)}
                          />
                        );
                      })}
                    </div>
                    <div className="w-1/2 ml-auto -z-40 text-right">
                      <Button
                        onClick={handleUnSubscribe}
                        className="text-white my-4 outline-white border-white rounded-md bg-blue-400 hover:bg-blue-500 transition-all duration-200 py-2 px-4 mx-right text-sm"
                        variant="outlined"
                        size="small"
                      >
                        <SmartToyRoundedIcon />
                        Unsubscribe
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div value={value} index={1} dir={theme.direction}>
                {loading ? (
                  <Loader />
                ) : (
                  <div className="w-full wallet mx-auto">
                    <div className="mt-8 mx-8">
                      <div className="mt-4 grid gap-4 p-4 grid-cols-12">
                        {wallet?.map((coin, idx) => {
                          return (
                            <CoinData
                              key={coin.asset + idx}
                              symbol={coin.asset}
                              amount={parseFloat(coin.walletBalance).toFixed(3)}
                              inOrder={(parseFloat(coin.walletBalance) - parseFloat(coin.availableBalance)).toFixed(3)}
                            />
                          );
                        })}
                      </div>
                      <div className="w-1/2 ml-auto -z-40 text-right">
                        <Button
                          onClick={handleUnSubscribe}
                          className="text-white my-4 outline-white border-white rounded-md bg-blue-400 hover:bg-blue-500 transition-all duration-200 py-2 px-4 mx-right text-sm"
                          variant="outlined"
                          size="small"
                        >
                          <SmartToyRoundedIcon />
                          Unsubscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SwipeableViews>
        </Box> : <div className="h-[70vh] flex items-center justify-center">
          <h3 className="text-xl">Sorry You are not Subscribed to the Binance Copy Trading</h3>
        </div>}
      </div>
    </UserLayout>
  );
}
