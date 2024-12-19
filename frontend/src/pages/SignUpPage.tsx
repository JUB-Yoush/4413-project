import React, {useState} from 'react';
import Logo from "../components/Logo.tsx";
import Button from "../components/Button.tsx";
import axios from "axios";
import Input from "../components/Input.tsx";
import {
    email_validation, new_pw_validation,
} from "../components/InputValidations.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {fname_validation, lname_validation} from "../components/InputValidations.tsx";

const SignUpPage: React.FC = () => {

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
    const methods = useForm();
    const signUp = methods.handleSubmit(() => {
        // handle sending info to flask once the form is submitted
        axios({
            method: "post",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/signup", //flask route that handles signup auth
            data: {
                email: signUpForm.email.trim(),
                password: signUpForm.password.trim(),
                fname: signUpForm.fname.trim(),
                lname: signUpForm.lname.trim(),
                card: signUpForm.card.trim(),
                street: signUpForm.street.trim(),
                city: signUpForm.city.trim(),
                province: signUpForm.province.trim(),
                postal: signUpForm.postal.trim()
            }
        }).then(async () => {
            console.log("sign up run" + signUpForm.email +". Now log in.");
            window.location.href = "/login"; //redirect them to merch page
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
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the signUpForm state whenever a field changes
        const {value, name} = event.target
        setSignUpForm(prevNote => ({
            ...prevNote, [name]: value})
        );
        methods.trigger(name);
    }

    return (
        <div className={"min-w-full flex justify-center"}>
        <FormProvider {...methods}>
        <form noValidate onSubmit={e => e.preventDefault()}
            className="rounded px-8 pt-6 pb-8 mb-4 max-w-[430px] h-auto grid items-center justify-center">
            <div className="flex mb-4 justify-center"><Logo size={48} ></Logo></div>
            <Input value={signUpForm.fname} {...fname_validation({handleChange})}/>
            <Input value={signUpForm.lname} {...lname_validation({handleChange})}/>
            <Input value={signUpForm.email} {...email_validation({handleChange})}/>
            <Input value={signUpForm.password} {...new_pw_validation({handleChange})}/>
            <div className="mb-4 w-full grid justify-center items-center">
                <Button type={"submit"} onClick={signUp}>Sign Up</Button>
            </div>

            <hr className={"border-camel mt-10 mb-10"}/>
            <div className="grid grid-cols-1 gap-4 place-items-center">
                <p>Already have an account? <a href={"/login"} className={"font-normal underline text-camel hover:font-extrabold"}>
                    Log In</a></p>
            </div>
        </form>
        </FormProvider>
        </div>
    );
};

export default SignUpPage;