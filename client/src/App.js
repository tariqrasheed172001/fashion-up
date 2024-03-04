import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/Pages/HomePage";
import MyCart from "./components/MyCart/MyCart";
import SignUp from "./components/Auth/SignUp/SignUp";
import SignIn from "./components/Auth/SignIn/SignIn";
import PhoneSignIn from "./components/Auth/PhoneSignIn/PhoneSignIn";
import { SnackbarProvider } from "notistack";
import ProtectRoutes from "./routeProtection/ProtectCart";
import ProtectCart from "./routeProtection/ProtectCart";
import ProtectAuth from "./routeProtection/ProtectAuth";
import { MyContext } from "./MyContext";
import { useState } from "react";
import PageNotFound from "./components/Pages/PageNotFound";

function App() {
  const [totalItemCount, setTotalItemCount] = useState(null);

  return (
    <MyContext.Provider
      value={{ itemCount: [totalItemCount, setTotalItemCount] }}
    >
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route element={<ProtectAuth />}>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="signInWithPhone" element={<PhoneSignIn />} />
            </Route>

            <Route element={<ProtectCart />}>
              <Route path="/my-cart" element={<MyCart />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </MyContext.Provider>
  );
}

export default App;
