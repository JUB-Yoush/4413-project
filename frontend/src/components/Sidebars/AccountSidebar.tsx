import React from 'react';
import {useTokenContext} from "../TokenContext.tsx";

const AccountSidebar: React.FC = () => {

    const {removeToken} = useTokenContext();
    function logOut() {
        removeToken();
        alert("You have been signed out");
    }
    return (
        <aside className="text-camel w-[200px] h-auto pl-8 pr-8 border-r border-camel" aria-label="Sidebar">
            <a href={"/account-settings"}><p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Account</p></a>
            <a href={"/order-history"}><p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Order History</p></a>
            <a href={""} onClick={logOut}>
                <p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Log Out</p>
            </a>

        </aside>
    );
};

export default AccountSidebar;