
import Suggest from '../components/Suggest.tsx';
import { CartItem, updateCart, getCart, getTotal } from '../cart/CartUtility'; 
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button.tsx';
import { useNavigate } from 'react-router-dom';
import QuantityControl from '../components/QuantityControl.tsx';


const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const navigate = useNavigate();

    const handleReturnToShopping = () => {
        navigate('/'); // Replace with your desired route
    };

    const handleCheckout = () => {
        navigate('/checkout'); // Replace with your desired route
    };

    // Retrieve cart items when the component mounts
    useEffect(() => {
        const items = getCart();
        setCartItems(items);
        setTotalPrice(getTotal());
    }, []);

    // Update the quantity for a specific cart item
    const handleQuantityChange = (productId: string, newQuantity: number) => {
        const updatedCart = cartItems.map((item) =>
            item.product_id === productId
                ? { ...item, quantity: newQuantity, total_price: item.price * newQuantity }
                : item
        );
        setCartItems(updatedCart);
        setTotalPrice(updatedCart.reduce((sum, item) => sum + item.total_price, 0));

        updateCart({
            product_id: productId, 
            quantity: newQuantity,
            name: '',
            price: 0,
            total_price: 0,
            image_url: ''
        });
    };

    

    return (
        <div className="flex flex-row mt pl-4 mx-0 h-[calc(100vh-200px)]">
            {/* Product */}
            <div className="basis-[45%] flex flex-row">
                {/* Product Info */}
                <div className="pl-8 border-r border-r-camel pr-[70px]">
                    {/* Product desc + checkout */}
                    <div>
                        <div className="text-xl">Your Cart</div>
                    </div>
                    <div>
                        <div className="flex mt-1 mb-1">
                            <div className="flex basis-[73%]">Product</div>
                            <div className="flex basis-[22%]">Quantity</div>
                            <div className="flex basis-[10%] justify-end">Total</div>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="overflow-y-auto h-[calc(100vh-450px)] scrollbar-hidden">
                        {cartItems.length > 0 ? (
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.product_id} className="">
                                        <div className="flex mt-3">

                                            <div className="flex basis-[25%] pr-5">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className=""  
                                                />
                                            </div>

                                            <div className="flex basis-[40%] pr-5" >
                                                <div>
                                                    <p className="pb-4">{item.name}</p>
                                                    <p>${item.price}</p>
                                                </div>

                                            </div>

                                            <div className="flex basis-[25%] items-start -mt-2">
                                                
                                                <QuantityControl
                                                    quantity={item.quantity}
                                                    setQuantity={(newQuantity) =>
                                                        handleQuantityChange(item.product_id, newQuantity)
                                                    }
                                                    hideLabel={true}
                                                />
                                            </div>

                                            <div className="flex basis-[10%] justify-end">
                                                <p>${item.total_price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                    </div>

                    {/* Cost info */}
                    <div className="mt-5 border-t border-t-camel">
                        <div className="flex justify-between pt-3">
                            <p className="">Subtotal</p>
                            <p className="">${totalPrice.toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between pt-3">
                            <p className="">Estimated Shipping</p>
                            <p className="">$10.00</p>
                        </div>

                        <div className="flex justify-between pt-3">
                            <p className="">Estimated Taxes</p>
                            <p className="">${(totalPrice*0.15).toFixed(2)}</p>
                        </div>

                        <p className="text-camel pt-3">Actual taxes and shipping calculated at checkout</p>

                        <div className="flex justify-end">
                            <p className="pr-3"><Button onClick={handleReturnToShopping} >Return to Shopping</Button></p>
                            <p className=""><Button onClick={handleCheckout}>Checkout</Button></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* You may also like */}
            <div className="basis-[55%]">
                {/* <Suggest currentCategory={items.category} currentProduct={product.id} /> */}
            </div>
        </div>
    );
};

export default CartPage;



