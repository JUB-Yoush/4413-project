import Suggest from '../components/Suggest.tsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../cart/CartContext'; // Updated CartContext import
import Button from '../components/Button.tsx';
import QuantityControl from '../components/QuantityControl.tsx';


const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, handleUpdateCart, refreshCart, handleRemoveFromCart } = useCartContext();

    const handleReturnToShopping = () => {navigate('/');};  // go to merch page
    const handleCheckout = () => {navigate('/checkout');};  // go the checkout page


    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        try {
            const cartItem = cartItems.find((item) => item.product_id === productId);
            if (!cartItem) {
                console.error("Cart item not found for product_id:", productId);
                return;
            }

            await handleUpdateCart(productId, newQuantity);
            await refreshCart(); // Refresh cart data
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            const cartItem = cartItems.find((item) => item.product_id === productId);
            if (!cartItem) {
                console.error("Cart item not found for product_id:", productId);
                return;
            }
            await handleRemoveFromCart(productId);
            await refreshCart(); // Refresh cart data
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };


    return (
        <div className="flex flex-row mt pl-4 mx-0 h-[calc(100vh-200px)]">
            {/* Product */}
            <div className="basis-[60%] flex flex-row pr-[70px] border-r border-r-camel">
                {/* Product Info */}
                <div className="pl-8 w-full">
                    {/* Product desc + checkout */}
                    <div>
                        <div className="text-xl">Your Cart</div>
                    </div>
                    <div>
                        <div className="flex mt-1 mb-1">
                            <div className="flex basis-[60%]">Product</div>
                            <div className="flex basis-[30%] justify-center">Quantity</div>
                            <div className="flex basis-[10%] justify-end">Total</div>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="overflow-y-auto h-[calc(100vh-450px)] scrollbar-hidden">
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
                                                <QuantityControl
                                                    quantity={item.quantity}
                                                    setQuantity={(newQuantity) =>
                                                        handleQuantityChange(item.product_id, newQuantity)
                                                    }
                                                    hideLabel={true}
                                                />                          
                                                <Button onClick={() => handleRemove(item.product_id)}className="mt-0 px-5 py-0.8 ">Remove</Button>
                      
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
                            <p className="">Estimated Shipping</p>
                            <p className="">$10.00</p>
                        </div>

                        <div className="flex justify-between pt-3">
                            <p className="">Estimated Taxes</p>
                            <p className="">${(cartTotal*0.15).toFixed(2)}</p>
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
            <div className="basis-[40%] pr-20 mr-10">
                <Suggest currentCategory={"Apparel"} currentProduct={"67292a21c56a15390bcec035"} columns={2} />
            </div>
        </div>
    );
};

export default CartPage;



