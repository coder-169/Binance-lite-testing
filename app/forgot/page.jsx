"use client";
import { useEffect, useState } from "react";
import bcryptjs from "bcryptjs";
import { useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";
import Loader from "../components/Loader";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
const Page = () => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const router = useRouter();
  const getResetLink = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (email === "" && !localStorage.getItem("ecmo-forgot-email")) {
        return toast.error("please fill all the fields");
      }
      const response = await fetch(
        "https://chrome.dollany.app/api/auth/pass/forgot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.success) {
        storeCode(data.code);
        toast.success(data.message);
        setSent(true);
        localStorage.setItem("ecmo-forgot-email", email);
      } else {
        setSent(false);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      if (newPass !== confirmPass) {
        toast.error("passwords do not match");
        return;
      }
      setLoading(true);
      const response = await fetch(
        "https://chrome.dollany.app/api/auth/pass/change",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("ecmo-forgot-email"),
            password: newPass,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setNewPass("");
        setConfirmPass("");
        localStorage.removeItem("ecmo-forgot-email");
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
    setLoading(false);
  };
  const handleResend = async (e) => {
    e.preventDefault();
    if (!email || email === "" || !localStorage.getItem("ecmo-forgot-email")) {
      setSent(false);
      setEmail("");
    } else {
      getResetLink();
    }
  };

  // Check if the verification code has expired
  function isVerificationCodeExpired() {
    const expirationTime = localStorage.getItem("ecmo-forgot-code-expiry");
    if (!expirationTime) return true; // If there's no expiration time, consider it expired
    return new Date().getTime() > parseInt(expirationTime, 10);
  }
  const storeCode = async (code) => {
    // send email where the code will be sent
    const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes in milliseconds
    const hashedCode = await bcryptjs.hash(code, 10);
    localStorage.setItem("ecmo-forgot-code", JSON.stringify(hashedCode));

    localStorage.setItem("ecmo-forgot-code-expiry", expirationTime.toString());
  };
  // Verify the code
  const verifyCode = async (e) => {
    e.preventDefault();
    let storedCode = localStorage.getItem("ecmo-forgot-code");
    // No code to verify
    if (!storedCode) {
      toast.error("click on resend code");
    }
    if (isVerificationCodeExpired()) {
      toast.error("code has expired! click on resend code");
      localStorage.removeItem("ecmo-forgot-code");
      localStorage.removeItem("ecmo-forgot-code-expiry");
      localStorage.removeItem("ecmo-forgot-email");
      return;
    } // Code has expired
    else {
      storedCode = JSON.parse(storedCode);
      let check = await bcryptjs.compare(code.trim(), storedCode);
      if (check) {
        localStorage.removeItem("ecmo-forgot-code");
        localStorage.removeItem("ecmo-forgot-code-expiry");
        setVerified(true);
        toast.success("Code is correct! Now you can change your password");
      } else {
        toast.error("code is incorrect");
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("ecmo-forgot-code")) {
      if (!isVerificationCodeExpired()) {
        setSent(true);
      } else {
        setSent(false);
      }
    }
  }, [router]);
  return (
    <div className="w-full relative flex items-center justify-center bg-gray-900 mx-auto h-[100vh]">
      <div className=" text-white absolute left-2 top-4">
        <Link href={"/"}>
          <Image
            src="/logo_main.jpeg"
            width={100}
            height={100}
            className="mx-auto"
            alt=""
          />
        </Link>
      </div>{" "}
      <div className="w-1/4 flex flex-col justify-center h-5/6">
        {!verified && loading ? (
          <Loader />
        ) : !verified && sent ? (
          <form onSubmit={verifyCode} className="w-full p-4 mx-auto">
            <div className="my-4">
              <TextField
                value={code}
                name={"code"}
                label={"Enter Six Digit Code"}
                onChange={(e) => setCode(e.target.value)}
                type="number"
              />
            </div>
            <p className="my-2 text-sm text-gray-400 text-center">
              enter the six digit received code
            </p>
            <div className="my-4">
              <Button type="submit">VERIFY</Button>
            </div>
            <button
              onClick={handleResend}
              type="button"
              className="mx-auto w-max block text-center text-blue-400 hover:text-blue-500"
            >
              resend code
            </button>
          </form>
        ) : (
          !verified && (
            <form onSubmit={getResetLink} className="w-full mx-auto">
              <div className="my-4">
                <TextField
                  value={email}
                  name={"email"}
                  label={"Email"}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <p className="my-2 text-sm text-gray-400 text-center">
                enter your email to receive code
              </p>
              <div className="my-4">
                <Button type="submit">GET CODE</Button>
              </div>
            </form>
          )
        )}
        {verified &&
          (loading ? (
            <Loader />
          ) : (
            <form onSubmit={changePassword} className="w-full mx-auto">
              <div className="my-4">
                <TextField
                  value={newPass}
                  name={"newPass"}
                  label={"New Password"}
                  onChange={(e) => setNewPass(e.target.value)}
                  type="password"
                />
              </div>
              <div className="my-4">
                <TextField
                  value={confirmPass}
                  name={"confirmPass"}
                  label={"Confirm Password"}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  type="password"
                />
              </div>
              <div className="my-4">
                <Button type="submit">CHANGE</Button>
              </div>
            </form>
          ))}
      </div>
    </div>
  );
};

export default Page;
