"use client";

import CartItem from "./CartItem";
import { useRouter } from "next/router";
import useCart from "../hooks/useCart";
import { CiShoppingCart } from "react-icons/ci";

export default function ShoppingCart() {
  const router = useRouter();

  const {
    cartQuery: { data: cartProducts },
  } = useCart();

  const hasProducts = cartProducts && cartProducts.length > 0;
  const totalPrice =
    hasProducts &&
    cartProducts.reduce(
      (prev, current) => prev + parseInt(current.price) * current.quantity,
      0
    );

  const sortedProducts = hasProducts
    ? [...cartProducts].sort((a, b) => b.timestamp - a.timestamp)
    : [];

  const handleClick = () => {
    const products = cartProducts.map((product) => ({
      id: product.id,
      image: product.image,
      title: product.title,
      category: product.category,
      price: product.price,
      option: product.option,
      quantity: product.quantity,
    }));

    // 구매 페이지로 이동
    router.push(
      {
        pathname: "/products/purchase",
        query: {
          cartProducts: JSON.stringify(products), // JSON 형태로 전달
          cartTotalPrice: totalPrice,
        },
      },
      "/products/purchase"
    );
  };

  return (
    <div className="p-5 flex flex-col">
      <div className="text-2xl text-center font-bold pb-4 border-b border-gray-300">
        내 장바구니
      </div>
      {!hasProducts && (
        <div className="flex flex-col justify-center items-center mt-52">
          <CiShoppingCart className="text-5xl font-bold text-gray-500" />
          <p className="mb-5">장바구니에 상품을 담아보세요.</p>
          <button
            className="flex justify-center items-center w-52 p-3 border border-gray-500 rounded-lg"
            onClick={() => router.push("/products/list")}
          >
            쇼핑 계속하기
          </button>
        </div>
      )}
      {hasProducts && (
        <>
          <ul className="border-b border-gray-300 mb-8 px-5">
            {cartProducts &&
              sortedProducts.map((product, index) => (
                <CartItem key={`${product.id}-${index}`} product={product} />
              ))}
          </ul>
          <p className="flex justify-end">전 상품 무료배송</p>
          <div className="flex justify-end items-center font-semibold text-xl mb-10 md:text-2xl">
            <p>총 결제금액</p>
            <p className="text-red-600 ml-2">{totalPrice.toLocaleString()}원</p>
          </div>
          {!hasProducts ? null : (
            <div className="flex justify-center mt-5">
              <button
                onClick={handleClick}
                className="flex justify-center items-center w-52 p-3 bg-rose-500 text-white rounded-lg"
              >
                구매하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
