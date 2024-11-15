import React from 'react';
import AccountSidebar from "../components/AccountSidebar.tsx";
import OrderedItem from "../components/OrderedItem.tsx";

interface Prop{
    tokenStr: string|null;
    removeToken : ()=>void;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}
const OrderHistory: React.FC<Prop> = (prop) => {
    const products = [
        { id: 1, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
        { id: 2, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
        { id: 3, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
        { id: 4, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
        { id: 5, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
        { id: 6, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
        { id: 7, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
        { id: 8, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
        { id: 9, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
        // Add more products here
    ];
    return (
        <div className={"flex mt-4"}>
            <AccountSidebar removeToken={prop.removeToken} ></AccountSidebar>
            <div className="flex-grow px-8 max-w-[900px]">
                {/*Header*/}
                <p className={"text-3xl mb-6"}>Order History</p>

                {/*Ordered items history*/}
                <div className="">
                {products.map((product) => (
                    <div className="p-0 pb-8" key={product.id}>
                        <OrderedItem
                            name={product.name}
                            cost={product.cost}
                            image={product.image}
                        />
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;