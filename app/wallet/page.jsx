"use client";
import { Button } from "@mui/material";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import Loader from "../components/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CoinData from "../components/CoinData";
import AdminLayout from "../layouts/AdminLayout";
import axios from "axios";
import UserLayout from "../layouts/UserLayout";
import { useGlobalContext } from "../Context";
const BASE_API_URL = "https://api1.binance.com";

const Page = () => {
  const { getUserInfo, isAuthenticated, loading, setLoading, user, setUser } =
    useGlobalContext();
  const router = useRouter();
  const [wallet, setWallet] = useState([]);
  const getUserWallet = async () => {
    if (!localStorage.getItem("auth-token")) return;
    console.log(user);
    if (Object.keys(user).length > 0 && !user?.isSubscribed) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/wallet", {
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
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        router.push("/");
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
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-auto mt-12">
          <div className="mt-8">
            {user?.isSubscribed ? (
              <div>
                <h1 className="text-2xl font-medium">Your Wallet</h1>
                <div className="mt-4 h-[60vh] overflow-y-scroll">
                  {wallet?.map((coin, idx) => {
                    return (
                      <CoinData
                        key={coin.asset + idx}
                        symbol={coin.asset}
                        amount={parseFloat(coin.free).toFixed(3)}
                        inOrder={parseFloat(coin.locked).toFixed(3)}
                      />
                    );
                  })}
                </div>
                <div className="w-1/2 text-center mx-auto">
                  <Button
                    onClick={handleUnSubscribe}
                    className="text-white outline-white border-white rounded-md bg-blue-400 hover:bg-blue-500 transition-all duration-200 py-2 px-4"
                    variant="outlined"
                  >
                    <SmartToyRoundedIcon />
                    Cancel Auto Trade
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-[40vh] flex justify-center items-center">
                <div className="w-1/2 text-center">
                  <Link
                    href={"/trade/join"}
                    className="text-white outline-white border-white rounded-md bg-blue-400 hover:bg-blue-500 transition-all duration-200 py-2 px-4"
                    variant="outlined"
                  >
                    <SmartToyRoundedIcon />
                    Join Auto Trade
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default Page;
