import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import useProducts from "../hooks/useProducts";

export default function ProductsList({ hideCategories }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const menuNav = ["전체", "아우터", "상의", "하의"];

  const {
    productsQuery: { data: products },
  } = useProducts();

  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    if (category === "전체") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (products) => products.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div>
      {/* menuNav */}
      {!hideCategories && (
        <div className="my-2 bg-gray-200 flex justify-evenly items-center p-2 rounded-lg">
          {menuNav.map((category, i) => (
            <div key={`menuNav-${i}`} className="p-1">
              <button
                onClick={() => handleCategoryClick(category)}
                className={`p-1 cursor-pointer hover:bg-white rounded hover:bg-opacity-50 ${
                  selectedCategory === category
                    ? "underline decoration-2 underline-offset-4 font-bold"
                    : ""
                }`}
              >
                {category}
              </button>
            </div>
          ))}
        </div>
      )}
      {/* 상품목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
