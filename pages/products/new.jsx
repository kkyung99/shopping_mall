import ProtectedRoute from "/src/components/ProtectedRoute";
import ProductsForm from "/src/components/ProductsForm";

export default function NewProductsPage() {
  return (
    <ProtectedRoute checkAdmin>
      <ProductsForm />
    </ProtectedRoute>
  );
}
