import ShoppingCart from "/src/components/ShoppingCart";
import ProtectedRoute from "/src/components/ProtectedRoute";

export default function Cart() {
  return (
    <ProtectedRoute>
      <ShoppingCart />
    </ProtectedRoute>
  );
}
