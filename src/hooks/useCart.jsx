import { useAuthContext } from "../context/AuthContext";
import {
  addCart,
  getCart,
  removeCart,
  removeCartAll,
  updateCart,
} from "../api/fbase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export default function useCart() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const cartQuery = useQuery(["carts", user?.uid], () => getCart(user.uid), {
    enabled: !!user?.uid,
  });

  const addCartItem = useMutation((product) => addCart(user.uid, product), {
    onSuccess: () => {
      queryClient.invalidateQueries(["carts", user.uid]);
    },
  });

  const updateCartItem = useMutation(
    (product) => updateCart(user.uid, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["carts", user.uid]);
      },
    }
  );

  const removeCartItem = useMutation(
    async ({ id, option }) => {
      const result = await Swal.fire({
        title: "삭제하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      });

      if (result.isConfirmed) {
        await removeCart(user.uid, id, option);
        return true;
      } else {
        return false;
      }
    },
    {
      onSuccess: async (data) => {
        if (data === true) {
          queryClient.invalidateQueries(["carts", user.uid]);
          await Swal.fire({
            icon: "success",
            title: "삭제가 완료되었습니다.",
            showConfirmButton: true,
          });
        }
      },
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "삭제 실패",
          text: error.message,
          showConfirmButton: true,
        });
      },
    }
  );

  const removeCartAllItem = useMutation(() => removeCartAll(user.uid), {
    onSuccess: () => {
      queryClient.invalidateQueries(["carts", user.uid]);
    },
  });

  return {
    cartQuery,
    addCartItem,
    updateCartItem,
    removeCartItem,
    removeCartAllItem,
  };
}
