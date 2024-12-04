import React from "react";
import DashSummary from "./DashSummary.tsx";
import {useSPAContext} from "../../components/Admin/AdminSPAContext.tsx";
import Inventory from "./Inventory.tsx";
import Orders from "./Orders.tsx";
import Users from "./Users.tsx";
import Sales from "./Sales.tsx";


const Dashboard: React.FC = () => {
    const {currentPage} = useSPAContext();
    function getPage(){
        if(currentPage === "dashboard"){
            return <DashSummary/>;
        }if(currentPage === "inventory"){
            return <Inventory/>;
        }if(currentPage === "orders"){
            return <Orders/>;
        }if(currentPage === "users"){
            return <Users/>;
        }if(currentPage === "sales"){
            return <Sales/>;
        }
    }
    return (
        <div className="flex min-w-full flex-grow gap-4">
            {/* Main section */}
            {/*<div className="flex-grow w-full">*/}
            {/*    <div className={"flex-grow px-8"}>*/}

            {getPage()} {/*get the page to render*/}

        </div>
    );
};

export default Dashboard;