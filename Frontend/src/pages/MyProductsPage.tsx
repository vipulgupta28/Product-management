import MyProducts from "../components/MyProducts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import React from "react";

const MyProductsPage:React.FC = () =>{
    return(
        <>
        <Navbar/>
        <Sidebar/>
        <MyProducts/>
        </>
    )
}

export default MyProductsPage;