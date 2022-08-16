import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {
    //const auth = localStorage.getItem('userid');

    const auth = sessionStorage.getItem('userid');

    return auth ? <Outlet />:<Navigate to="/" />
}

export default PrivateComponent;