import React from 'react';
import AccountSidebar from "../components/AccountSidebar.tsx";

const OrderHistory: React.FC = () => {
    return (
        <div className={"grid grid-cols-2 gap-0"}>
            <AccountSidebar ></AccountSidebar>
        </div>
    );
};

export default OrderHistory;