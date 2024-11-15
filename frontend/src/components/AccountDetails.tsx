import React from 'react';
import Button from "../components/Button.tsx";

interface AccountInfo{
    firstname: string,
    lastname: string,
    email: string,
    password: string,

    creditcard: string,
    expiry: string,

    streetaddress: string,
    city: string,
    province: string,
    postal: string,
}
const AccountDetails: React.FC<AccountInfo> = (account: AccountInfo) => {
    const {firstname = "First Name", lastname= "Last Name", email = "Email Address", password = "*************",
            creditcard = "**** **** **** 1234", expiry = "11/24",
            streetaddress = "123 Four Street", city = "Toronto", province = "Ontario", postal = "N1M 2O4",
    } = account;
    return (
        <div className="grid items-center">
            {/*px-8 pt-6 pb-8 mb-4 h-auto w-full */}
            {/*Account Section*/}
            <p className={"text-3xl mb-6"}>Account</p>
            <div className={"grid grid-cols-2 gap-4 w-auto"}>
                <div className="mb-4 w-full">
                    <label htmlFor={"firstname"} >First Name</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{firstname}</p>
                </div>
                <div className="mb-4 w-full">
                    <label htmlFor={"lastname"}>Last Name</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{lastname}</p>
                </div>
                <div className="mb-4 w-full">
                    <label htmlFor={"email"}>Email Address</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{email}</p>
                </div>
                <div className="mb-4 w-full">
                    <label htmlFor={"password"}>Password</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{password}</p>
                </div>
                <div className="mb-4 w-full">
                    <Button >Edit Password</Button>
                </div>
            </div>
            {/*Payment Information Section*/}
            <p className={"text-3xl mb-6 mt-4"}>Payment Information</p>
            <div className={"grid grid-cols-2 gap-4 w-auto"}>
                <div className="mb-4 w-full">
                    <label htmlFor={"creditcard"}>Saved Credit Card</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{creditcard}</p>
                </div>
                <div className="mb-4 w-full">
                    <label htmlFor={"password"}>Expiry Date</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{expiry}</p>
                </div>
                <div className="mb-4 w-full">
                    <Button >Add Another Card</Button>
                </div>
            </div>

            {/*Shipping Address Section*/}
            <p className={"text-3xl mb-6 mt-4"}>Shipping Address</p>
            <div className={"grid grid-cols-2 gap-4 w-auto"}>
                <div className="mb-4 w-full">
                    <label htmlFor={"streetaddress"}>Street Address</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{streetaddress}</p>
                </div>
                <div className="mb-4 w-full">
                    <label htmlFor={"city"}>City</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{city}</p>
                </div>
                <div className="mb-4 w-full">
                    <label htmlFor={"province"}>Province</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{province}</p>
                </div>
                <div className="mb-4 w-full">
                    <label htmlFor={"postal"}>Postal Code</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{postal}</p>
                </div>
                <div className="mb-4 w-full">
                    <Button >Update Address</Button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;