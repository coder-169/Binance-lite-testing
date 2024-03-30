'use client'

import Link from "next/link";
import UserLayout from "./layouts/UserLayout";
import { useGlobalContext } from "./Context";
import { useRouter } from "next/navigation";
import AdminLayout from "./layouts/AdminLayout";
import { useEffect } from "react";
import Loader from "./components/Loader";
import Image from "next/image";


export default function Home() {

  const { isAuthenticated, loading, user, getUserInfo } = useGlobalContext()
  const router = useRouter()
  useEffect(() => {
    if (localStorage.getItem('auth-token') && !isAuthenticated) {
      getUserInfo()
    }
    //   router.push('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    loading ? <Loader /> : (
      (user?.role === 'admin' ? <AdminLayout>
        <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <Image height={250} width={200} className="lg:w-4/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src='/hero.jpg' />
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Welcome to Your Crypto Trading Assistant!</h1>
          <p className="mb-8 leading-relaxed">Ready to take your crypto trading to the next level? Subscribe now and seamlessly manage your trades with our powerful tools. Simply enter your Binance API keys to get started. Our platform ensures the security of your data while optimizing your trading strategies.
            Subscribe today and unlock the most of crypto by leaving your assets to the best traders in the world!.</p>
          <div className="flex justify-center">
            <Link href={'/trade/join'} className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-500 rounded text-lg">Subscribe</Link>
            <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Contact Us</button>
          </div>
        </div>
      </div>
    </section>
      </AdminLayout> : <UserLayout>
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <Image height={250} width={200} className="lg:w-4/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src='/hero.jpg' />
            <div className="text-center lg:w-2/3 w-full">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Welcome to Your Crypto Trading Assistant!</h1>
              <p className="mb-8 leading-relaxed">Ready to take your crypto trading to the next level? Subscribe now and seamlessly manage your trades with our powerful tools. Simply enter your Binance API keys to get started. Our platform ensures the security of your data while optimizing your trading strategies.
                Subscribe today and unlock the most of crypto by leaving your assets to the best traders in the world!.</p>
              <div className="flex justify-center">
                <Link href={'/trade/join'} className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-500 rounded text-lg">Subscribe</Link>
                <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Contact Us</button>
              </div>
            </div>
          </div>
        </section>
      </UserLayout>
      ))
  );
}
