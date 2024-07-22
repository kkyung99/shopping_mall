"use client";

import { IoCloseOutline } from "react-icons/io5";

export default function SelectedOptionCard({
  price,
  option,
  selectedQuantity,
  selectedPrice,
  handleOptionDelete,
  handleMinus,
  handlePlus,
}) {
  return (
    <div className="bg-gray-100 p-3 mb-3 rounded">
      <div>
        <div className="flex justify-between">
          <p>{option}</p>
          <IoCloseOutline
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => handleOptionDelete(option)}
          />
        </div>
        <div className="flex justify-between mt-3">
          <div className="">
            <div className="flex items-center">
              <button
                className="w-7 h-7 flex justify-center items-center border hover:bg-white rounded-l"
                onClick={() => handleMinus(option)}
              >
                -
              </button>
              <div className="w-7 h-7 text-center border-t border-b outline-none flex justify-center items-center">
                {selectedQuantity?.[option] || 1}
              </div>
              <button
                className="w-7 h-7 flex justify-center items-center border hover:bg-white rounded-r"
                onClick={() => handlePlus(option)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <p className="font-bold">
              {Number(selectedPrice?.[option] || price).toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
