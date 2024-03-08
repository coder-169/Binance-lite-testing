"use client";
import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AdminLayout from "../layouts/AdminLayout";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import { symbols } from "../components/Symbols";
import { useGlobalContext } from "../Context";
import Loader from "../components/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import { DataObject, TableRowsSharp } from "@mui/icons-material";
import { makeOptions } from "../helpers/functions";
const BASE_API_URL = "https://api1.binance.com";

const options = ["Option 1", "Option 2"];
const Page = () => {
  const [order, setOrder] = useState({
    symbol: "",
    quantity: "",
    type: "",
    quoteOrderQty: "",
    side: "",
    user: "",
    stopPrice: "",
    price: "",
  });
  const [users, setUsers] = useState([]);
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };
  // const [user, setUser] = useState({ role: "admin", isSubscribed: true });
  const { setLoading, user, loading, getUserInfo } = useGlobalContext();
  const [coins, setCoins] = useState(["BTCUSDT", "BNBUSDT"]);
  const [tickerPrice, setTickerPrice] = useState(0);
  const tickerPriceFounder = async (e) => {
    setLoading(true);
    setOrder({
      ...order,
      symbol: e.target.value,
    });
    const response = await fetch("/api/ticker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticker: e.target.value }),
    });
    const data = await response.json();
    if (data.success) {
      let price = parseFloat(data.tickerPrice);
      setTickerPrice(price);
    }
    setLoading(false);
  };
  const getUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/subscribers", {
        headers: {
          token: localStorage.getItem("auth-token"),
        },
      });
      console.log(data);
      if (data.success) {
        setUsers(data.subscribers);
        setCoins(data.symbols);
        console.log(data.symbols);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const dispatchOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { type, side, symbol, user } = order;
      if (type === "" || side === "" || symbol === "") {
        setLoading(false);
        return toast.error("please enter all fields");
      }
      const options = await makeOptions(order);
      if (options.error) {
        setLoading(false);
        return toast.error("please enter all fields");
      }

      let stringiFied = JSON.stringify({ user, type, side, symbol, options });
      let url = "/api/orders/order";

      console.log(typeof options.quantity);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: stringiFied,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setOrder({
          symbol: "",
          quantity: "",
          limit: "",
          type: "",
          quoteOrderQty: "",
          side: "",
          user: "",
          stopPrice: "",
          price: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const specialHandler = (e) => {
    if (e.target.name === "quantity")
      setOrder({
        ...order,
        quantity: e.target.value,
        quoteOrderQty: (parseFloat(e.target.value) * tickerPrice).toString(),
      });
    if (e.target.name === "quoteOrderQty")
      setOrder({
        ...order,
        quoteOrderQty: e.target.value,
        quantity: (parseFloat(e.target.value) / tickerPrice).toString(),
      });
  };
  useEffect(() => {
    // if (!user && !loading) {
    //   getUserInfo();
    //   console.log('calling again')
    getUsers();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <AdminLayout>
      {" "}
      <div className="w-4/5 mx-auto mt-12">
        <h1 className="text-3xl font-medium">Spot Trade</h1>
        {!loading && users.length === 0 ? (
          <div className="h-[50vh] flex items-center justify-center">
            <h3 className="text-2xl text-gray-600 font-medium">
              No Subscribers to Start trade
            </h3>
          </div>
        ) : (
          <form onSubmit={dispatchOrder} className="mt-16 w-full">
            <div className="flex w-full h-[50vh] gap-4 my-8">
              <div className="w-1/2">
                <div className="w-full mb-16">
                  <FormControl fullWidth>
                    <InputLabel id="user">User *</InputLabel>
                    <Select
                      labelId="user"
                      id="user"
                      label="User"
                      name="user"
                      value={order.user}
                      onChange={handleChange}
                    >
                      {users.map((user, idx) => {
                        return (
                          <MenuItem key={user.username} value={user.username}>
                            {user.username}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl fullWidth>
                    <InputLabel id="symbol">Coin *</InputLabel>
                    <Select
                      labelId="symbol"
                      id="symbol"
                      label="Symbol"
                      name="symbol"
                      value={order.symbol}
                      onChange={tickerPriceFounder}
                    >
                      {coins?.map((symb, idx) => {
                        return (
                          <MenuItem key={symb.symbol} value={symb.symbol}>
                            {symb.symbol}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full my-8">
                  <TextField
                    disabled={order.symbol === "" ? true : false}
                    className="!text-white w-3/5 !border-white"
                    id="quoteOrderQty"
                    name="quoteOrderQty"
                    label={`Amount(USDT)`}
                    value={order.quoteOrderQty}
                    onChange={specialHandler}
                    // color="white"
                    variant="outlined"
                  />
                </div>
                <div className="w-full my-8">
                  <TextField
                    disabled={order.symbol === "" ? true : false}
                    className="!text-white w-3/5 !border-white"
                    id="quantity"
                    name="quantity"
                    label={`Quantity(${
                      order.symbol !== "" ? order.symbol : "Coin"
                    })`}
                    value={order.quantity}
                    onChange={specialHandler}
                    autoComplete="off"
                    type="number"
                    // color="white"
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <FormControl fullWidth>
                  <InputLabel id="side">Action *</InputLabel>
                  <Select
                    labelId="side"
                    id="side"
                    label="Action"
                    name="side"
                    value={order.side}
                    onChange={handleChange}
                  >
                    {sides.map((side, idx) => {
                      return (
                        <MenuItem key={side} value={side}>
                          {side}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <div className="mt-16 mb-8">
                  <FormControl fullWidth>
                    <InputLabel id="type_id">Type *</InputLabel>
                    <Select
                      labelId="type_id"
                      id="type"
                      label="Type"
                      name="type"
                      value={order.type}
                      onChange={handleChange}
                    >
                      {trades.map((trade, idx) => {
                        return (
                          <MenuItem key={trade} value={trade}>
                            {trade.split("_").join(" ")}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                {order.type === "MARKET" && (
                  <div className="mb-8">
                    <FormControl fullWidth>
                      <TextField
                        disabled={true}
                        className="!text-white text-center  !border-white"
                        id="market"
                        name="market"
                        label="Best Market Price"
                        variant="outlined"
                      />
                    </FormControl>
                  </div>
                )}
                {(order.type === "STOP_LOSS" ||
                  order.type === "TAKE_PROFIT" ||
                  order.type === "STOP_LOSS_LIMIT" ||
                  order.type === "LIMIT_MAKER" ||
                  order.type === "TAKE_PROFIT_LIMIT") && (
                  <div className="mb-8">
                    <FormControl fullWidth>
                      <TextField
                        disabled={order.symbol === "" ? true : false}
                        className="!text-white text-center  !border-white"
                        id="stopPrice"
                        onChange={handleChange}
                        name="stopPrice"
                        label="Stop Price"
                        variant="outlined"
                        type="number"
                        value={order.stopPrice}
                        autoComplete="off"
                      />
                    </FormControl>
                  </div>
                )}
                {(order.type === "STOP_LOSS_LIMIT" ||
                  order.type === "TAKE_PROFIT_LIMIT") && (
                  <div className="mb-8">
                    <FormControl fullWidth>
                      <TextField
                        disabled={order.symbol === "" ? true : false}
                        className="!text-white text-center  !border-white"
                        id="price"
                        name="price"
                        label="Price"
                        variant="outlined"
                        onChange={handleChange}
                        type="number"
                        autoComplete="off"
                        value={order.price}
                      />
                    </FormControl>
                  </div>
                )}
                {order.type === "LIMIT" && (
                  <div className="mb-8">
                    <FormControl fullWidth>
                      <TextField
                        disabled={order.symbol === "" ? true : false}
                        className="!text-white  !border-white"
                        id="price"
                        name="price"
                        label="Limit(USDT)"
                        value={order.price}
                        onChange={handleChange}
                        type="number"
                        // color="white"
                        autoComplete="off"
                        variant="outlined"
                      />
                    </FormControl>
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <Button
                variant="contained"
                type="submit"
                className="tracking-wider bg-blue-400 hover:bg-blue-500 transition-all duration-200"
                size="large"
              >
                Order
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

const trades = [
  "MARKET",
  "LIMIT",
  "STOP_LOSS",
  "STOP_LOSS_LIMIT",
  "TAKE_PROFIT",
  "TAKE_PROFIT_LIMIT",
  "LIMIT_MAKER",
];
// const users = [{ username: "Saad2129" }, { username: "Javeria0224" }];
const sides = ["BUY", "SELL"];

export default Page;
