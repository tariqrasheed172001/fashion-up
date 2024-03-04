import React from "react";

function EmptyCartPage() {
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">No Items in Cart</h1>
        <p className="text-gray-600">
          Your cart is empty. Continue shopping to add items.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}

export default EmptyCartPage;
