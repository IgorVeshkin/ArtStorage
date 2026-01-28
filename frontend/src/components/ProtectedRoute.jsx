import { Navigate, Outlet } from "react-router-dom";

import React, { useState, useEffect } from "react";

import axios from "axios";

import loggedAPI from "./api/axiosInstances";

import CenteredPageSpinner from "./items/CenteredPageSpinner.jsx";


const ProtectedRoute = ({ Route }) => {

    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {

        const getUser = async () => {
            await loggedAPI.get("/api/get-user/").then(response => {
                setIsAuth(response.data.is_auth);
                console.log("Данные успешно получены: " + response.data.is_auth);
            }).catch(error => {

                setIsAuth(false);

            });
        }

        getUser();

    }, []);

    if (isAuth === null) {
        return <CenteredPageSpinner />;

    }

    if (isAuth === false) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;

}

export default ProtectedRoute;