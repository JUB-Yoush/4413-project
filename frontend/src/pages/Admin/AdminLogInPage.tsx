import React from 'react';
import Googollogo from "../../assets/Googollogo.png";
import Logo from "../../components/Logo.tsx";
import Button from "../../components/Button.tsx";

import {useState} from 'react';
import axios from 'axios';
import {useTokenContext} from "../../components/TokenContext.tsx";

const AdminLogInPage: React.FC = () => {
    const {setToken, setUserType} = useTokenContext();

    // login form state starts with email and password as empty strings
    const [loginForm, setLoginForm]
        = useState({email: "", password: ""});

    function logIn(event: React.FormEvent) {
        // handle sending info to flask once the form is submitted
        axios({
            method: "post",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/admin/login", //flask route that handles login auth
            data: {
                email: loginForm.email,
                password: loginForm.password,
            }
        }).then((response) => {
            console.log("log in run " + loginForm.email);
            setToken(response.data.token);
            setUserType("admin");
            // window.location.href = "/admin"; //redirect them to dashboard
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
        <div className={"min-w-full flex-grow"}>
        <form className="px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center" method={"post"}>
            <Logo size={48}></Logo>
            <p className="flex mb-4 justify-center">Admin</p>
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

            <Button onClick={()=>{window.location.href="/";}}>
                To User View</Button>
            <hr className={"border-camel mt-10 mb-10"}/>
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <p>Don't have an account? <a href={"/admin/signup"}
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
        </div>
    );
};

export default AdminLogInPage;