import React from 'react';
import Button from "../../components/Button.tsx";

interface AccountInfo{
    firstname: string,
    lastname: string,
    email: string,
    password: string,
}
const AccountDetails: React.FC<AccountInfo> = (account: AccountInfo) => {
    const {firstname = "First Name", lastname= "Last Name",
        email = "Email Address", password = "*************"
    } = account;

    const labelDivStyle = "mb-4 w-full truncate";
    return (
        <div className="grid items-center min-w-full">
            {/*px-8 pt-6 pb-8 mb-4 h-auto w-full */}
            {/*Account Section*/}
            <p className={"text-3xl mb-6"}>Account</p>
            <div className={"grid grid-cols-2 gap-4"}>
                <div className={labelDivStyle}>
                    <label htmlFor={"firstname"} >First Name</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{firstname}</p>
                </div>
                <div className={labelDivStyle}>
                    <label htmlFor={"lastname"}>Last Name</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{lastname}</p>
                </div>
                <div className={labelDivStyle}>
                    <label htmlFor={"email"}>Email Address</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{email}</p>
                </div>
                <div className={labelDivStyle}>
                    <label htmlFor={"password"}>Password</label>
                    <p className={"text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel"}>{password}</p>
                </div>
                <div className={labelDivStyle}>
                    <Button >Edit Password</Button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;