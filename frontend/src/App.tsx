import { Routes, Route } from 'react-router-dom';
import MerchPage from './pages/MerchPage';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import LogInPage from "./pages/LogInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import useToken from "./components/useToken.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import OrderHistory from "./pages/OrderHistory.tsx";

function App() {
    //session tracking
    const { setToken, token, removeToken } = useToken();

    return (
        <div className="bg-cream h-full">
            <Navbar tokenStr={token} removeToken={removeToken}/>
            <Routes>
                <Route path="/" element={<MerchPage />} />
                {/* only show login route if the user is not signed in
                if logged in, let them see their account*/}
                {!token && token !== ""?
                <>
                    <Route path="/login" element={<LogInPage setToken={setToken} />} />
                    <Route path="/signup" element={<SignUpPage setToken={setToken}/>} />
                </>
                :
                <>
                    <Route path="/account-settings" element={<AccountPage tokenStr={token} setToken={setToken} removeToken={removeToken}/>} />
                    <Route path="/order-history" element={<OrderHistory tokenStr={token} setToken={setToken} removeToken={removeToken}/>} />
                </>

                }
                <Route path="/test" element={<TestPage />} />
            </Routes>
        </div>
    );
}

export default App;
