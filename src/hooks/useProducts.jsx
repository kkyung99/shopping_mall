import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, addProduct, removeProduct } from "../api/fbase";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function useProducts() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const productsQuery = useQuery(["products"], getProduct, {
    staleTime: 1000 * 60,
  });

  const registerProduct = useMutation(
    ({ product, url }) => addProduct(product, url),
    {
      onSuccess: () => queryClient.invalidateQueries(["products"]),
    }
  );

  const deleteProduct = useMutation(
    async (productId) => {
      const result = await Swal.fire({
        title: "정말 상품을 삭제하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      });

      if (result.isConfirmed) {
        await removeProduct(productId);
        return true;
      } else {
        return false;
      }
    },
    {
      onSuccess: async (data) => {
        if (data === true) {
          await queryClient.invalidateQueries("products");
          await Swal.fire({
            icon: "success",
            title: "삭제가 완료되었습니다.",
            confirmButtonText: "확인",
            showConfirmButton: true,
          });
          router.push("/products/list");
        }
      },
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "삭제 실패",
          text: error.message,
          confirmButtonText: "확인",
          showConfirmButton: true,
        });
      },
    }
  );

  return { productsQuery, registerProduct, deleteProduct };
}
