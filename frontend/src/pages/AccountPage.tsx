import React, {useEffect, useState} from 'react';
import {useForm, FormProvider} from "react-hook-form";
import AccountSidebar from "../components/Sidebars/AccountSidebar.tsx";
import axios from "axios";
import {User} from "../types.ts";
import Button from "../components/Button.tsx";
import {useTokenContext} from "../components/TokenContext.tsx";
import Input from "../components/Input.tsx";
import {
    email_validation,
    new_pw_validation, postal_code_validation,
    province_validation, pw_validation, street_validation, text_only_validation
} from "../components/InputValidations.tsx";

const AccountPage: React.FC = () => {
    interface AccountInfo{
        fname: string,
        lname: string,
        email: string,
        password: string,
        confirm_password: string,
        old_password: string,

        cc_info: string,
        expiry: string,
        cvv: string,

        street: string,
        city: string,
        province: string,
        postal_code: string,
        [key: string]: string
    }
    const defaultUser: User = {
        "id": "",
        "fname": "",
        "lname": "",
        "email": "",
        "password": "",
        "street": "",
        "city": "",
        "postal_code": "",
        "province": "",
        "cc_info": "",
        "decryption_key": "",
        "cart_items": [],
        "cart_total": 0.0,
    }

    const {setToken} = useTokenContext();
    const [isEditOther, setIsEditOther] = useState(false);
    const [isEditCC, setIsEditCC] = useState(false);
    const [isEditPW, setIsEditPW] = useState(false);

    // user to be passed to dialog box for editing
    const [user, setUser] = useState<User>(defaultUser);

    const [accountData, setAcctData] =
        useState<AccountInfo>({
            fname: "",
            lname: "",
            email: "",
            password: "",
            confirm_password: "",
            old_password: "",
            cc_info: "",
            expiry: "",
            cvv: "",
            street: "",
            city: "",
            province: "",
            postal_code: ""
    });
    function getData(){
        axios({
            method: "get",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/user/",
        }).then((response) =>{
            const resp = response.data;
            setUser(resp);

            console.log("User Updated "+resp.user.fname);
            setAcctData(({
                fname: resp.user.fname,
                lname: resp.user.lname,
                email: resp.user.email,
                password: "", //do not display password
                confirm_password: "",
                old_password: "",
                cc_info: "",  //do not display credit card
                expiry: "",
                cvv: "",
                street: resp.user.street,
                city: resp.user.city,
                province: resp.user.province,
                postal_code: resp.user.postal_code
            }))
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }
    const methods = useForm();

    const editUserOther = methods.handleSubmit(() => {
        // Prepare the data payload
        const payload = {
            email: accountData.email.trim(),
            street: accountData.street.trim(),
            city: accountData.city.trim(),
            province: accountData.province.trim(),
            postal_code: accountData.postal_code.trim(),
        };
    
        // Make the PATCH request
        axios({
            method: "patch",
            baseURL: "http://127.0.0.1:5000",
            url: `/user/`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required
            },
            data: payload,
        })
            .then((response) => {
                // Handle success
                console.log("Response:", response);
                setToken(response.data.token); // Update token if necessary
                setIsEditOther(false); // Exit edit mode
                alert("Account Edited Successfully!");
            })
            .catch((error) => {
                // Handle errors
                if (error.response) {
                    console.error("Error Response:", error.response);
                    alert(`Failed to edit account: ${error.response.data.error || "Unknown error"}`);
                } else if (error.request) {
                    console.error("No Response Received:", error.request);
                    alert("Failed to edit account: No response from the server.");
                } else {
                    console.error("Error:", error.message);
                    alert(`Failed to edit account: ${error.message}`);
                }
            });
    });
    
    const [oldPWMatches, setOldPWMatches] = useState(false);
    const editUserPW = methods.handleSubmit(() => {
        axios({
            method: "post",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/login", //flask route that handles login auth
            data: {
                email: accountData.email.trim(),
                password: accountData.old_password.trim(),
            }
        }).then(async () => {
            setOldPWMatches(true);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
        const newPWMatches = accountData.confirm_password === accountData.password;
        if(oldPWMatches && newPWMatches){
            /*
            * old password entered was fine and the confirmed password was fine
            * then
            * execute patch
            * */
            console.log(`old ${accountData.password}
            new ${accountData.confirm_password}
            `)
            axios({
                method: "patch",
                baseURL: 'http://127.0.0.1:5000',
                url: `/user/pw`,
                data: {
                    password: accountData.password.trim(),
                }
            }).then(async () => {
                setAcctData(prevNote => ({
                        ...prevNote, password: "", old_password: "", confirm_password: ""
                    })
                )
                setIsEditPW(false);
                alert("Account Edited!");
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            })
        }else{
            /*
            * show error message to enter correct creds
            * */
            alert("ERROR: Please ensure all credentials are correct.")
            console.log(`old matches ${oldPWMatches}, new matches ${newPWMatches}`)
        }

    });
    const editUserCC = methods.handleSubmit(() => {
        // card data send in "xxxxxxxxxxxxxxxx-xxxx-xxx" (16 nums, exp(mmyy),cvv), one string
        axios({
            method: "patch",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: `/user/cc`,
            data: {
                cc_info: `${accountData.cc_info}-${accountData.expiry}-${accountData.cvv}`,
            }
        }).then(async () => {
            setIsEditCC(false);
            alert("Account Edited!");
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                // Handle bad request with a popup
                alert(error.response.data.error);
              } else {
                console.error(error);
                alert("An unexpected error occurred. Please try again.");
              }
        })
    });

    function showDD() {setIsEditOther(true)}

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the accountData state whenever a field changes
        const {value, name} = event.target
        setAcctData(prevNote => ({
                ...prevNote, [name]: value
            })
        );
        methods.trigger(name);
    }
    const labelDivStyle = "mb-4 w-full";
    const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
    const pStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-transparent border-t-camel";
    const pStyle_desc = "text-sm text-camel bg-transparent w-full mt-1 py-1 border border-transparent border-t-camel";

    useEffect(getData, []); //only get user data on mount

    return (
        <div className={"flex mb-10"}>
            <AccountSidebar/>
            <div className={"flex-grow px-8 max-w-[900px]"}>
                {/*<AccountDetails user={user} accountData={accountData} setAcctData={setAcctData}*/}
                {/*                showForm={showForm} setShowForm={setShowForm}*/}
                {/*                isEditOther={isEditOther} setIsEditOther={setIsEditOther}/>*/}
                <div className="grid items-center min-w-9/12 ">
                    {isEditOther ?
                        <div className={"z-10 flex absolute t-0 l-0 p-10 w-9/12 h-full items-center justify-center bg-beige"}>
                            <dialog open className={"bg-beige border border-camel px-10 py-4 w-9/12 h-5/6 overflow-y-auto"}>
                            <div className={"grid grid-cols-1 mb-6"}>
                                <Button onClick={()=>{setIsEditOther(false)}}
                                        buttonVariant={"warn"}>
                                    Close Without Saving</Button>
                            </div>

                            <FormProvider {...methods}>
                            <form noValidate onSubmit={e => e.preventDefault()}>
                                <div className="grid items-center min-w-full">

                                    {/*Account Section*/}
                                    <p className={"text-3xl mb-6"}>Editing Your Details</p>
                                    <div className={"grid grid-cols-2 gap-4"}>
                                        <Input value={accountData.email} {...email_validation({handleChange})}/>
                                    </div>

                                    {/*Shipping Address Section*/}
                                    <p className={"text-3xl mb-6 mt-4"}>Shipping Address</p>
                                    <div className={"grid grid-cols-2 gap-4 w-auto"}>
                                        <Input value={accountData.street} {...street_validation({handleChange })}/>
                                        <Input id={"city"} name={"city"} value={accountData.city} type={"text"}
                                               htmlFor={"city"} label={"City"}
                                               {...text_only_validation({handleChange })}
                                        />
                                        <Input value={accountData.province} {...province_validation({handleChange})}/>
                                        <Input value={accountData.postal_code} {...postal_code_validation({handleChange})}/>
                                    </div>
                                    <Button onClick={editUserOther}>Save Edit</Button>
                                </div>
                            </form>
                            </FormProvider>
                            </dialog>
                        </div>
                        :
                        <></>
                    }

                    {isEditPW ?
                        <div className={"z-10 flex absolute t-0 l-0 p-10 w-9/12 h-full items-center justify-center bg-beige"}>
                            <dialog open className={"bg-beige border border-camel px-10 py-4 w-9/12 h-5/6 overflow-y-auto"}>
                            <div className={"grid grid-cols-1 mb-6"}>
                                <Button onClick={()=>{setIsEditPW(false)}}
                                        buttonVariant={"warn"}>
                                    Close Without Saving</Button>
                            </div>

                            <FormProvider {...methods}>
                            <form noValidate onSubmit={e => e.preventDefault()}>
                                <div className="grid items-center min-w-full">

                                    {/*Account Section*/}
                                    <p className={"text-3xl mb-6"}>Editing Your Password</p>
                                    <div className={"grid grid-cols-2 gap-4"}>
                                        {/*id: 'password',*/}
                                        {/*name: 'password',*/}
                                        {/*type: 'password',*/}
                                        {/*htmlFor: "password",*/}
                                        {/*label: 'Password',*/}
                                        <Input value={accountData.old_password} {...pw_validation({handleChange})}
                                               id={"old_password"} name={"old_password"}
                                               label={"Old Password"} htmlFor={"old_password"}
                                        />
                                        <Input value={accountData.password} {...new_pw_validation({handleChange})}
                                               label={"New Password"}
                                        />

                                        <Input value={accountData.confirm_password} {...new_pw_validation({handleChange})}
                                               id={"confirm_password"} name={"confirm_password"}
                                               label={"Confirm Your Password"} htmlFor={"confirm_password"}
                                        />

                                        {/*<div className={labelDivStyle}>*/}
                                        {/*    <label htmlFor={"old_password"}>Old Password</label>*/}
                                        {/*    <input*/}
                                        {/*        id={"old_password"} name={"old_password"} value={accountData.old_password} type={"password"}*/}
                                        {/*        onChange={handleChange} placeholder={""} autoComplete={"off"}*/}
                                        {/*        className={fieldStyle}/>*/}
                                        {/*</div>*/}
                                        {/*<div className={labelDivStyle}>*/}
                                        {/*    <label htmlFor={"password"}>New Password</label>*/}
                                        {/*    <input*/}
                                        {/*        id={"password"} name={"password"} value={accountData.password} type={"password"}*/}
                                        {/*        onChange={handleChange} placeholder={""} autoComplete={"on"}*/}
                                        {/*        className={fieldStyle}/>*/}
                                        {/*</div>*/}
                                        {/*<div className={labelDivStyle}>*/}
                                        {/*    <label htmlFor={"confirm_password"}>Confirm Your Password</label>*/}
                                        {/*    <input*/}
                                        {/*        id={"confirm_password"} name={"confirm_password"}*/}
                                        {/*        value={accountData.confirm_password} type={"password"}*/}
                                        {/*        onChange={handleChange} placeholder={""} autoComplete={"off"}*/}
                                        {/*        className={fieldStyle}/>*/}
                                        {/*</div>*/}
                                    </div>
                                    <Button onClick={editUserPW}>Save Edit</Button>
                                </div>
                            </form>
                            </FormProvider>
                            </dialog>
                        </div>
                        :
                        <></>
                    }

                    {isEditCC ?
                        <div className={"z-10 flex absolute t-0 l-0 p-10 w-9/12 h-full items-center justify-center bg-beige"}>
                            <dialog open className={"bg-beige border border-camel px-10 py-4 w-9/12 h-5/6 overflow-y-auto"}>

                                <div className={"grid grid-cols-1 mb-6"}>
                                    <Button onClick={()=>{setIsEditCC(false)}}
                                            buttonVariant={"warn"}>
                                        Close Without Saving</Button>
                                </div>

                                <form>
                                    <div className="grid items-center min-w-full">
                                        <p className={"text-3xl mb-6"}>Editing Your Creditcard</p>

                                        {/*Payment Information Section*/}
                                        <div className={"grid grid-cols-2 gap-4 w-auto"}>
                                            <div className={labelDivStyle}>
                                                <label htmlFor={"cc_info"}>Credit Card Number</label>
                                                <p className={pStyle_desc}>16 digits, no space</p>
                                                <input
                                                    id={"cc_info"} name={"cc_info"} value={accountData.cc_info.trim()} type={"text"}
                                                    onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                    className={fieldStyle}/>
                                            </div>
                                            <div className={labelDivStyle}>
                                                <label htmlFor={"expiry"}>Expiry Date (MMYY)</label>
                                                <p className={pStyle_desc}>2 digits for the month and 2 for the year</p>
                                                <input
                                                    id={"expiry"} name={"expiry"} value={accountData.expiry.trim()} type={"text"}
                                                    onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                    className={fieldStyle}/>
                                            </div>
                                            <div className={labelDivStyle}>
                                                <label htmlFor={"cvv"}>CVV (NNN)</label>
                                                <p className={pStyle_desc}>The 3 digits behind your creditcard</p>
                                                <input
                                                    id={"cvv"} name={"cvv"} value={accountData.cvv.trim()} type={"text"}
                                                    onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                    className={fieldStyle}/>
                                            </div>
                                        </div>
                                        <Button onClick={editUserCC}>Save Edit</Button>
                                    </div>
                                </form>
                            </dialog>
                        </div>
                        :
                        <></>
                    }

                    {/*Account Section*/}
                    <p className={"text-3xl mb-6"}>Account</p>
                    <div className={"grid grid-cols-2 gap-4"}>
                        <div className={labelDivStyle}>
                            <label htmlFor={"fname"} >First Name</label>
                            <p className={pStyle}>{accountData.fname}</p>
                        </div>
                        <div className={labelDivStyle}>
                            <label htmlFor={"lname"}>Last Name</label>
                            <p className={pStyle}>{accountData.lname}</p>
                        </div>
                        <div className={labelDivStyle}>
                            <label htmlFor={"email"}>Email Address</label>
                            <p className={pStyle}>{accountData.email}</p>
                        </div>
                        <div className={labelDivStyle}>
                            <label htmlFor={"password"}>Password</label>
                            <p className={pStyle}>************</p>
                        </div>
                        <div className={labelDivStyle + " flex gap-2"}>
                            <Button onClick={showDD}>Edit Email Address</Button>
                            <Button onClick={()=>{setIsEditPW(true)}}>Edit Password</Button>
                        </div>
                    </div>

                    {/*Payment Information Section*/}
                    <p className={"text-3xl mb-6 mt-4"}>Payment Information</p>
                    <div className={"grid grid-cols-2 gap-4 w-auto"}>
                        {user.cc_info!=="" ?
                            <>
                                <div className={labelDivStyle}>
                                    <label htmlFor={"cc_info"}>Credit Card</label>
                                    <p className={pStyle}>************</p>
                                </div>
                            </>
                            :<></>}
                        <div className={labelDivStyle}>
                            <Button onClick={()=>{setIsEditCC(true)}}>{user.cc_info!==""? "Update Card":"Add A Card"}</Button>
                        </div>
                    </div>

                    {/*Shipping Address Section*/}
                    <p className={"text-3xl mb-6 mt-4"}>Shipping Address</p>
                    <div className={"grid grid-cols-2 gap-4 w-auto"}>
                        <div className={labelDivStyle}>
                            <label htmlFor={"street"}>Street Address</label>
                            <p className={pStyle}>{accountData.street}</p>
                        </div>
                        <div className={labelDivStyle}>
                            <label htmlFor={"city"}>City</label>
                            <p className={pStyle}>{accountData.city}</p>
                        </div>
                        <div className={labelDivStyle}>
                            <label htmlFor={"province"}>Province</label>
                            <p className={pStyle}>{accountData.province}</p>
                        </div>
                        <div className={labelDivStyle}>
                            <label htmlFor={"postal_code"}>Postal Code</label>
                            <p className={pStyle}>{accountData.postal_code}</p>
                        </div>
                        <div className={labelDivStyle}>
                            <Button onClick={showDD}>Edit Address</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AccountPage;