import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import LogInPage from "./pages/LogInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import useToken from "./components/useToken.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import OrderHistory from "./pages/OrderHistory.tsx";
import DetailPage from "./pages/DetailPage.tsx";
import MerchPage from "./pages/MerchPage.tsx";
import TourPage from "./pages/TourPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import Footer from "./components/Footer.tsx";
import CartPage from "./pages/CartPage.tsx";

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>(''); // Shared search state
    const handleSearch = (query: string) => {
        setSearchQuery(query); // Update search query from Navbar
    };
    //session tracking
    const { setToken, token, removeToken } = useToken();

    return (
        <div className="bg-cream min-h-screen">
            <Navbar tokenStr={token} removeToken={removeToken} onSearch={handleSearch}/>
            <div className={"min-h-screen"}>
            <Routes>
                <Route path="/" element={<Navigate to="/catalog/products" replace />} />

                <Route path="/catalog/products" element={<MerchPage searchQuery={searchQuery}/>} />
                <Route path="/catalog/products/:name" element={<DetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/tour" element={<TourPage searchQuery={searchQuery}/>} />
                <Route path="/contact" element={<ContactPage />} />

                {/* only show login route if the user is not signed in
                if logged in, let them see their account*/}
                {!token && token !== ""?
                <>
                    <Route path="/login" element={<LogInPage setToken={setToken} />} />
                    <Route path="/signup" element={<SignUpPage setToken={setToken}/>} />

                    {/*if they are not signed in, let account page and order history redirect to log in and sign up*/}
                    <Route path="/account-settings" element={<Navigate to="/login" replace />} />
                    <Route path="/order-history" element={<Navigate to="/login" replace />} />
                </>
                :
                <>
                    <Route path="/account-settings" element={<AccountPage tokenStr={token} setToken={setToken} removeToken={removeToken}/>} />
                    <Route path="/order-history" element={<OrderHistory tokenStr={token} setToken={setToken} removeToken={removeToken}/>} />

                    {/*if they are signed in, let log in and sign up redirect to account page*/}
                    <Route path="/login" element={<Navigate to="/account-settings" replace />} />
                    <Route path="/signup" element={<Navigate to="/account-settings" replace />} />
                </>

                }
                <Route path="/test" element={<TestPage />} />
            </Routes>
            </div>
            <Footer/>
        </div>
    );
}

export default App;
