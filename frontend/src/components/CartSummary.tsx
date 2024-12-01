import React from 'react';
import { Cart } from '../types';

interface CartSummaryProps {
    cart: Cart; 
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
    const { items: cartItems} = cart;

    return (
        <div className="mx-9 pb-2">

            <div>
                <div className="flex mt-1 mb-1">
                    <div className="flex basis-[60%]">Product</div>
                    <div className="flex basis-[20%] justify-center">Quantity</div>
                    <div className="flex basis-[20%] justify-end">Price</div>
                </div>
            </div>

       
            {/* Cart Items */}
            <div className="overflow-y-auto h-[400px] scrollbar-hidden">
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.product_id} className="mt-3">
                                <div className="flex">
                                    <div className="flex basis-[30%] pr-5">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-[100px] h-[100px]"  
                                        />
                                    </div>

                                    <div className="flex basis-[30%] pr-5" >
                                        <div>
                                            <p className="pb-2">{item.name}</p>
                                        </div>

                                    </div>

                                    <div className="flex basis-[20%] justify-center">
                                        <p className="pb-4">{item.quantity}</p>
                                    </div>

                                    <div className="flex basis-[20%] justify-end">
                                        <p>${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
            </div>

        
        </div>
    )
}

export default CartSummary;
