import React from 'react';
import AccountSidebar from "../components/AccountSidebar.tsx";
import Order from "../components/Order.tsx";

interface Prop{
    tokenStr: string|null;
    removeToken : ()=>void;
    setToken: (userToken: string) => void;
}
const OrderHistory: React.FC<Prop> = (prop) => {
    const orders = [
        { k:1, id: "123456789", date: 'November 13, 2024', total:128, cc: "************1234"},
        { k:2, id: "234567891", date: 'November 1, 2024', total:32.00, cc: "************1234"},
        { k:3, id: "345678912", date: 'October 13, 2024', total:128.00, cc: "************1234"},
        { k:4, id: "456789123", date: 'September 13, 2024', total:32.00, cc: "************1234"},
    ];
    return (
        <div className={"flex mt-4"}>
            <AccountSidebar removeToken={prop.removeToken} ></AccountSidebar>
            <div className="flex-grow px-8 max-w-[900px]">
                {/*Header*/}
                <p className={"text-3xl mb-6"}>Order History</p>

                {/*Ordered items history*/}
                <div className="">
                    {orders.map((order) => (
                        <div className="pb-8" key={order.k}>
                            <Order
                                id={order.id}
                                date={order.date}
                                total={order.total}
                                cc={order.cc}
                            />
                        </div>
                    ))}
                </div>





                {/*<div className="">*/}
                {/*{products.map((product) => (*/}
                {/*    <div className="pb-8" key={product.id}>*/}
                {/*        <OrderedItem*/}
                {/*            name={product.name}*/}
                {/*            cost={product.cost}*/}
                {/*            image={product.image}*/}
                {/*            qty={product.qty}*/}
                {/*            total={product.qty*product.cost}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*))}*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default OrderHistory;