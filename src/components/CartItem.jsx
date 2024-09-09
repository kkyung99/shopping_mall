"use client";

import { IoCloseOutline } from "react-icons/io5";
import useCart from "../hooks/useCart";
import Image from "next/image";

export default function CartItem({ product }) {
  const { updateCartItem, removeCartItem } = useCart();

  const handleMinus = () => {
    if (product.quantity < 2) return;
    updateCartItem.mutate({ ...product, quantity: product.quantity - 1 });
  };
  const handlePlus = () => {
    updateCartItem.mutate({ ...product, quantity: product.quantity + 1 });
  };
  const handleDelete = () => {
    removeCartItem.mutate({ id: product.id, option: product.option });
  };

  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center mb-5 my-5"
      key={product.id}
    >
      <Image
        src={product.image}
        alt={product.title}
        width={160}
        height={160}
        className="rounded-lg"
      />
      <div className="flex flex-col md:flex-row md:flex-1 justify-between w-full md:pl-5">
        <div className="text-gray-800 flex flex-col items-start bg-gray-50 rounded p-5 mt-3 md:flex-row md:items-center md:justify-between w-full md:bg-transparent md:mt-0">
          <div className="flex-1 mb-2 md:mb-0">
            <p className="text-lg">{product.title}</p>
            <p className="text-xl">{product.option}</p>
            <p className="font-semibold">
              {(product.price * product.quantity).toLocaleString()}원
            </p>
          </div>
          <div className="flex items-center">
            <button
              className="w-7 h-7 flex justify-center items-center border hover:bg-gray-200 rounded-l"
              onClick={handleMinus}
            >
              -
            </button>
            <div className="w-7 h-7 text-center border-t border-b border-gray-200 outline-none flex justify-center items-center">
              {product.quantity}
            </div>
            <button
              className="w-7 h-7 flex justify-center items-center border hover:bg-gray-200 rounded-r"
              onClick={handlePlus}
            >
              +
            </button>
            <IoCloseOutline
              className="cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5 ml-2 md:ml-4"
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
