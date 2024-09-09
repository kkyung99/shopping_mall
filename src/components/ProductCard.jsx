"use client";

import { useRouter } from "next/router";
import Image from "next/image";

export default function ProductCard({
  product: { id, image, title, category, price, options, content, time },
}) {
  const router = useRouter();
  const onMoveDetailPage = () => {
    router.push({
      pathname: `/products/${id}`,
      query: {
        image,
        title,
        category,
        price,
        options,
        content,
        time,
      },
    });
  };

  return (
    <div className="cursor-pointer group" onClick={onMoveDetailPage}>
      <div
        key={id}
        className="rounded shadow-md overflow-hidden justify-center items-center"
      >
        <div className="overflow-hidden w-full">
          <Image
            src={image}
            alt={title}
            className="transition-transform group-hover:scale-110 duration-500"
            width={500}
            height={300}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
      <div className="mt-2 px-2 text-lg group-hover:text-stone-400">
        <h3 className="truncate">{title}</h3>
        <p className="pb-2 font-semibold">{`${price.toLocaleString()}원`}</p>
      </div>
    </div>
  );
}
