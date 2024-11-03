import React from 'react';
import Googollogo from "../assets/Googollogo.png";
import Logo from "../components/Logo.tsx";
import Button from "../components/Button.tsx";

const SignUpPage: React.FC = () => {
    return (
        <form className="rounded px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center">
            <Logo size={48}></Logo>
            <div className="mb-4 w-full">
                <label
                    htmlFor={"firstname"}>First Name</label>
                <input
                    type={"text"} placeholder={""}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full">
                <label
                    htmlFor={"lastname"}>Last Name</label>
                <input
                    type={"text"} placeholder={""}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4">
                <label
                    htmlFor={"email"}>Email Address</label>
                <input
                    type={"email"} placeholder={""}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full">
                <label
                    htmlFor={"password"}>Password</label>
                <input
                    type={"password"} placeholder={""}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full grid justify-center items-center">
                <Button type={"submit"} >Sign Up</Button>
            </div>

            <hr className={"border-camel mt-10 mb-10"}/>
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <p>Already have an account? <a href={"/login"} className={"font-normal underline text-camel hover:font-extrabold"}>
                    Log In</a></p>
                <p>Sign Up With:</p>
                <div className={"h-16 w-24 relative bg-white bg-opacity-25 border border-white border-opacity-50 grid items-center justify-center rounded"}>
                    <a href={"/"}><span className={"w-full absolute top-0 left-0 z-10"}></span>
                        <img src={Googollogo} className={"h-8 w-8"} alt="Google Logo"/>
                    </a>
                </div>
            </div>
        </form>
    );
};

export default SignUpPage;