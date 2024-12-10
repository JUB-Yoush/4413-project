import React, {useEffect, useState} from 'react';
import AccountSidebar from "../components/AccountSidebar.tsx";
import OrderBlock from "../components/OrderBlock.tsx";
import {Order} from "../types.ts";
import axios from "axios";


const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(
        []);
    function getOrders(){
        axios({
            method: "get",
            baseURL: "http://localhost:5000",
            url: `/sale/orders`,
        }).then((response: axios.AxiosResponse) => {
            setOrders(response.data.sales);
            console.log(`user email ${orders[0].user.email}`);
            console.log(`user email ${response.data.sales}`);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    }
    // keep proxies in sync
    useEffect(()=>{getOrders()},[]);

    return (
        <div className={"flex mt-4 mb-10 min-h-full"}>
            <AccountSidebar></AccountSidebar>
            <div className="flex-grow px-8 max-w-[900px]">
                {/*Header*/}
                <p className={"text-3xl mb-6"}>Order History</p>

                {/*Ordered items history*/}
                <div className="min-h-full">
                    {orders.map((order) => (
                        <div className="pb-8" key={order.id}>
                            <OrderBlock
                                id={order.id}
                                date={order.date.slice(0,16)}
                                purchases={order.purchases}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;