"use client";
import { useGlobalContext } from "@/app/Context";
import Loader from "@/app/components/Loader";
import UserLayout from "@/app/layouts/UserLayout";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Join = () => {
  const [apiKey, setApiKey] = useState();
  const [secretKey, setSecretKey] = useState();
  const [subscriber, setSubscriber] = useState({
    apiKey: "",
    secretKey: "",
    exchange: "",
    paraphrase: "",
  });
  const handleChange = (e) => {
    setSubscriber({ ...subscriber, [e.target.name]: e.target.value });
  };
  const { setLoading, setUser, user, isAuthenticated, loading } =
    useGlobalContext();
  const handleJoin = async (e) => {
    e.preventDefault();
    const { exchange, apiKey, secretKey } = subscriber;
    console.log(subscriber);
    if (apiKey === "" || secretKey === "" || exchange === "") {
      toast.error("please enter required fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/user/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(subscriber),
      });
      const data = await response.json();
      console.log(response.status);
      if (data.success) {
        setUser(data.user);
        setSubscriber({
          apiKey: "",
          secretKey: "",
          exchange: "",
          paraphrase: "",
        });
        router.push("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const router = useRouter();
  useEffect(() => {
    if (
      !localStorage.getItem("auth-token") ||
      !isAuthenticated ||
      Object.keys(user).length === 0
    )
      return router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return (
    <UserLayout>
      <h3 className="text-2xl font-bold mt-24 text-center">
        Join Auto Spot Trading
      </h3>
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleJoin}
          className="w-4/5 md:w-3/5 mt-12 lg:w-1/2 py-2 mx-auto"
        >
          <div className="w-full my-4">
            <FormControl fullWidth>
              <InputLabel id="exchangelabel">Exchange *</InputLabel>
              <Select
                labelId="exchangelabel"
                id="exchange"
                label="Exchange"
                name="exchange"
                value={subscriber.exchange}
                onChange={handleChange}
              >
                {exchanges.map((ex, idx) => {
                  return (
                    <MenuItem key={ex} value={ex}>
                      {ex}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="my-4">
            <FormControl fullWidth>
              <TextField
                className="w-full text-white  "
                autoComplete="off"
                value={subscriber.apiKey}
                name={`apiKey`}
                label={`${
                  subscriber.exchange === "Mexc" ? "Access Key" : "Api Key"
                }`}
                onChange={handleChange}
                type={"text"}
              />
            </FormControl>
          </div>
          <div className="my-4">
            <FormControl fullWidth>
              <TextField
                className="w-full text-white  "
                autoComplete="off"
                value={subscriber.secretKey}
                name={"secretKey"}
                label={"Secret Key"}
                onChange={handleChange}
                type={"text"}
              />
            </FormControl>
          </div>
          {subscriber.exchange === "KuCoin" && (
            <div className="my-4">
              <FormControl fullWidth>
                <TextField
                  className="w-full text-white  "
                  autoComplete="off"
                  value={subscriber.paraphrase}
                  name={"paraphrase"}
                  label={"Paraphrase"}
                  onChange={handleChange}
                  type={"text"}
                />
              </FormControl>
            </div>
          )}
          <div className=" mt-8 text-center">
            <Button
              type="submit"
              className="text-white w-1/3 outline-white border-white bg-blue-500 hover:bg-blue-500 py-2 px-4"
              variant="contained"
            >
              JOIN
            </Button>
          </div>
        </form>
      )}
    </UserLayout>
  );
};

const exchanges = ["Binance", "KuCoin", "ByBit", "Mexc"];

export default Join;
