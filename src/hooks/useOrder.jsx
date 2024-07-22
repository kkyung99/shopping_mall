import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { addOrder, getOrders } from "../api/fbase";

export default function useOrder() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const orderQuery = useQuery(
    ["orders", user?.uid],
    () => getOrders(user.uid),
    { enabled: !!user?.uid }
  );

  const addOrderData = useMutation(
    ({ orderData, productsData }) =>
      addOrder(user?.uid, orderData, productsData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", user.uid]);
      },
    }
  );

  return { orderQuery, addOrderData };
}
