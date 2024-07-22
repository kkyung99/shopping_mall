import ProtectedRoute from "/src/components/ProtectedRoute";
import PurchaseProduct from "/src/components/PurchaseProduct";

export default function purchasePage() {
  return (
    <ProtectedRoute>
      <PurchaseProduct />
    </ProtectedRoute>
  );
}
