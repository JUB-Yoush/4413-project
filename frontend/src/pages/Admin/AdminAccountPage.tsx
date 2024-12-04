import React, {useEffect, useState} from 'react';
import AdminAccountDetails from "../../components/Admin/AdminAccountDetails.tsx";
import axios from "axios";
import {useTokenContext} from "../../components/TokenContext.tsx";

const AccountPage: React.FC = () => {
    const { token } = useTokenContext(); // Access setToken from TokenContext
    const [accountData, setAcctData] =
        useState({
            firstname: "First Name",
            lastname: "Last Name",
            email: "Email Address",
            password: "************",
    });
    function getData(){
        const defaultText = "Not yet set";
        axios({
            method: "get",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/user/",
            headers:{
                Authorization: 'Bearer '+ token,
            }
        }).then((response) =>{
            const resp = response.data;
            console.log("frist "+resp.user.fname);
            setAcctData(({
                firstname: resp.user.fname || defaultText,
                lastname: resp.user.lname || defaultText,
                email: resp.user.email || defaultText,
                password: "************", //do not display password
            }))
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }
    useEffect(getData, []); //only get user data on mount
    return (
        <div className={"flex mb-10"}>
            <div className={"flex-grow px-8 max-w-[900px]"}>
                <AdminAccountDetails firstname ={accountData.firstname} lastname= {accountData.lastname}
                                email = {accountData.email} password = {accountData.password}>
                </AdminAccountDetails>
            </div>

        </div>
    );
};

export default AccountPage;