import React from "react";
import { CircularProgress } from "@mui/material";

function ProductCard({
  data,
  handleClickOpen,
  renderRatingStars,
  handleAddCartClick,
  loading,
}) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img
        className="cursor-pointer p-5 items-center justify-center rounded-t-lg object-contain"
        src={data?.image}
        style={{ height: "300px" }}
        alt="product image"
        onClick={handleClickOpen}
      />
      <div className="px-5 pb-5">
        <div onClick={handleClickOpen}>
          <a>
            <h5 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
              {data?.title}
            </h5>
          </a>
          <div className="flex items-center mt-2.5 mb-5">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              {/* Render rating stars */}
              {renderRatingStars(data?.rating?.rate)}
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {data?.rating?.rate}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span
            onClick={handleClickOpen}
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            ${data?.price}
          </span>
          {loading ? (
            <CircularProgress size="1.5rem" />
          ) : (
            <button
              onClick={handleAddCartClick}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
