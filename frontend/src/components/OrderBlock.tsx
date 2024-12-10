import React from 'react';
import OrderedItem from "../components/OrderedItem.tsx";
import {CartItem} from "../types.ts";

interface Prop{
    date: string;
    id: string;
    purchases: CartItem[];
}
const OrderBlock: React.FC<Prop> = (prop) => {
    const products = prop.purchases;

    function round(value:number, decimal:number) {
        return value.toFixed(decimal);
    }

    let orderTotal = 0;
    for (const prod of products){
        orderTotal += prod.total_price*prod.quantity;
    }

    return (
        <div className="flex-grow max-w-[900px] min-h-full">
            {/*Header*/}
            <div className={"flex flex-row max-w-2xl gap-9 mb-4 text-right"}>
                <p className={"font-extrabold"}>{prop.date}</p>
                {/*<a href={""} className={"text-camel hover:font-extrabold flex-grow"}>Track Shipment</a>*/}
                {/*<a href={""} className={"text-camel hover:font-extrabold"}>Print Receipt</a>*/}
            </div>

            <div className={"flex flex-row gap-4 mb-6 text-right"}>
                <div className={"flex flex-row gap-2"}>
                    <p className={"text-camel"}>Order</p>
                    <p className={""}>{prop.id}</p>
                </div>
                <div className={"flex flex-row grow gap-2 pl-4 justify-end"}>
                    <p className={"text-camel"}>Total</p>
                    <p className={""}>{"$"+round(orderTotal,2)}</p>
                </div>
                {/*<p className={"text-camel"}>|</p>*/}
            </div>

            {/*Ordered items history*/}
            <div className="">
                {products.map((product) => (
                    <div className="pb-8" key={product.product_id}>
                        <OrderedItem
                            name={product.name}
                            cost={round(product.total_price,2)}
                            image={product.image_url}
                            qty={product.quantity}
                            total={round(product.total_price*product.quantity,2)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderBlock;