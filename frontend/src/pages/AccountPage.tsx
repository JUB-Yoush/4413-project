import React, {useEffect, useState} from 'react';
import AccountSidebar from "../components/AccountSidebar.tsx";
import axios from "axios";
import {User} from "../types.ts";
import Button from "../components/Button.tsx";
import {useTokenContext} from "../components/TokenContext.tsx";

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

            console.log("frist "+resp.user.fname);
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
    function editUserOther(event: React.FormEvent) {
        // handle sending info to flask once the form is submitted
        axios({
            method: "patch",
            baseURL: 'http://127.0.0.1:5000',
            url: `/user/`,
            data: {
                email: accountData.email,
                street: accountData.street,
                city: accountData.city,
                province: accountData.province,
                postal_code: accountData.postal_code
            }
        }).then((response) => {
            setToken(response.data.token);
            setIsEditOther(false);
            alert("Account Edited!");
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
        event.preventDefault();
    }
    const [oldPWMatches, setOldPWMatches] = useState(false);
    function editUserPW(event: React.FormEvent) {

        axios({
            method: "post",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/login", //flask route that handles login auth
            data: {
                email: accountData.email,
                password: accountData.old_password,
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
                    password: accountData.password,
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
            event.preventDefault();
        }else{
            /*
            * show error message to enter correct creds
            * */
            alert("ERROR: Please ensure all credentials are correct.")
        }

    }
    function editUserCC(event: React.FormEvent) {
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
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
        event.preventDefault();
    }

    function showDD() {setIsEditOther(true)}

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the userForm state whenever a field changes
        const {value, name} = event.target
        setAcctData(prevNote => ({
                ...prevNote, [name]: value
            })
        )
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

                            <form method={"post"}>
                                <div className="grid items-center min-w-full">

                                    {/*Account Section*/}
                                    <p className={"text-3xl mb-6"}>Editing Your Details</p>
                                    <div className={"grid grid-cols-2 gap-4"}>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"email"}>Email Address</label>
                                            <input
                                                id={"email"} name={"email"} value={accountData.email} type={"email"}
                                                onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                className={fieldStyle}/>
                                        </div>
                                    </div>

                                    {/*Shipping Address Section*/}
                                    <p className={"text-3xl mb-6 mt-4"}>Shipping Address</p>
                                    <div className={"grid grid-cols-2 gap-4 w-auto"}>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"street"}>Street Address</label>
                                            <input
                                                id={"street"} name={"street"} value={accountData.street} type={"text"}
                                                onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                className={fieldStyle}/>
                                        </div>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"city"}>City</label>
                                            <input
                                                id={"city"} name={"city"} value={accountData.city} type={"text"}
                                                onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                className={fieldStyle}/>
                                        </div>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"province"}>Province</label>
                                            <input
                                                id={"province"} name={"province"} value={accountData.province} type={"text"}
                                                onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                className={fieldStyle}/>
                                        </div>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"postal_code"}>Postal Code</label>
                                            <input
                                                id={"postal_code"} name={"postal_code"} value={accountData.postal_code} type={"text"}
                                                onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                className={fieldStyle}/>
                                        </div>
                                    </div>
                                    <Button onClick={editUserOther}>Save Edit</Button>
                                </div>
                            </form>
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

                            <form method={"post"}>
                                <div className="grid items-center min-w-full">

                                    {/*Account Section*/}
                                    <p className={"text-3xl mb-6"}>Editing Your Password</p>
                                    <div className={"grid grid-cols-2 gap-4"}>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"old_password"}>Old Password</label>
                                            <input
                                                id={"old_password"} name={"old_password"} value={accountData.old_password} type={"password"}
                                                onChange={handleChange} placeholder={""} autoComplete={"off"}
                                                className={fieldStyle}/>
                                        </div>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"password"}>New Password</label>
                                            <input
                                                id={"password"} name={"password"} value={accountData.password} type={"password"}
                                                onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                className={fieldStyle}/>
                                        </div>
                                        <div className={labelDivStyle}>
                                            <label htmlFor={"confirm_password"}>Confirm Your Password</label>
                                            <input
                                                id={"confirm_password"} name={"confirm_password"}
                                                value={accountData.confirm_password} type={"password"}
                                                onChange={handleChange} placeholder={""} autoComplete={"off"}
                                                className={fieldStyle}/>
                                        </div>
                                    </div>
                                    <Button onClick={editUserPW}>Save Edit</Button>
                                </div>
                            </form>
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

                                <form method={"post"}>
                                    <div className="grid items-center min-w-full">
                                        <p className={"text-3xl mb-6"}>Editing Your Creditcard</p>

                                        {/*Payment Information Section*/}
                                        <div className={"grid grid-cols-2 gap-4 w-auto"}>
                                            <div className={labelDivStyle}>
                                                <label htmlFor={"cc_info"}>Credit Card Number</label>
                                                <p className={pStyle_desc}>16 digits, no space</p>
                                                <input
                                                    id={"cc_info"} name={"cc_info"} value={accountData.cc_info} type={"text"}
                                                    onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                    className={fieldStyle}/>
                                            </div>
                                            <div className={labelDivStyle}>
                                                <label htmlFor={"expiry"}>Expiry Date (MMYY)</label>
                                                <p className={pStyle_desc}>2 digits for the month and 2 for the year</p>
                                                <input
                                                    id={"expiry"} name={"expiry"} value={accountData.expiry} type={"text"}
                                                    onChange={handleChange} placeholder={""} autoComplete={"on"}
                                                    className={fieldStyle}/>
                                            </div>
                                            <div className={labelDivStyle}>
                                                <label htmlFor={"cvv"}>CVV (NNN)</label>
                                                <p className={pStyle_desc}>The 3 digits behind your creditcard</p>
                                                <input
                                                    id={"cvv"} name={"cvv"} value={accountData.cvv} type={"text"}
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