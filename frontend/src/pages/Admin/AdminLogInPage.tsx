import React from 'react';
import Logo from "../../components/Logo.tsx";
import Button from "../../components/Button.tsx";

import {useState} from 'react';
import axios from 'axios';
import {useTokenContext} from "../../components/TokenContext.tsx";
import {useForm, FormProvider} from "react-hook-form";

import Input from "../../components/Input.tsx";
import {
    email_validation, pw_validation
} from "../../components/InputValidations.tsx";

const AdminLogInPage: React.FC = () => {
    const {setToken, setUserType} = useTokenContext();

    // login form state starts with email and password as empty strings
    const [loginForm, setLoginForm]
        = useState({email: "", password: ""});

    const methods = useForm();
    const logIn = methods.handleSubmit(() => {
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
    })

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the loginForm state whenever a field changes
        const {value, name} = event.target
        setLoginForm(prevNote => ({
                ...prevNote, [name]: value
            })
        );
        methods.trigger(name);
    }

    return (
        <div className={"min-w-full flex-grow"}>
        <FormProvider {...methods}>
        <form noValidate onSubmit={e => e.preventDefault()}
              className="px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center" >
            <div className="flex justify-center"><Logo size={48} ></Logo></div>
            <p className="flex mb-4 justify-center">Admin</p>

            <Input value={loginForm.email} {...email_validation({handleChange})}/>
            <Input value={loginForm.password} {...pw_validation({handleChange})}/>

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
            </div>
        </form>
        </FormProvider>
        </div>
    );
};

export default AdminLogInPage;