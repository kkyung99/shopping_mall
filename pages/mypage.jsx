import OrderList from "/src/components/OrderList";
import ProtectedRoute from "/src/components/ProtectedRoute";

export default function MyPage() {
  return (
    <ProtectedRoute>
      <OrderList />
    </ProtectedRoute>
  );
}
