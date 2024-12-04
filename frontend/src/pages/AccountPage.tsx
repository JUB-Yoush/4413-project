import React, {useEffect, useState} from 'react';
import AccountDetails from "../components/AccountDetails.tsx";
import AccountSidebar from "../components/AccountSidebar.tsx";
import axios from "axios";
import {useTokenContext} from "../components/TokenContext.tsx";

const AccountPage: React.FC = () => {
    const { token } = useTokenContext(); // Access setToken from TokenContext
    const [accountData, setAcctData] =
        useState({
            firstname: "First Name",
            lastname: "Last Name",
            email: "Email Address",
            password: "************",
            creditcard: "**** **** **** 1234",
            expiry: "11/24",
            streetaddress: "123 Four Street",
            city: "Toronto",
            province: "Ontario",
            postal: "N1M 2O4"
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
                creditcard: "************",  //do not display credit card
                expiry: resp.user.expiry || defaultText,
                streetaddress: resp.user.street || defaultText,
                city: resp.user.city || defaultText,
                province: resp.user.province || defaultText,
                postal: resp.user.postal_code || defaultText
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
            <AccountSidebar></AccountSidebar>
            <div className={"flex-grow px-8 max-w-[900px]"}>
                <AccountDetails firstname ={accountData.firstname} lastname= {accountData.lastname}
                                email = {accountData.email} password = {accountData.password}
                                creditcard = {accountData.creditcard} expiry = {accountData.expiry}
                                streetaddress = {accountData.streetaddress} city = {accountData.city}
                                province = {accountData.province} postal = {accountData.postal}>
                </AccountDetails>
            </div>

        </div>
    );
};

export default AccountPage;