import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenContext } from '../TokenContext'; // Adjust the path as needed
import Googollogo from "../assets/Googollogo.png";
import Logo from "../components/Logo.tsx";
import Button from "../components/Button.tsx";
import axios from 'axios';
import { useCartContext } from '../cart/CartContext.tsx';

const LogInPage: React.FC = () => {
    const { setToken } = useTokenContext(); // Access setToken from TokenContext
    const { handleCartMergeOnLogin } = useCartContext(); 
    const navigate = useNavigate(); // React Router hook for navigation

    // Login form state starts with email and password as empty strings
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });

    const logIn = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent page reload
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                email: loginForm.email,
                password: loginForm.password,
            });
            console.log("Log in successful for email:", loginForm.email);
            console.log("Axios Response:", response);
            // Set the token using TokenContext
            setToken(response.data.token);

            
            await handleCartMergeOnLogin();

            // Redirect to the merch page
            navigate('/');
        } catch (error: any) {
            console.error("Login failed", error.response || error);
        } finally {
            // Clear the form
            setLoginForm({ email: "", password: "" });
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setLoginForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    return (
        <form
            className="rounded px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center"
            method="post"
            onSubmit={logIn} // Handle form submission
        >
            <Logo size={48} />
            <div className="mb-4">
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    name="email"
                    value={loginForm.email}
                    type="email"
                    onChange={handleChange}
                    placeholder=""
                    autoComplete="on"
                    className="bg-transparent w-full mt-1 py-1 px-2 border border-camel"
                />
            </div>
            <div className="mb-4 w-full">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    value={loginForm.password}
                    type="password"
                    onChange={handleChange}
                    placeholder=""
                    autoComplete="on"
                    className="bg-transparent w-full mt-1 py-1 px-2 border border-camel"
                />
            </div>
            <div className="mb-4 w-full grid justify-center items-center">
                <Button type="submit">Log In</Button>
            </div>

            <hr className="border-camel mt-10 mb-10" />
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <p>
                    Don't have an account?{" "}
                    <a href="/signup" className="font-normal underline text-camel hover:font-extrabold">
                        Sign Up
                    </a>
                </p>
                <p>Log In With:</p>
                <div className="h-16 w-24 relative bg-white bg-opacity-25 border border-white border-opacity-50 grid items-center justify-center rounded">
                    <a href="/">
                        <span className="w-full absolute top-0 left-0 z-10"></span>
                        <img src={Googollogo} className="h-8 w-8" alt="Google Logo" />
                    </a>
                </div>
            </div>
        </form>
    );
};

export default LogInPage;
