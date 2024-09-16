import ProductsList from "../src/components/ProductsList";
import LayoutBanner from "../src/components/Layout/LayoutBanner";
import { getProduct } from "../src/api/fbase";

export async function getServerSideProps() {
  const products = await getProduct();

  return {
    props: {
      initialProducts: products,
    },
  };
}

export default function Main({ initialProducts }) {
  return (
    <>
      <LayoutBanner />
      <ProductsList hideCategories={true} initialProducts={initialProducts} />
    </>
  );
}
