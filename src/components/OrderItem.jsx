export default function OrderItem({ order, index }) {
  const orderTime = new Date(order.time);
  // prettier-ignore
  const formattedTime = 
        `${orderTime.getFullYear()}-${("0" + (orderTime.getMonth() + 1)).slice(-2)}-${("0" + orderTime.getDate()).slice(-2)} 
        ${("0" + orderTime.getHours()).slice(-2)}:${("0" + orderTime.getMinutes()).slice(-2)}:${("0" + orderTime.getSeconds()).slice(-2)}`;

  return (
    <div key={index} className="bg-gray-200 mb-4 p-4 rounded-lg">
      <p className="pl-2 pb-2 font-bold">결제완료</p>
      <div className="flex flex-col md:flex-row items-center">
        <img
          src={Object.values(order.orderProducts)[0].image}
          className="w-24 h-24 md:w-48 md:h-48 rounded-lg mb-4 md:mb-0 md:mr-4"
          alt="주문 상품 이미지"
        />
        {/* prettier-ignore */}
        <div className="flex-1">
          <p className="text-lg font-bold mb-2">주문번호: {order.orderData.orderId}</p>
          <p className="text-gray-700">{order.orderData.orderTitle} / (총 {Object.keys(order.orderProducts).length}개)</p>
          <p className="text-gray-700">{order.orderData.orderTotalPrice.toLocaleString()}원</p>
          <p className="text-gray-700">{formattedTime}</p>
        </div>
      </div>
    </div>
  );
}
