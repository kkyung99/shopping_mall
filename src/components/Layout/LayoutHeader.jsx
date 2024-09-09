"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { RiArrowDownWideFill } from "react-icons/ri";
import { signInWithGoogle, logout } from "/src/api/fauth";
import User from "../User";
import { useAuthContext } from "/src/context/AuthContext";
import useCart from "/src/hooks/useCart";
import Image from "next/image";

export default function LayoutHeader() {
  const [showNav, setShowNav] = useState(false);
  const { user } = useAuthContext();

  const {
    cartQuery: { data: cartProducts },
  } = useCart();

  return (
    <div>
      <div className="flex items-center justify-between py-4 relative">
        <div className="flex items-center md:space-x-6 lg:space-x-10">
          <div className="font-semibold text-2xl">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="shrink-0 justify-center items-center"
              />
            </Link>
          </div>
          <nav className="max-md:hidden">
            {/* prettier-ignore */}
            <ul className="flex items-center lg:space-x-10 space-x-7 opacity-70 text-[15px]">
              <li><Link href="/" className="py-3 inline-block">Home</Link></li>
              <li><Link href="/products/list" className="py-3 inline-block w-full">Product</Link></li>
              <li>{user && <Link href="/mypage" className="py-3 inline-block w-full">My Page</Link>}</li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 p-2 rounded-full max-md:hidden">
            <BsSearch className=" text-gray-400" size={20} />
            <input
              className="outline-none bg-transparent ml-2  placeholder:font-light placeholder: text-gray-600 text-[15px]"
              type="text"
              placeholder="상품을 입력하세요"
              autoComplete="false"
            />
          </div>
          <div className="relative cursor-pointer flex gap-1 text-gray-500 text-[30px] items-center space-x-1">
            {user && user.isAdmin && (
              <Link href="/products/new">
                <HiOutlinePencilSquare />
              </Link>
            )}
            {user && (
              <Link href="/cart" className="relative">
                <HiOutlineShoppingBag />
                {cartProducts && cartProducts.length > 0 && (
                  <div className="bg-red-500 rounded-full absolute top-0 right-0 w-[18px] h-[18px] text-[12px] text-white grid place-items-center translate-x-0.5 translate-y-0.5">
                    {cartProducts.length}
                  </div>
                )}
              </Link>
            )}
            {user ? <User user={user} /> : ""}
            {!user ? (
              <BiUser onClick={signInWithGoogle} />
            ) : (
              <MdLogout onClick={logout} />
            )}
          </div>
          <span
            onClick={() => setShowNav(!showNav)}
            className="p-[9px] md:hidden"
          >
            <RiArrowDownWideFill
              className={`transition ease-in curation-150 ${
                showNav ? "rotate-180" : "0"
              } text-gray-500 text-[25px]`}
            />
          </span>
        </div>
      </div>

      {/* 반응형 메뉴바 */}
      <div
        className={`md:hidden ${
          showNav ? "pb-4 px-5" : "h-0 invisible opacity-0"
        }`}
      >
        {/* prettier-ignore */}
        <ul className="flex flex-col text-[15px] opacity-75 px-2">
          <li><Link href="/" className="py-3 inline-block" onClick={() => setShowNav(false)}>Home</Link></li>
          <li><Link href="/products/list" className="py-3 inline-block w-full" onClick={() => setShowNav(false)}>Product</Link></li>
          <li>{user && <Link href="/mypage" className="py-3 inline-block w-full" onClick={() => setShowNav(false)}>My Page</Link>}</li>
        </ul>
        <div className="flex items-center bg-gray-100 p-2 rounded-lg my-4 py-3">
          <BsSearch className=" text-gray-400" size={20} />
          <input
            className="outline-none bg-transparent ml-2  placeholder:font-light placeholder: text-gray-600 text-[15px]"
            type="text"
            placeholder="상품을 입력하세요"
            autoComplete="false"
          />
        </div>
      </div>
    </div>
  );
}
