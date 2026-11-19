"use client";

import { ToastContainer } from "react-toastify";

const Toaster = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
            newestOnTop
            closeOnClick
            pauseOnHover
        />
    );
};

export default Toaster;