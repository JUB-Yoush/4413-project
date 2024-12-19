import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../cart/CartContext.tsx'; // Updated CartContext import
import Button from '../components/Button.tsx';
import { Link } from 'react-router-dom';
import Checkout from '../components/Checkout/Checkout.tsx';
import CheckoutGuest from '../components/Checkout/CheckoutGuest.tsx';
import { useTokenContext } from "../components/TokenContext";


const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal } = useCartContext();
    const {token} =useTokenContext();
    const isSignedIn = Boolean(token);

    const handleReturnToShopping = () => {navigate('/');};  // go to merch page


    return (
        <div>
        {/* Breadcrumb */}
        <div className="px-10 mx-5 flex flex-row items-center space-x-2 text-sm text-coffee">
            <Link to="/cart" className="text-sm text-coffee hover:underline">
                Cart
            </Link>
            &nbsp;&nbsp;﹥
            <p className="text-sm text-black">Checkout</p>
        </div>

        <div className="flex flex-row mt pl-4 mx-0 h-[calc(100vh-200px)]">

            {/* Product */}
            <div className="basis-[50%] flex flex-row pr-[70px] border-r border-r-camel">
            

                {/* Product Info */}
                <div className="pl-8 w-full bg-beige pr-10 ml-10 mt-5 pt-5">
                    {/* Product desc + checkout */}

                    <div>
                        <div className="text-xl">Order Summary</div>
                    </div>
                    <div>
                        <div className="flex mt-5 mb-1">
                            <div className="flex basis-[60%]">Product</div>
                            <div className="flex basis-[30%] justify-center">Quantity</div>
                            <div className="flex basis-[10%] justify-end">Total</div>
                        </div>
                    </div>



                    {/* Cart Items */}
                    <div className="overflow-y-auto h-[calc(100vh-500px)] scrollbar-hidden">
                        {cartItems.length > 0 ? (
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.product_id} className="mt-3">
                                        <div className="flex">
                                            <div className="flex basis-[25%] pr-5">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className=""  
                                                />
                                            </div>

                                            <div className="flex basis-[35%] pr-5" >
                                                <div>
                                                    <p className="pb-4">{item.name}</p>
                                                    <p>${item.price.toFixed(2)}</p>
                                                </div>

                                            </div>

                                            <div className="flex basis-[30%] items-center -mt-2 flex-col">
                                                {item.quantity}                      
                                            </div>

                                            <div className="flex basis-[10%] justify-end">
                                                <p>${item.total_price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <p>Your cart is empty.</p>
                                <Button onClick={handleReturnToShopping} className="mt-5">Continue Shopping</Button>
                            </div>
                        )}

                        

                    </div>

                    {/* Cost info */}
                    <div className="mt-5 border-t border-t-camel">
                        <div className="flex justify-between pt-3">
                            <p className="">Subtotal</p>
                            <p className="">${cartTotal.toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between pt-3">
                            <p className="">Shipping</p>
                            <p className="">$10.00</p>
                        </div>

                        <div className="flex justify-between pt-3">
                            <p className="">Taxes</p>
                            <p className="">${(cartTotal*0.15).toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between pt-3 font-bold">
                            <p className="">Total</p>
                            <p className="">${(cartTotal*1.13 + 10).toFixed(2)}</p>
                        </div>

                    </div>

                </div>
            </div>

            {/* You may also like */}
            <div className="basis-[50%] pt-10 pl-20 pr-20 mr-10">
                {isSignedIn ? <Checkout /> : <CheckoutGuest />}
            </div>

    
        </div>

        </div>


    );
};

export default CheckoutPage;



