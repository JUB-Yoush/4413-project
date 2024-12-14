import React from 'react';
import Googollogo from "../assets/Googollogo.png";
import Logo from "../components/Logo.tsx";
import Button from "../components/Button.tsx";

import {useState} from 'react';
import axios from 'axios';
import {useTokenContext} from "../components/TokenContext.tsx";
import {useCartContext} from "../cart/CartContext.tsx";

const LogInPage: React.FC = () => {
    const {setToken, setUserType} = useTokenContext();
    const { handleCartMergeOnLogin } = useCartContext();

    // login form state starts with email and password as empty strings
    const [loginForm, setLoginForm]
        = useState({email: "", password: ""});

    function logIn(event: React.FormEvent) {
        // handle sending info to flask once the form is submitted
        axios({
            method: "post",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/login", //flask route that handles login auth
            data: {
                email: loginForm.email,
                password: loginForm.password,
            }
        }).then(async (response) => {
            console.log("log in run " + loginForm.email);
            setToken(response.data.token);
            setUserType("user");
            await handleCartMergeOnLogin();
            window.location.href = '/account-settings';
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })

        setLoginForm(({
            email: "",
            password: ""
        }))
        event.preventDefault();
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the loginForm state whenever a field changes
        const {value, name} = event.target
        setLoginForm(prevNote => ({
                ...prevNote, [name]: value
            })
        )
    }

    return (
        <form className="rounded px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center" >
            <div className="flex justify-center"><Logo size={48} ></Logo></div>
            <div className="mb-4">
                <label
                    htmlFor={"email"}>Email Address</label>
                <input
                    id={"email"} name={"email"} value={loginForm.email} type={"email"} onChange={handleChange}
                    placeholder={""} autoComplete={"on"}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full">
                <label
                    htmlFor={"password"}>Password</label>
                <input
                    id={"password"} name={"password"} value={loginForm.password} type={"password"}
                    onChange={handleChange} placeholder={""} autoComplete={"on"}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full grid justify-center items-center">
                <Button type={"submit"} onClick={logIn}>Log In</Button>
            </div>

            <hr className={"border-camel mt-10 mb-10"}/>
            <Button onClick={()=>{window.location.href="/admin";}}>
                To Admin View</Button>
            <hr className={"border-camel mt-10 mb-10"}/>
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <p>Don't have an account? <a href={"/signup"}
                                             className={"font-normal underline text-camel hover:font-extrabold"}>
                    Sign Up</a></p>
                <p>Log In With:</p>
                <div
                    className={"h-16 w-24 relative bg-white bg-opacity-25 border border-white border-opacity-50 grid items-center justify-center rounded"}>
                    <a href={"/"}><span className={"w-full absolute top-0 left-0 z-10"}></span>
                        <img src={Googollogo} className={"h-8 w-8"} alt="Google Logo"/>
                    </a>
                </div>
            </div>
        </form>
    );
};

export default LogInPage;