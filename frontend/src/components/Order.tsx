import React from 'react';
import OrderedItem from "../components/OrderedItem.tsx";

interface Prop{
    date: string;
    id: string;
    total: number;
    cc: string;
}
const OrderHistory: React.FC<Prop> = (prop) => {
    const products = [
        { id: 1, name: 'Product 1', cost: 25, image: 'butterfly.jpg', qty:1},
        { id: 2, name: 'Product 2', cost: 35, image: 'butterfly.jpg', qty:2},
        { id: 3, name: 'Product 3', cost: 45, image: 'butterfly.jpg', qty:3},
    ];

    function round(value:number, decimal:number) {
        return value.toFixed(decimal);
    }

    let orderTotal = 0;
    for (const prod of products){
        orderTotal += prod.cost*prod.qty;
    }

    return (
        <div className="flex-grow max-w-[900px]">
            {/*Header*/}
            <div className={"flex flex-row max-w-2xl gap-9 mb-4 text-right"}>
                <p className={"font-extrabold"}>{prop.date}</p>
                <a href={""} className={"text-camel hover:font-extrabold flex-grow"}>Track Shipment</a>
                <a href={""} className={"text-camel hover:font-extrabold"}>Print Receipt</a>
            </div>

            <div className={"flex flex-row max-w-2xl gap-4 mb-6 text-right"}>
                <div className={"flex flex-row gap-2"}>
                    <p className={"text-camel"}>Order</p>
                    <p className={""}>{prop.id}</p>
                </div>
                <p className={"text-camel"}>|</p>
                <div className={"flex flex-row gap-2 px-4 text-center"}>
                    <p className={"text-camel"}>Total</p>
                    <p className={""}>{"$"+round(orderTotal,2)}</p>
                </div>
                <p className={"text-camel"}>|</p>
                <div className={"flex flex-row flex-grow gap-2 pl-4 text-right"}>
                    <p className={"text-camel flex-grow"}>Payment Method</p>
                    <p className={""}>{prop.cc}</p>
                </div>
            </div>

            {/*Ordered items history*/}
            <div className="">
                {products.map((product) => (
                    <div className="pb-8" key={product.id}>
                        <OrderedItem
                            name={product.name}
                            cost={round(product.cost,2)}
                            image={product.image}
                            qty={product.qty}
                            total={round(product.cost*product.qty,2)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;