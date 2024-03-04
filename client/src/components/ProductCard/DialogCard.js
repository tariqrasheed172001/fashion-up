import React, { useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import ProductCard from "./ProductCard";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import useNotification from "../SnackBar/useNotification";
import { MyContext } from "../../MyContext";
import { CircularProgress } from "@mui/material";

export default function DialogCard({ data, user_id }) {
  const [open, setOpen] = useState(false);
  const [conf, setConf] = useNotification();
  const { itemCount } = useContext(MyContext);
  const [totalItemCount, setTotalItemCount] = itemCount;
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddCartClick = async () => {
    setLoading(true);
    try {
      // Query the cartItems collection to check if the item exists for the user
      const cartItemQuery = query(
        collection(db, "cartItems"),
        where("user_id", "==", user_id)
      );
      const querySnapshot = await getDocs(cartItemQuery);

      let itemExists = false;
      let existingCartItemRef;

      querySnapshot.forEach((doc) => {
        const cartItem = doc.data();
        if (cartItem.data.id === data.id) {
          itemExists = true;
          existingCartItemRef = doc.ref;
        }
      });

      if (!itemExists) {
        // If the item doesn't exist in the cart, add it as a new document
        const docRef = await addDoc(collection(db, "cartItems"), {
          user_id,
          data,
          count: 1,
        });
        setConf({ msg: "Product added to cart", variant: "success" });
        setOpen(false);
        console.log("Document written with ID: ", docRef.id);
      } else {
        // If the item exists in the cart, update the count
        const existingCartItemSnapshot = await getDoc(existingCartItemRef);
        const existingCartItemData = existingCartItemSnapshot.data();
        const newCount = existingCartItemData.count + 1;

        // Update the count for the existing item
        await updateDoc(existingCartItemRef, { count: newCount });
        setConf({ msg: "Product count updated in cart", variant: "success" });
        setOpen(false);
      }
      setTotalItemCount(totalItemCount + 1);
      setLoading(false);
    } catch (e) {
      console.error("Error adding/updating document: ", e);
    }
  };

  // Function to render rating stars based on the rating value
  const renderRatingStars = (rating) => {
    const stars = [];
    // Loop through the rating value and render filled or empty stars accordingly
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <React.Fragment>
      <ProductCard
        renderRatingStars={renderRatingStars}
        handleClickOpen={handleClickOpen}
        data={data}
        handleAddCartClick={handleAddCartClick}
        loading={loading}
      />
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <a className="flex flex-col items-center bg-white border border-200 shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <img
            className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
            src={data?.image}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {data?.title}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {data?.description}
            </p>
            <div className="flex items-center mt-2.5 mb-5">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {/* Render rating stars */}
                {renderRatingStars(data?.rating?.rate)}
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                {data?.rating?.rate}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                rating count {data?.rating?.count}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
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
        </a>
      </Dialog>
    </React.Fragment>
  );
}
