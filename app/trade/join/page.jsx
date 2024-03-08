"use client";
import { useGlobalContext } from "@/app/Context";
import Loader from "@/app/components/Loader";
import UserLayout from "@/app/layouts/UserLayout";
import { Button, FormControl, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Join = () => {
  const [apiKey, setApiKey] = useState();
  const [secretKey, setSecretKey] = useState();
  const { setLoading, setUser, user, isAuthenticated, loading } =
    useGlobalContext();
  const handleJoin = async (e) => {
    e.preventDefault();
    if (apiKey === "" || secretKey === "") {
      toast.error("please enter api key");
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
        body: JSON.stringify({ apiKey, secretKey }),
      });
      const data = await response.json();
      console.log(response.status);
      if (data.success) {
        setUser(data.user);
        setApiKey("")
        setSecretKey("")
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
          className="w-full sm:w-4/5 md:w-4/5 mt-12 lg:w-1/2 py-2 mx-auto"
        >
          <div className="my-4">
            <FormControl fullWidth>
              <TextField
                className="w-full text-white  "
                autoComplete="off"
                value={apiKey}
                name={"apiKey"}
                label={"Api Key"}
                onChange={(e) => setApiKey(e.target.value)}
                type={"text"}
              />
            </FormControl>
          </div>
          <div className="my-4">
            <FormControl fullWidth>
              <TextField
                className="w-full text-white  "
                autoComplete="off"
                value={secretKey}
                name={"secretKey"}
                label={"Secret Key"}
                onChange={(e) => setSecretKey(e.target.value)}
                type={"text"}
              />
            </FormControl>
          </div>
          <div className=" mt-8 text-center">
            <Button
              type="submit"
              className="text-white outline-white border-white bg-blue-500 hover:bg-blue-500 py-2 px-4"
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

export default Join;
