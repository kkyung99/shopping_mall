"use client";

import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import useOrder from "../hooks/useOrder";
import useCart from "../hooks/useCart";
import Swal from "sweetalert2";

export default function PurchaseProduct() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { cartProducts, products, buyNowTotalPrice, cartTotalPrice } =
    router.query;

  // products 문자열을 JSON 형태로 파싱
  const buyNowProducts = products ? JSON.parse(products) : null;
  const purchaseCartProducts = cartProducts ? JSON.parse(cartProducts) : null;
  const [zipCode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [check, setCheck] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { removeCartAllItem } = useCart();
  const { addOrderData } = useOrder();

  const handleCheck = (e) => {
    setCheck(e.target.checked);
    if (e.target.checked) {
      setName(user.displayName);
    } else {
      setName("");
    }
  };

  const handleName = (e) => {
    if (!check) {
      setName(e.target.value);
    }
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNum = value.replace(/[^\d]/g, "");
    const phoneNumLength = phoneNum.length;

    if (phoneNumLength < 4) return phoneNum;
    if (phoneNumLength < 8) {
      return `${phoneNum.slice(0, 3)}-${phoneNum.slice(3)}`;
    }
    return `${phoneNum.slice(0, 3)}-${phoneNum.slice(3, 7)}-${phoneNum.slice(
      7
    )}`;
  };

  const handlePhoneNumber = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  const showModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen((prev) => !prev);
  };

  const handleAddress = (data) => {
    setZipcode(data.zonecode);
    setAddress(data.roadAddress);
    setIsOpen((prev) => !prev);
  };

  function getOrderTitle(products) {
    if (products && products.length > 0) {
      return products.length > 1
        ? `${products[0].title} 외 ${products.length - 1}개`
        : products[0].title;
    } else {
      return "주문 상품 없음";
    }
  }

  useEffect(() => {
    const loadScript = async () => {
      // IMP 라이브러리 로드
      const script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // 라이브러리 로드 완료 후 초기화
        const IMP = window.IMP;
        if (IMP) {
          IMP.init(process.env.NEXT_PUBLIC_PAYMENT_ID);
        } else {
          console.error("IMP 객체를 찾을 수 없습니다.");
          // 초기화 실패 처리
        }
      };

      script.onerror = () => {
        console.error("IMP 라이브러리를 로드하는 중 오류가 발생했습니다.");
        // 로드 실패 처리
      };
    };

    loadScript();
  }, []);

  const handleSubmit = async () => {
    if (!name || !phoneNumber || !zipCode || !address || !addressDetail) {
      // alert("주문 정보를 모두 입력해주세요.");
      Swal.fire({
        title: "주문 정보를 모두 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (phoneNumber.replace(/-/g, "").length < 11) {
      Swal.fire({
        title: "휴대폰 번호를 정확하게 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const productsData = buyNowProducts || purchaseCartProducts;
    const totalAmount = buyNowTotalPrice || cartTotalPrice;

    let orderTitle = getOrderTitle(productsData);

    // 아임포트 결제 요청
    IMP.init(process.env.NEXT_PUBLIC_PAYMENT_ID);

    IMP.request_pay(
      {
        // param
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: `ORD${String(
          Math.floor(Math.random() * 1000000)
        ).padStart(7, "0")}`,
        name: orderTitle,
        amount: totalAmount,
        buyer_email: user.email,
        buyer_name: user.displayName,
        buyer_tel: phoneNumber || "",
        buyer_addr: address || "",
        buyer_postcode: user.zipCode || "",
        m_redirect_url: `${window.location.origin}/mypage`, // 모바일에서는 결제 시, 페이지 주소가 바뀜. 따라서 결제 끝나고 돌아갈 주소 입력해야 함
      },
      async (rsp) => {
        // callback
        if (rsp.success) {
          // Firebase에 저장할 데이터 구성
          const orderData = {
            orderId: rsp.merchant_uid,
            orderTitle: rsp.name,
            orderTotalPrice: rsp.paid_amount,
            buyerName: rsp.buyer_name,
            buyerEmail: rsp.buyer_email,
            buyerTel: rsp.buyer_tel,
            buyerAddr: rsp.buyer_addr,
            addressDetail: addressDetail,
            paymentMethod: rsp.pay_method,
            impUid: rsp.imp_uid,
            recipient: name,
          };

          try {
            // Firebase에 주문 데이터 저장
            await addOrderData.mutateAsync({ orderData, productsData });
            if (!buyNowProducts) {
              await removeCartAllItem.mutateAsync();
            }
            const result = await Swal.fire({
              title: "주문이 완료되었습니다!",
              icon: "success",
              confirmButtonText: "확인",
            });

            if (result.isConfirmed) {
              window.location.href = `${window.location.origin}/mypage`;
            }
          } catch (error) {
            console.error("Firebase에 주문 데이터 저장 중 오류 발생:", error);
          }
        } else {
          console.log("결제 실패:", rsp);
        }
      }
    );
  };

  return (
    <div className="p-5">
      <h1 className="flex justify-center text-2xl font-bold mb-5">
        구매 페이지
      </h1>
      <div className="w-full my-5 border-b-[0.5px] border-lightGray"></div>

      {/* 바로 구매 / 장바구니 상품 정보 출력 */}
      {buyNowProducts
        ? buyNowProducts?.map((product, index) => (
            <ul key={index} className="flex px-5 pt-3 mb-5 space-x-5">
              <div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-28 md:w-32 rounded-lg shrink-0"
                />
              </div>
              <div className="flex justify-between items-center md:w-full">
                <div className="flex-1 text-gray-800">
                  <p className="">{product.title}</p>
                  <p>{product.option}</p>
                  <div>
                    <span>{product.quantity}개 / </span>
                    <span className="font-semibold">
                      {(product.price * product.quantity).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </ul>
          ))
        : purchaseCartProducts?.map((product, index) => (
            <ul key={index} className="flex px-10 pt-3 mb-5 space-x-5">
              <div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-28 md:w-32 rounded-lg shrink-0"
                />
              </div>
              <div className="flex justify-between items-center md:w-full">
                <div className="flex-1 text-gray-800">
                  <p className="">{product.title}</p>
                  <p>{product.option}</p>
                  <div>
                    <span>{product.quantity}개 / </span>
                    <span className="font-semibold">
                      {(product.price * product.quantity).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </ul>
          ))}
      <div className="w-full my-5 border-b-[0.5px] border-lightGray"></div>
      {/* 총 금액 표시 */}
      <p className="flex justify-end">전 상품 무료배송</p>
      <div className="text-xl font-bold mb-5 flex justify-end">
        <p className="pr-3">총 주문금액</p>
        <p className="text-red-600">
          {buyNowProducts
            ? parseInt(buyNowTotalPrice).toLocaleString()
            : parseInt(cartTotalPrice).toLocaleString()}
          원
        </p>
      </div>

      {/* 배송정보 */}
      <div>
        <label className="text-2xl font-semibold mb-2 block">주문 정보</label>
        <div className="w-full my-3 border-b-[1px] border-gray-500"></div>
        <div className="px-7 py-5">
          <div className="flex items-center mb-4">
            <label className="mr-5 w-24">주문자</label>
            <p className="text-gray-600">{user?.displayName}</p>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <label>수령인</label>
            <span className="text-[12px]">
              <input
                type="checkbox"
                onChange={handleCheck}
                className="mr-1 w-[12px] h-[12px]"
              />
              주문자 정보와 동일
            </span>
          </div>
          <input
            type="text"
            className="p-2 border rounded-lg w-full mb-4 text-gray-600"
            value={check ? user.displayName : name}
            onChange={handleName}
            required
          />
          <div className="mb-4">
            <label className="block mb-2">핸드폰 번호</label>
            <input
              type="text"
              className="p-2 border rounded-lg w-full mb-4 text-gray-600"
              value={phoneNumber}
              onChange={handlePhoneNumber}
              placeholder="010-1234-5678"
              maxLength="13"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">배송주소</label>
            <div className="flex space-x-2 flex-wrap md:flex-nowrap mb-2">
              <input
                readOnly
                placeholder="13529"
                value={zipCode !== "" ? zipCode : ""}
                className="border rounded-lg p-2 w-40 text-gray-600"
                required
              />
              <button
                className="p-2 bg-gray-300 rounded-lg"
                onClick={showModal}
              >
                우편번호 찾기
              </button>
            </div>
            <div className="space-y-2 text-gray-600">
              <input
                readOnly
                value={address !== "" ? address : ""}
                className="border rounded-lg w-full p-2"
                required
              />
              <input
                placeholder="상세주소를 입력해주세요."
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                className="border rounded-lg w-full p-2"
                required
              />
            </div>
            {isOpen && (
              <Modal visible={true} onCancel={handleCancel} footer={null}>
                <DaumPostcodeEmbed onComplete={handleAddress} />
              </Modal>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={handleSubmit}
          className="flex justify-center items-center w-52 p-3 bg-rose-500 text-white rounded-lg"
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
