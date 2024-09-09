"use client";

import { useState } from "react";
import { uploadImage } from "../api/upload";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import useProducts from "../hooks/useProducts";
import Image from "next/image";

export default function ProductsForm() {
  const [product, setProduct] = useState({});
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { registerProduct } = useProducts();

  const handleChange = async (event) => {
    const { name, value, files } = event.target;
    if (name === "file") {
      setFile(files && files[0]);
      return;
    }
    setProduct((product) => ({ ...product, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    // 제품 사진 클라우디너리에 업로드 후 URL 획득
    uploadImage(file)
      .then((url) => {
        registerProduct.mutate(
          { product, url },
          {
            onSuccess: () => {
              Swal.fire({
                icon: "success",
                title: "상품이 등록되었습니다!",
                showConfirmButton: true,
                confirmButtonText: "확인",
              }).then(() => {
                router.push("/products/list");
              });
            },
            onError: (error) => {
              Swal.fire({
                icon: "error",
                title: "등록 실패",
                text: error.message,
              });
            },
          }
        );
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "업로드 실패",
          text: error.message,
        });
      })
      .finally(() => setIsUploading(false));
  };

  return (
    <div className="w-full bg-gray-100 rounded-lg py-10">
      <div className="text-2xl font-bold my-4 text-center">
        상품 등록 페이지
      </div>
      {file && (
        <Image
          src={URL.createObjectURL(file)}
          alt="local file"
          width={320} // w-80에 해당하는 픽셀 값
          height={320}
          className="mx-auto rounded-lg"
        />
      )}
      <form onSubmit={handleSubmit} className="flex flex-col px-12">
        <input
          type="file"
          accept="image/*"
          name="file"
          required
          onChange={handleChange}
          className="mt-5 mb-5"
        />

        <label className="font-bold text-[17px]">상품 이름</label>
        <input
          type="text"
          name="title"
          value={product.title ?? ""}
          required
          onChange={handleChange}
          className="p-4 border border-gray-300 my-1 rounded-lg mb-5"
        />
        <label className="font-bold text-[17px]">상품 설명</label>
        <input
          type="text"
          name="content"
          rows={4}
          cols={40}
          value={product.content ?? ""}
          required
          onChange={handleChange}
          className="p-4 border border-gray-300 my-1 rounded-lg mb-5"
        />
        <label className="font-bold text-[17px]">가격</label>
        <input
          type="number"
          name="price"
          value={product.price ?? ""}
          required
          onChange={handleChange}
          className="p-4 border border-gray-300 my-1 rounded-lg mb-5"
        />
        <label className="font-bold text-[17px]">카테고리</label>
        <input
          type="text"
          name="category"
          value={product.category ?? ""}
          required
          onChange={handleChange}
          className="p-4 border border-gray-300 my-1 rounded-lg mb-5"
        />
        <label className="font-bold text-[17px]">옵션</label>
        <input
          type="text"
          name="options"
          value={product.options ?? ""}
          required
          onChange={handleChange}
          className="p-4 border border-gray-300 my-1 rounded-lg mb-5"
        />
        <div>
          <br />
          <button
            disabled={isUploading}
            className="w-full px-6 py-3 bg-gray-500 text-white font-medium rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-gray-600 focuse:outline-none focuse:ring-0 active:bg-gray-700"
          >
            {isUploading ? "업로드 중입니다.." : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
