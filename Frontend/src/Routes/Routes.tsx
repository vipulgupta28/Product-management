import { Route, Routes } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import MyProductsPage from "../pages/MyProductsPage";
import AllProductsPage from "../pages/AllProductsPage";
import CategoriesPage from "../pages/CategoriesPage";
import React from "react";

const AppRoutes:React.FC = () =>{
    return(
        <>
            <Routes>
                <Route path="signuppage" element={<SignupPage/>}/>
                <Route path="loginpage" element={<LoginPage/>}/>
                <Route path="homepage" element={<HomePage/>}/>
                <Route path="myproductspage" element={<MyProductsPage/>}/>
                <Route path="allproductspage" element={<AllProductsPage/>}/>
                <Route path="categoriespage" element={<CategoriesPage/>}/>

            </Routes>
        </>
    )
}

export default AppRoutes;