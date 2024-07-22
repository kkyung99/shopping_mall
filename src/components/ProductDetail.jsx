"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import SelectedOptionCard from "./SelectedOptionCard";
import useCart from "../hooks/useCart";
import useProducts from "../hooks/useProducts";

export default function ProductDetail() {
  const router = useRouter();
  const {
    id,
    image,
    title,
    category,
    price,
    options: rawOptions,
    content,
  } = router.query;
  const options = Array.isArray(rawOptions) ? rawOptions : [rawOptions];
  const { user } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [total, setTotal] = useState(0);
  const [currOption, setCurrOption] = useState("");

  const { addCartItem } = useCart();
  const { deleteProduct } = useProducts();

  const calTotalPrice = (currQuantity) => {
    const totalQuantity = Object.values(currQuantity).reduce(
      (prev, curr) => prev + curr,
      0
    );
    setTotal(totalQuantity * price);
  };

  const handleSelect = (e) => {
    if (selectedOption.includes(e.target.value)) return;

    setSelectedOption([...selectedOption, e.target.value]);
    setSelectedQuantity({ ...selectedQuantity, [e.target.value]: 1 });
    setSelectedPrice({ ...selectedPrice, [e.target.value]: price });
    calTotalPrice({ ...selectedQuantity, [e.target.value]: 1 });
    setCurrOption("");
  };

  const reset = () => {
    setSelectedOption([]);
    setSelectedQuantity({});
    setSelectedPrice({});
    setTotal(0);
    setCurrOption("");
  };

  const handleMinus = (option) => {
    if (selectedQuantity[option] < 2) {
      return;
    }
    setSelectedQuantity({
      ...selectedQuantity,
      [option]: selectedQuantity[option] - 1,
    });
    setSelectedPrice({
      ...selectedPrice,
      [option]: price * (selectedQuantity[option] - 1),
    });
    calTotalPrice({
      ...selectedQuantity,
      [option]: selectedQuantity[option] - 1,
    });
  };

  const handlePlus = (option) => {
    setSelectedQuantity({
      ...selectedQuantity,
      [option]: selectedQuantity[option] + 1,
    });
    setSelectedPrice({
      ...selectedPrice,
      [option]: price * (selectedQuantity[option] + 1),
    });
    calTotalPrice({
      ...selectedQuantity,
      [option]: selectedQuantity[option] + 1,
    });
  };

  const handleClick = async () => {
    if (!user) {
      await Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다!",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      return;
    }
    if (selectedOption.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "옵션을 선택하세요!",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      return;
    }

    const products = selectedOption.map((option) => ({
      id,
      image,
      title,
      category,
      price,
      option: option,
      quantity: selectedQuantity[option],
      timestamp: new Date().getTime(),
    }));

    // 장바구니에 상품 추가
    await Promise.all(
      products.map((product) => addCartItem.mutateAsync(product))
    );

    await Swal.fire({
      icon: "success",
      title: "장바구니에 추가되었습니다!",
      showConfirmButton: true,
      confirmButtonText: "확인",
    });

    // 폼 리셋
    reset();
  };

  const handleOptionDelete = (option) => {
    Swal.fire({
      icon: "question",
      title: `선택하신 ${option} 옵션을 삭제하시겠습니까?`,
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "삭제가 완료되었습니다.",
          showConfirmButton: true,
        });
        setSelectedOption(selectedOption.filter((opt) => opt !== option));
        const { [option]: _, ...restQuantity } = selectedQuantity; // 객체 분해 할당
        const { [option]: __, ...restPrice } = selectedPrice;
        setSelectedQuantity(restQuantity);
        setSelectedPrice(restPrice);
        calTotalPrice(restQuantity);
        return result;
      }
    });
  };

  const handlePurchase = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다!",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      return;
    }
    if (selectedOption.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "옵션을 선택하세요!",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      return;
    }

    const products = selectedOption.map((option) => ({
      id,
      image,
      title,
      category,
      price,
      option: option,
      quantity: selectedQuantity[option],
    }));

    // 구매 페이지로 이동
    router.push(
      {
        pathname: "/products/purchase",
        query: {
          products: JSON.stringify(products), // JSON 형태로 전달
          buyNowTotalPrice: total,
        },
      },
      "/products/purchase"
    );

    reset();
  };

  return (
    <>
      <p className="mx-10 mt-4 text-gray-700">{`<${category}>`}</p>
      <div className="flex flex-wrap md:flex-row p-4">
        <img
          key={image}
          src={image}
          alt={title}
          className="w-full md:w-1/2 px-4 object-contain"
        />
        <div className="w-full md:w-1/2 flex flex-col px-4">
          <h2 className="text-3xl font-bold py-2">{title}</h2>
          <p className="text-2xl font-bold py-2 border-b border-gray-400">
            {`${price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`}
          </p>
          <p className="py-4 text-[15px]">{content}</p>

          {/* 옵션 */}
          <div className="flex items-center">
            <select
              id="select"
              className="p-3 mt-4 mb-4 flex-1 border rounded outline-none"
              onChange={handleSelect}
              value={currOption}
            >
              <option value="" disabled>
                옵션을 선택하세요.
              </option>
              {options &&
                options.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
            </select>
          </div>
          {/* 옵션 선택 후 */}
          {selectedOption.map((option, index) => (
            <SelectedOptionCard
              key={index}
              option={option}
              selectedQuantity={selectedQuantity}
              selectedPrice={selectedPrice}
              handleOptionDelete={handleOptionDelete}
              handleMinus={handleMinus}
              handlePlus={handlePlus}
              price={price}
            />
          ))}

          <div className="flex justify-between my-5">
            <p className="font-weight text-[18px]">총 상품 금액:</p>
            <p className="font-bold text-[20px] text-red-600">
              {total.toLocaleString()}원
            </p>
          </div>
          <button
            onClick={handleClick}
            className="w-full px-6 py-3 bg-gray-500 text-white font-medium rounded shadow-md mb-3 hover:bg-gray-700 hover:shadow-lg"
          >
            장바구니
          </button>
          <button
            onClick={handlePurchase}
            className="w-full px-6 py-3 bg-black text-white font-medium rounded shadow-md mb-3  hover:bg-gray-700 hover:shadow-lg"
          >
            바로 구매하기
          </button>
          {user && user.isAdmin && (
            <div className="flex justify-end">
              <FaTrash
                onClick={() => deleteProduct.mutateAsync(id)}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              />
            </div>
          )}
        </div>
        <div className="w-full my-5 border-[1px] border-lightGray"></div>
      </div>
    </>
  );
}
