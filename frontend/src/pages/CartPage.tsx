// import Suggest from '../components/Catalog/Suggest.tsx';
import SuggestBest from '../components/Checkout/BestSeller.tsx';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../cart/CartContext'; // Updated CartContext import
import Button from '../components/Button.tsx';
import QuantityControl from '../components/Cart/QuantityControl.tsx';



const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, handleUpdateCart, refreshCart, handleRemoveFromCart } = useCartContext();
    const [products, setProducts] = useState<Record<string, any>>({}); // Store products by product_id

    const handleReturnToShopping = () => navigate('/'); // Navigate to merch page
    const handleCheckout = () => navigate('/checkout'); // Navigate to checkout page

    // Fetch product data for all items in the cart
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const fetchedProducts = await Promise.all(
                    cartItems.map(async (item) => {
                        const response = await fetch(
                            `http://127.0.0.1:5000/catalog/products/${encodeURIComponent(item.product_id)}`
                        );
                        const data = await response.json();
                        return { product_id: item.product_id, stock: data.stock, ...data };
                    })
                );
                const productMap = fetchedProducts.reduce((acc, product) => {
                    acc[product.product_id] = product; // Map product_id to product data
                    return acc;
                }, {});
                setProducts(productMap);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [cartItems]);

    // Handle quantity changes
    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        try {
            const cartItem = cartItems.find((item) => item.product_id === productId);
            if (!cartItem) {
                console.error('Cart item not found for product_id:', productId);
                return;
            }

            await handleUpdateCart(productId, newQuantity);
            await refreshCart(); // Refresh cart data
        } catch (error) {
            console.error('Failed to update cart:', error);
        }
    };

    // Handle product removal
    const handleRemove = async (productId: string) => {
        try {
            await handleRemoveFromCart(productId);
            await refreshCart(); // Refresh cart data
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    };

    return (
        <div className="flex flex-row mt pl-4 mx-0 h-[calc(100vh-200px)]">
            {/* Product */}
            <div className="basis-[57%] flex flex-row pr-[70px] border-r border-r-camel">
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
                                {cartItems.map((item) => {
                                    const product = products[item.product_id]; // Get product data by product_id
                                    return (
                                        <li key={item.product_id} className="mt-3">
                                            <div className="flex">
                                                <div className="flex basis-[25%] pr-5">
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className=""
                                                    />
                                                </div>

                                                <div className="flex basis-[35%] pr-5">
                                                    <div>
                                                        <p className="pb-4">{item.name}</p>
                                                        <p>${item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex basis-[30%] items-center -mt-2 flex-col">
                                                    <QuantityControl
                                                        quantity={item.quantity}
                                                        setQuantity={(newQuantity) => {
                                                            if (product && newQuantity <= product.quantity) {
                                                                handleQuantityChange(item.product_id, newQuantity);
                                                            } else {
                                                                console.warn('Quantity exceeds available stock');
                                                            }
                                                        }}
                                                        hideLabel={true}
                                                        disabled={product && item.quantity >= product.quantity}
                                                    />
                                                    <Button
                                                        onClick={() => handleRemove(item.product_id)}
                                                        className="mt-0 px-5 py-0.8"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>

                                                <div className="flex basis-[10%] justify-end">
                                                    <p>${item.total_price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <p>Your cart is empty.</p>
                                <Button onClick={handleReturnToShopping} className="mt-5">
                                    Continue Shopping
                                </Button>
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
                            <p className="">${(cartTotal * 0.15).toFixed(2)}</p>
                        </div>

                        <p className="text-camel pt-3">Actual taxes and shipping calculated at checkout</p>

                        <div className="flex justify-end">
                            <p className="pr-3">
                                <Button onClick={handleReturnToShopping}>Return to Shopping</Button>
                            </p>
                            <p className="">
                                <Button onClick={handleCheckout}>Checkout</Button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* You may also like */}
            <div className="basis-[43%] pr-20 mr-10">
                <SuggestBest columns={2} />
            </div>
        </div>
    );
};

export default CartPage;


