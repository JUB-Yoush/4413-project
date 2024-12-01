import React, {useState} from 'react';
import AccountDetails from "../components/AccountDetails.tsx";
import AccountSidebar from "../components/AccountSidebar.tsx";
import axios, {defaults} from "axios";

interface Prop{
    tokenStr: string|null;
    removeToken : ()=>void;
    setToken: (userToken: string) => void;
}
const AccountPage: React.FC<Prop> = (prop) => {
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
        // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios({
            method: "get",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/user",
            // headers:{
            //     // Authorization: `Bearer ${prop.tokenStr}`,
            //     // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZG9tYWluLmNvbSJ9.Qh7AJsBuMGLLqy3_nX8ophZST0hHt3VPMkPuvpD3nSM`,
            //     // 'content-type': 'application/json',
            //     // Accept: '*/*',
            // },
            // added the below to see if it makes the call work but naurp
            // data: {
            //     message: "hello"
            // }
        }).then((response) =>{
            const resp = response.data;
            console.log("frist "+resp.fname);
            resp.access_token && prop.setToken(resp.access_token); //
            setAcctData(({
                firstname: resp.fname,
                lastname: resp.lname,
                email: resp.email,
                password: resp.password,
                creditcard: resp.creditcard,
                expiry: resp.expiry,
                streetaddress: resp.streetaddress,
                city: resp.city,
                province: resp.province,
                postal: resp.postal
            }))
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }
    getData();
    return (
        <div className={"flex mb-10"}>
            <AccountSidebar removeToken={prop.removeToken} ></AccountSidebar>
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