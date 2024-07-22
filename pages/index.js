import ProductsList from "../src/components/ProductsList";
import LayoutBanner from "../src/components/Layout/LayoutBanner";

export default function Main() {
  return (
    <>
      <LayoutBanner />
      <ProductsList hideCategories={true} />
    </>
  );
}
