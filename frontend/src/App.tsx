import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import TestPage from './pages/TestPage';
import LogInPage from "./pages/LogInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import OrderHistory from "./pages/OrderHistory.tsx";
import DetailPage from "./pages/DetailPage.tsx";
import MerchPage from "./pages/MerchPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import Footer from "./components/Footer.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import RouteNotFound from "./pages/RouteNotFound.tsx";
import AdminSidebar from "./components/Admin/Admin-Sidebar.tsx";

import {useTokenContext} from "./components/TokenContext.tsx";
import AdminLogInPage from "./pages/Admin/AdminLogInPage.tsx";
import AdminSignUpPage from "./pages/Admin/AdminSignUpPage.tsx";
import AddProductPage from "./pages/Admin/AddProductPage.tsx";
import Logo from "./components/Logo.tsx";
import Users from "./pages/Admin/Users.tsx";
import Orders from "./pages/Admin/Orders.tsx";
import Inventory from "./pages/Admin/Inventory.tsx";
import EditProductPage from "./pages/Admin/EditProductPage.tsx";
import DashSummary from "./pages/Admin/DashSummary.tsx";
import { SearchProvider } from "./components/SearchContext";
import { MetadataProvider } from "./components/MetadataContext";

const App: React.FC = () => {

    //session tracking
    const {token, userType} = useTokenContext();
    const AdminLayout = ()=>{
        console.log("user type", userType);
        return (
            <div className="bg-beige min-h-screen flex gap-4 pt-8 pb-10">
                {/* Sidebar for filtering */}
                {userType && userType === "admin"?
                <div className="border-r border-r-camel mb-10">
                    <AdminSidebar />
                </div>
                    : <></>}

                {/* Main section */}
                <div className="w-9/12 flex flex-col pb-16 pr-4 gap-4 min-h-screen flex-grow">
                    <div className={"min-w-full text-left"}><Logo size={20}></Logo></div>
                    <Outlet />
                </div>
            </div>
        )};
    const UserLayout = ()=>{
        console.log("user type", userType);
        
        return (
            <div>
                <Navbar />
                <Outlet />
            </div>
        )};
    return (
        <MetadataProvider>
        <SearchProvider>
        <div className="bg-cream min-h-screen">
            <div className={"min-h-screen"}>
                <Routes>
                <Route path='/' element={<UserLayout />}>
                    <Route index element={<Navigate to="/catalog/products" replace />} />

                    <Route path="/catalog/products" element={<MerchPage />} />
                    <Route path="/catalog/products/:name" element={<DetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<RouteNotFound url={"/"} label={"Back to Home"}/>} />

                    {/* only show login route if the user is not signed in
                    if logged in, let them see their account*/}
                    {!token && token !== ""?
                        <>
                            <Route path="/login" element={<LogInPage />} />
                            <Route path="/signup" element={<SignUpPage/>} />

                            {/*if they are not signed in, let account page and order history redirect to log in and sign up*/}
                            <Route path="/account-settings" element={<Navigate to="/login" replace />} />
                            <Route path="/order-history" element={<Navigate to="/login" replace />} />
                        </>
                        :
                        <>
                            <Route path="/account-settings" element={<AccountPage/>} />
                            <Route path="/order-history" element={<OrderHistory/>} />

                            {/*if they are signed in, let log in and sign up redirect to account page*/}
                            <Route path="login" element={<Navigate to="/account-settings" replace />} />
                            <Route path="signup" element={<Navigate to="/account-settings" replace />} />
                        </>

                    }
                    <Route path="/test" element={<TestPage />} />
                </Route>

                {/*for Admin pages*/}
                <Route path="/admin" element={<AdminLayout />}>
                    {userType && userType === "admin"?
                        <>
                            {/*Only available if admin*/}
                            <Route index element={<DashSummary />} />
                            <Route index path={"/admin/dashboard"} element={<DashSummary />} />
                            <Route path={"/admin/inventory"} element={<Inventory />} />
                            <Route path="/admin/inventory/:id" element={<EditProductPage />} />
                            <Route path={"/admin/inventory/addProduct"} element={<AddProductPage />} />

                            <Route path={"/admin/orders"} element={<Orders />} />
                            <Route index path={"/admin/users"} element={<Users />} />

                            <Route path={"/admin/login"} element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path={"/admin/signup"} element={<Navigate to="/admin/dashboard" replace />} />
                        </>
                        :
                        <>
                            <Route index element={<AdminLogInPage />} />
                            <Route path={"signup"} element={<AdminSignUpPage />} />

                            <Route path={"/admin/*"} element={<AdminLogInPage />} />
                        </>
                    }

                    <Route path="*" element={<RouteNotFound url={"/admin"} label={"To Dashboard"}/>} />
                </Route>
            </Routes>
            </div>
            <Footer/>
        </div>
        </SearchProvider>
        </MetadataProvider>
    );
}

export default App;
