import React, { useContext, useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import {
  collection,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { MyContext } from "../../MyContext";
import useNotification from "../SnackBar/useNotification";
import ClearIcon from "@mui/icons-material/Clear";
import EmptyCartPage from "../Pages/EmptyCartPage";
import PageLoader from "../PageLoader/PageLoader";
import axios from "axios";

function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [user_id, setUser_id] = useState(null);
  const [ShippingCharge, setShippingCharge] = useState(4.99);
  const [subTotalPrice, setSubTotalPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const { itemCount } = useContext(MyContext);
  const [totalItemCount, setTotalItemCount] = itemCount;
  const [conf, setConf] = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getting currently loggedin user details from firebase.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser_id(user?.uid);
      } else {
        // user is not logged in.
        setUser_id(null);
      }
    });
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItemsCollection = collection(db, "cartItems");
        const q = query(cartItemsCollection, where("user_id", "==", user_id));

        const querySnapshot = await getDocs(q);
        const items = [];

        querySnapshot?.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setCartItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, [user_id]);

  useEffect(() => {
    // Calculate total price
    let amount = 0;
    cartItems?.forEach((item) => {
      amount += item.data.price * item.count;
    });

    setSubTotalPrice(amount.toFixed(2));
    setTotalPrice((amount + ShippingCharge).toFixed(2));
  }, [cartItems]);

  const handleCounterClick = async (flag, id) => {
    try {
      const cartItemQuery = query(
        collection(db, "cartItems"),
        where("user_id", "==", user_id)
      );

      const querySnapshot = await getDocs(cartItemQuery);

      for (const doc of querySnapshot.docs) {
        const cartItemData = doc.data();
        if (cartItemData.data.id === id) {
          const cartItemDocRef = doc.ref; // Use doc.ref to reference the document
          const cartItemDocSnapshot = await getDoc(cartItemDocRef);

          if (cartItemDocSnapshot.exists()) {
            const cartItemData = cartItemDocSnapshot.data();

            // Update the count based on the flag
            const newCount = flag
              ? cartItemData.count + 1
              : cartItemData.count - 1;

            // Ensure count does not go below 1
            if (newCount >= 1) {
              await updateDoc(cartItemDocRef, { count: newCount });
              console.log(`Count updated for cartItem with ID ${id}`);

              // Update the cartItems state
              const updatedCartItems = cartItems?.map((item) => {
                if (item.data.id === id) {
                  return { ...item, count: newCount };
                }
                return item;
              });
              setCartItems(updatedCartItems);

              // updating badge count of cart icon
              const newItemCount = flag
                ? totalItemCount + 1
                : totalItemCount - 1;
              setTotalItemCount(newItemCount);
            } else {
              console.log("Count cannot be negative");
            }
          } else {
            console.log("Document not found");
          }
        }
      }
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };

  const deleteCartItemByUserIdAndItemId = async (item_id) => {
    if (!user_id) return;
    try {
      const cartItemQuery = query(
        collection(db, "cartItems"),
        where("user_id", "==", user_id)
      );

      const querySnapshot = await getDocs(cartItemQuery);

      querySnapshot.forEach(async (doc) => {
        const cartItemData = doc.data();
        if (cartItemData.data.id === item_id) {
          await deleteDoc(doc.ref);
          setConf({ msg: "Item removed", variant: "error" });
          console.log(
            `Cart item with ID ${item_id} deleted successfully for user with ID ${user_id}`
          );

          // Remove the deleted item from cartItems state
          const updatedCartItems = cartItems.filter(
            (item) => item.data.id !== item_id
          );
          setCartItems(updatedCartItems);

          // updating badge of cart icon
          const newCount =
            parseFloat(itemCount) - parseFloat(cartItemData.count);
          setTotalItemCount(newCount);
        }
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const deleteAllCartItems = async () => {
    if (!user_id) return;
    try {
      const cartItemQuery = query(
        collection(db, "cartItems"),
        where("user_id", "==", user_id)
      );

      const querySnapshot = await getDocs(cartItemQuery);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // After deleting all cart items for the user, you may want to reset the cartItems state and totalItemCount
      setCartItems([]);
      setTotalItemCount(0);
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  };

  // handling payment
  const initPayment = (data) => {
    const options = {
      key_id: process.env.REACT_APP_RZP_KEY_ID,
      key_secret: process.env.REACT_APP_RZP_KEY_SECRET,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = `${process.env.REACT_APP_PAYMENT_API}/api/payment/verify`;
          const { data } = await axios.post(verifyUrl, response);
          setConf({ msg: "Order placed", variant: "success" });
          deleteAllCartItems();
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    // creating razorpay instance
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    try {
      const orderUrl = `${process.env.REACT_APP_PAYMENT_API}/api/payment/orders`;
      const { data } = await axios.post(orderUrl, {
        amount: parseInt(totalPrice),
      });
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100">
      <NavBar
        showSearchAndDrawer={false}
        setTotalItemCount={setTotalItemCount}
        totalItemCount={totalItemCount}
      />
      {cartItems.length > 0 && (
        <div className=" pt-20">
          <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
          <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
              {cartItems?.map((item) => (
                <div
                  key={item.id}
                  className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                >
                  <img
                    src={item.data.image}
                    alt="product-image"
                    className="w-full rounded-lg sm:w-40"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">
                        {item.data.title}
                      </h2>
                      <p className="mt-1 text-xs text-gray-700">
                        {item.data.description}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                      <div className="flex items-center border-gray-100">
                        <span
                          onClick={() =>
                            handleCounterClick(false, item.data.id)
                          }
                          className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        >
                          -
                        </span>
                        <p className="h-8 w-8 pt-1.5 border bg-white items-center text-center text-xs outline-none">
                          {item.count}
                        </p>
                        <span
                          onClick={() => handleCounterClick(true, item.data.id)}
                          className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        >
                          +
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm">${item.data.price}</p>
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            deleteCartItemByUserIdAndItemId(item.data.id)
                          }
                        >
                          <ClearIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-gray-700">${subTotalPrice}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-700">${ShippingCharge}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Total</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">${totalPrice} USD</p>
                  <p className="text-sm text-gray-700">including VAT</p>
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
              >
                Check out
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <PageLoader />
      ) : (
        totalItemCount === 0 && <EmptyCartPage />
      )}
    </div>
  );
}

export default MyCart;
