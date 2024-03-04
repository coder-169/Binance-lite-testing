"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../components/Loader";
import bcryptjs from "bcryptjs";
import { toast } from "react-toastify";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, TextField } from "@mui/material";

const Page = () => {
  const [user, setUser] = useState({
    username: "",
    phone: "",
    confirmPassword: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();
  // Check if the verification code has expired
  function isVerificationCodeExpired() {
    const expirationTime = localStorage.getItem("ecmo-verify-code-expiry");
    if (!expirationTime) return true; // If there's no expiration time, consider it expired
    return new Date().getTime() > parseInt(expirationTime, 10);
  }
  const storeCode = async (code) => {
    // send email where the code will be sent
    console.log(code);
    const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes in milliseconds
    const hashedCode = await bcryptjs.hash(code.toString(), 10);

    localStorage.setItem("ecmo-verify-code", JSON.stringify(hashedCode));

    localStorage.setItem("ecmo-verify-code-expiry", expirationTime.toString());
  };
  const [signUp, setSignUp] = useState(false);
  const handleSingUp = async (e) => {
    e.preventDefault();
    if (
      user.email === "" ||
      user.firstName === "" ||
      user.lastName === "" ||
      user.phone === "" ||
      user.password === "" ||
      user.countryCode === ""
    ) {
      return toast.error("Please fill all the fields");
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("ecmo-email", user.email);
        storeCode(data.code);
        setSignUp(true);
        setVerificationCode("");
        // router.push("/login");
        toast.success(data.message);
      } else {
        toast.error(data.message);
        setSignUp(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const verifyCode = async (e) => {
    e?.preventDefault();
    if (verificationCode === "") {
      toast.error("enter code to verify");
      return;
    }
    let storedCode = localStorage.getItem("ecmo-verify-code");
    // No code to verify
    if (!storedCode) {
      toast.error("try to register again");
    }
    if (isVerificationCodeExpired()) {
      toast.error("code has expired! register again");
      localStorage.removeItem("ecmo-verify-code");
      localStorage.removeItem("ecmo-verify-code-expiry");
      return;
    } // Code has expired
    else {
      storedCode = JSON.parse(storedCode);
      console.log(verificationCode, storedCode);
      let check = await bcryptjs.compare(verificationCode, storedCode);
      if (check) {
        setVerified(true);
        setVerificationCode("");
        localStorage.removeItem("ecmo-verify-code");
        localStorage.removeItem("ecmo-verify-code-expiry");
        const res = await fetch("http://localhost:5000/api/v1/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("ecmo-email") || user.email,
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message);
          router.push("/login");
        } else {
          toast.error(data.message);
        }
        localStorage.removeItem("ecmo-email");
      } else {
        toast.error("code is incorrect");
      }
    }
  };
  const resendEmail = async () => {
    try {
      console.log(
        JSON.stringify({
          email: localStorage.getItem("ecmo-email"),
        })
      );
      const response = await fetch("http://localhost:5000/api/v1/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("ecmo-email"),
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log(data.code);
        storeCode(data.code);
        toast.success(data.message);
        setVerificationCode("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const reEnterEmail = async () => {
    setSignUp(false);
    localStorage.removeItem("ecmo-verify-code");
    localStorage.removeItem("ecmo-email");
    localStorage.removeItem("ecmo-verify-code-expiry");
  };
  const [passType, setPassType] = useState("password");
  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      router.push("/");
    }
    if (localStorage.getItem("ecmo-email")) {
      setSignUp(true);
      if (isVerificationCodeExpired()) {
        setSignUp(false);
        localStorage.removeItem("ecmo-verify-code");
        localStorage.removeItem("ecmo-email");
        localStorage.removeItem("ecmo-verify-code-expiry");
      }
    }
  }, [router]);
  return (
    <div className="w-full relative flex items-center h-[100vh] justify-center mx-auto">
      <button className=" text-white absolute left-2 top-4">
        <Link href={"/"}>
          <img src="/logo_main.jpeg" width={100} className="mx-auto" alt="" />
        </Link>
      </button>
      <div className="flex w-2/5 flex-col justify-start">
        {" "}
        <h3 className="text-2xl text-center font-medium text-gray-700 mt-12 mb-4">
          Sign up for free
        </h3>
        {!signUp &&
          (loading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSingUp} className="w-full py-2  mx-auto">
              <div className="my-4 w-full">
                <TextField
                  value={user.email}
                  id={"email"}
                  label={"Email"}
                  onChange={onChange}
                  type={"email"}
                  className="w-full"
                />
              </div>
              <div className="my-4 flex gap-2">
                <TextField
                  value={user.username}
                  id={"username"}
                  label={"User Name"}
                  onChange={onChange}
                  type={"text"}
                  className="w-1/2"
                />
                <TextField
                  value={user.phone}
                  id={"phone"}
                  label={"Phone"}
                  onChange={onChange}
                  type={"tel"}
                  className="w-1/2"

                />
              </div>
              <div className="my-4 relative">
                <TextField
                  value={user.password}
                  id={"password"}
                  label={"Password"}
                  onChange={onChange}
                  type={passType}
                  className="w-full"

                />{" "}
                {user.password.length > 0 && (
                  <button type="button" className="absolute right-3 top-5">
                    {passType === "text" ? (
                      <VisibilityOff
                        className="cursor-pointer"
                        onClick={() => setPassType("password")}
                      />
                    ) : (
                      <RemoveRedEyeIcon
                        className="cursor-pointer"
                        onClick={() => setPassType("text")}
                      />
                    )}
                  </button>
                )}
              </div>
              <div className="my-4 relative">
                <TextField
                  value={user.confirmPassword}
                  id={"confirmPassword"}
                  label={"Confirm Password"}
                  onChange={onChange}
                  type={passType}
                  className="w-full"

                />
                {user.password.length > 0 && (
                  <button type="button" className="absolute right-3 top-5">
                    {passType === "text" ? (
                      <VisibilityOff
                        className="cursor-pointer"
                        onClick={() => setPassType("password")}
                      />
                    ) : (
                      <RemoveRedEyeIcon
                        className="cursor-pointer"
                        onClick={() => setPassType("text")}
                      />
                    )}
                  </button>
                )}
              </div>
              {/* <div className=" text-xs flex items-center justify-center text-gray-400 gap-1">
                <input type="checkbox" className="" name="" id="" /> I agree to
                the{" "}
                <Link
                  className="text-blue-400 border-b border-blue-400 hover:text-blue-500"
                  to="/login"
                >
                  Terms of Service
                </Link>
                and
                <Link
                  className="text-blue-400 border-b border-blue-400 hover:text-blue-500"
                  to="/login"
                >
                  Privacy Policy
                </Link>
              </div> */}

              <Button
                type={"submit"}
                className="text-white mt-8 mx-auto block outline-white border-white bg-blue-500 hover:bg-blue-500 py-2 px-4"
                variant="contained"
              >
                CREATE ACCOUNT
              </Button>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Have an account{" "}
                <Link
                  className="text-blue-400 hover:text-blue-500"
                  href="/login"
                >
                  Login
                </Link>
              </p>
            </form>
          ))}
        {signUp &&
          (loading ? (
            <Loader />
          ) : (
            <form onSubmit={verifyCode} className="w-full h-max py-2  mx-auto">
              <div className="my-4">
                <TextField
                  value={verificationCode}
                  id={"verificationCode"}
                  label={"Enter Six digit Code"}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  type={"text"}
                />
              </div>
              <Button type={"submit"} className="my-4" variant="contained">
                VERIFY
              </Button>
              {verified ? (
                <Link
                  href={"/login"}
                  className="text-blue-400 hover:text-blue-500 block mx-auto w-max"
                >
                  login
                </Link>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={resendEmail}
                    className="text-blue-400 text-base hover:text-blue-500 block mx-auto w-max"
                  >
                    resend
                  </button>
                  <button
                    type="button"
                    onClick={reEnterEmail}
                    className="text-blue-400 text-base hover:text-blue-500 block mx-auto w-max"
                  >
                    go back
                  </button>
                </div>
              )}
            </form>
          ))}
      </div>
    </div>
  );
};

export default Page;
