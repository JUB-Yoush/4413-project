import React from 'react';
import AccountDetails from "../components/AccountDetails.tsx";
import AccountSidebar from "../components/AccountSidebar.tsx";

const AccountPage: React.FC = () => {
    return (
        <div className={"grid grid-cols-2 gap-0"}>
            <AccountSidebar ></AccountSidebar>
            <AccountDetails firstname ={"First Name"} lastname= {"Last Name"} email = {"Email Address"} password = {"*************"}
                            creditcard = {"**** **** **** 1234"} expiry = {"11/24"}
                            streetaddress = {"123 Four Street"} city = {"Toronto"} province = {"Ontario"} postal = {"N1M 2O4"}>
            </AccountDetails>
        </div>
    );
};

export default AccountPage;