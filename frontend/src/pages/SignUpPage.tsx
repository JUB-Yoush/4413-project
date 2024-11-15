import React, {useState} from 'react';
import Googollogo from "../assets/Googollogo.png";
import Logo from "../components/Logo.tsx";
import Button from "../components/Button.tsx";
import axios from "axios";

interface Token{
    setToken: React.Dispatch<React.SetStateAction<string | null>>; //is passed from App.tsx to manage session
}
const SignUpPage: React.FC<Token> = (setToken) => {
    // form state starts with fields as empty strings
    const [signUpForm, setSignUpForm]
        = useState(
            {
                fname: "",
                lname: "",
                email: "",
                password:"",
                card: "",
                street: "",
                city: "",
                province: "",
                postal: ""
            });
    function signUp(event) {
        // handle sending info to flask once the form is submitted
        axios({
            method: "post",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/signup", //flask route that handles signup auth
            data: {
                email: signUpForm.email,
                password: signUpForm.password,
                fname: signUpForm.fname,
                lname: signUpForm.lname,
                card: signUpForm.card,
                street: signUpForm.street,
                city: signUpForm.city,
                province: signUpForm.province,
                postal: signUpForm.postal
            }
        }).then((response) => {
            console.log("sign up run"+signUpForm.email);
            setToken.setToken(response.data.access_token);
            window.location.href = "/"; //redirect them to merch page
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })

        setSignUpForm(({
            fname: "",
            lname: "",
            email: "",
            password:"",
            card: "",
            street: "",
            city: "",
            province: "",
            postal: ""
        }))
        event.preventDefault();
    }

    function handleChange(event) {
        // handle updating the signUpForm state whenever a field changes
        const {value, name} = event.target
        setSignUpForm(prevNote => ({
            ...prevNote, [name]: value})
        )}

    return (
        <form className="rounded px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center">
            <Logo size={48}></Logo>
            <div className="mb-4 w-full">
                <label
                    htmlFor={"fname"}>First Name</label>
                <input
                    id={"fname"} type={"text"} name={"fname"} value={signUpForm.fname} onChange={handleChange} placeholder={""} autoComplete={"on"}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full">
                <label
                    htmlFor={"lname"}>Last Name</label>
                <input
                    id={"lname"} type={"text"} name={"lname"} value={signUpForm.lname} onChange={handleChange} placeholder={""} autoComplete={"on"}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4">
                <label
                    htmlFor={"email"}>Email Address</label>
                <input
                    id={"email"} type={"email"} name={"email"} value={signUpForm.email} onChange={handleChange} placeholder={""} autoComplete={"on"}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full">
                <label
                    htmlFor={"password"}>Password</label>
                <input
                    id={"password"} type={"password"} name={"password"} value={signUpForm.password} onChange={handleChange} placeholder={""} autoComplete={"on"}
                    className={"bg-transparent w-full mt-1 py-1 px-2 border border-camel"}/>
            </div>
            <div className="mb-4 w-full grid justify-center items-center">
                <Button type={"submit"} onClick={signUp}>Sign Up</Button>
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