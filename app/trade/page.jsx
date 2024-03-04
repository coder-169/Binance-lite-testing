"use client";
import React, { useState } from "react";
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

const options = ["Option 1", "Option 2"];
const Page = () => {
  const [order, setOrder] = useState({
    symbol: "",
    quantity: "",
    limit: "",
    order_type: "",
    side: "",
  });
  const handleChange = (e) => {
    console.log(e.target.innerText);
    console.log(e.target.parentElement.name);
    if (e.target.name === "quantity") {
      setOrder({ ...order, [e.target.name]: e.target.value });
      return;
    }
    setOrder({ ...order, [e.target.name]: e.target.innerText });
  };
  const [user, setUser] = useState({ role: "admin", isSubscribed: true });

  const dispatchOrder = async (e) => {
    e.preventDefault();
    console.log(order);
  };
  return user.role === "admin" ? (
    <AdminLayout>
      {" "}
      <div className="w-4/5 mx-auto mt-12">
        <h1 className="text-3xl font-medium">Spot Trade</h1>
        <form onSubmit={dispatchOrder} className="mt-16 w-full">
          <div className="flex w-full gap-4 my-8">
            <div className="w-1/2">
              <div className="w-full">
                <Autocomplete
                  value={order.symbol}
                  onChange={(event, newValue) => {
                    setOrder({ symbol: newValue });
                  }}
                  inputValue={order.symbol}
                  onInputChange={(event, newInputValue) => {
                    setOrder({ symbol: newInputValue });
                  }}
                  id="symbol"
                  name="symbol"
                  options={symbols}
                  renderInput={(params) => (
                    <TextField {...params} label="Coin" />
                  )}
                />
              </div>
              <div className="w-full my-8">
                <Autocomplete
                  disablePortal
                  id="symbol"
                  options={symbols}
                  renderInput={(params) => (
                    <TextField
                      value={order.symbol}
                      onChange={handleChange}
                      name="symbol"
                      {...params}
                      label="Coin"
                    />
                  )}
                />
              </div>
              <div className="w-full my-8">
                <TextField
                  className="!text-white w-1/5 !border-white"
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  value={order.quantity}
                  onChange={handleChange}
                  // color="white"
                  variant="outlined"
                />
              </div>
            </div>
            <div className="w-1/2">
              <div>
              {/* <Autocomplete
                  value={order.side}
                  onChange={(event, newValue) => {
                    setOrder({ side: newValue });
                  }}
                  inputValue={order.side}
                  onInputChange={(event, newInputValue) => {
                    setOrder({ side: newInputValue });
                  }}
                  id="side"
                  name="side"
                  options={sides}
                  renderInput={(params) => (
                    <TextField {...params} label="Action" />
                  )}
                /> */}
              </div>
              <div className="my-8">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={trades}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="order_type"
                      onChange={handleChange}
                      value={order.order_type}
                      label="Trade Type"
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Button
              variant="contained"
              type="submit"
              className="tracking-wider"
              size="large"
            >
              Order
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  ) : (
    <UserLayout>
      <div className="w-4/5 mx-auto mt-12">
        <div className="mt-16">
          {user.isSubscribed ? (
            <div>
              <h1 className="text-3xl font-medium">Your Wallet</h1>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-1/2 text-center">
                <Button
                  className="text-white outline-white border-white hover:bg-blue-500 py-2 px-4"
                  variant="outlined"
                  startIcon={<SmartToyRoundedIcon />}
                >
                  Join Auto Trade
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};
const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
];
const trades = [
  "MARKET",
  "LIMIT",
  "STOP",
  "STOP LIMIT",
  "TAKE PROFIT",
  "TAKE PROFIT LIMIT",
];
const sides = ["BUY", "SELL"];

export default Page;
