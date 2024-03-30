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
import { useRouter } from "next/navigation";
import CoinData from "@/app/components/CoinData";
import AdminLayout from "@/app/layouts/AdminLayout";
import { useGlobalContext } from "@/app/Context";
import axios from "axios";
import Loader from "@/app/components/Loader";

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
    const [walletBalance, setWalletBalance] = useState(0)
    const handleChange = (event, newValue) => {
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
            const res = await fetch(`/api/kucoin/${mark}/wallet`, {
                method: "GET",
                headers: {
                    token: localStorage.getItem("auth-token"),
                },
            });
            const data = await res.json();
            console.log(data)
            if (!data.success) toast.error(data.message);
            if (data?.assets?.length) {
                setWallet(data.assets);
            } else {
                setWallet([]);
            }
            if(data?.data){
                setWalletBalance(data.data.total.USDT)
                setWallet([]);
            }
        } catch (error) {
            console.log(error);
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
                    'exchange': 'kucoin'
                },
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                toast.success(data.message);
                router.push('/trade/join')
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
        if (!localStorage.getItem('auth-token')) {
            router.push('/login')
        }
            getUserInfo();
            getUserWallet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <UserLayout>
            <div className="w-full text-center mx-auto">
                {user?.kuCoinSubscribed ?
                    <Box
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
                                            <div className="mt-4 mb-8 text-left">
                                                <span className='bg-gray-200 text-sm px-4 py-2 rounded-full'>Total assets in USDT</span>
                                                <h2 className="text-xl mt-2 px-2  text-gray-700 font-medium">Not Available</h2>
                                                
                                            </div>
                                            {wallet?.length === 0 ? <div className="h-[40vh] flex items-center justify-center">
                                                <h3>No Assets found</h3></div> : <div className="mt-4 grid gap-4 p-4 grid-cols-12">
                                                {wallet?.map((coin, idx) => {
                                                    return (
                                                        <CoinData
                                                            key={coin.currency + idx}
                                                            symbol={coin.currency}
                                                            amount={parseFloat(coin.available).toFixed(3)}
                                                            inOrder={parseFloat(coin.holds).toFixed(3)}
                                                        />
                                                    );
                                                })}
                                            </div>}
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
                            <div value={value} index={1} dir={theme.direction}>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <div className="w-full wallet mx-auto">
                                        <div className="mt-8 mx-8">
                                        <div className="mt-4 mb-8 text-left">
                                                <span className='bg-gray-200 text-sm px-4 py-2 rounded-full'>Total assets in USDT</span>
                                                <h2 className="text-xl mt-2 px-2  text-gray-700 font-medium">{walletBalance}</h2>
                                            </div>
                                            {wallet?.length === 0 ? <div className="h-4/5 flex items-center justify-center">
                                                <h3>No Assets found</h3></div> : <div className="mt-4 grid gap-4 p-4 grid-cols-12">
                                                {wallet?.map((coin, idx) => {
                                                    return (
                                                        <CoinData
                                                            key={coin.currency + idx}
                                                            symbol={coin.currency}
                                                            amount={parseFloat(coin.available).toFixed(3)}
                                                            inOrder={parseFloat(coin.holds).toFixed(3)}
                                                        />
                                                    );
                                                })}
                                            </div>}
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
                        </SwipeableViews>
                    </Box>
                    : <div className="h-[70vh] flex items-center justify-center">
                        <h3 className="text-xl">Sorry You are not Subscribed to the KuCoin Copy Trading</h3>
                    </div>
                }
            </div>
        </UserLayout>
    );
}
