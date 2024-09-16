"use client";

import useOrder from "../hooks/useOrder";
import OrderItem from "./OrderItem";
import { FaClipboardList } from "react-icons/fa";

export default function OrderList() {
  const {
    orderQuery: { data: orders },
  } = useOrder();

  return (
    <div className="p-4">
      <p className="text-2xl font-bold mb-5 flex justify-center">
        나의 주문 목록
      </p>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <OrderItem key={order.orderData.orderId} order={order} />
        ))
      ) : (
        <div className="flex justify-center items-center h-96">
          <FaClipboardList className="text-2xl text-gray-500" />
          <p className="text-lg text-gray-500">주문 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
