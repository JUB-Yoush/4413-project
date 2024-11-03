import React from 'react';

const AccountSidebar: React.FC = () => {
    return (
        <aside className="text-camel w-[200px] h-auto p-8 border-r-2 border-camel" aria-label="Sidebar">
            <a href={"/account-settings"}> <p>Account</p></a>
            <a href={"/order-history"}><p>Order History</p></a>
            <a href={"/logout"}><p>Log Out</p></a>
        </aside>
    );
};

export default AccountSidebar;