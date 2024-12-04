import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartBackend, addToCartBackend, updateCartBackend, removeFromCartBackend, clearCartBackend} from './backendCart';
import { getCart, addToCart, updateCart, removeFromCart} from './localCart';
import { CartItem, Cart, Product } from '../types';
import usePromptUserChoice from '../components/PromptUserChoice';
import {useTokenContext} from "../components/TokenContext.tsx";

interface CartContextProps {
    cartItems: CartItem[];
    cartTotal: number;
    cartCount: number;
    handleAddToCart: (product: Product, quantity: number) => Promise<void>;
    handleUpdateCart: (productId: string, quantity: number) => Promise<void>;
    handleRemoveFromCart: (productId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
    handleCartMergeOnLogin: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [cartCount, setCartCount] = useState<number>(0);

    const promptUserChoice = usePromptUserChoice();
    const {userType} = useTokenContext();

    // Fetch cart data from backend or local storage
    const refreshCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token && userType==="user") {
                const response: Cart = await getCartBackend(token);
                const items = response.items || [];
                const total = response.cart_total || 0;
                const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

                setCartItems(items);
                setCartTotal(total);
                setCartCount(count);
            } else {
                const localCart: Cart = getCart();
                const items = localCart.items || [];
                const total = localCart.cart_total || 0;
                const count = localCart.items.reduce((sum, item) => sum + item.quantity, 0);

                setCartItems(items);
                setCartTotal(total);
                setCartCount(count);
            }
        } catch (error:any) {
            console.error('Failed to refresh cart:', error.message);
        }
    };

    // Add an item to the cart
    const handleAddToCart = async (product: Product, quantity: number) => {
        try {
            const token = localStorage.getItem('token');
            if (token && userType==="user") {
                await addToCartBackend(product.id, quantity, token);
                console.log("Adding " , quantity, " product_id", product.id, "to backend cart.");
            } else {
                addToCart(product, quantity);
                console.log("Adding " , quantity, " product_id", product.id, "to local cart.");
            }
            await refreshCart();
        } catch (error:any) {
            console.error('Failed to add item to cart:', error.message);
        }
    };

    // Update the quantity of an item
    const handleUpdateCart = async (productId: string, quantity: number) => {
        try {
            const token = localStorage.getItem('token');
            if (token && userType==="user") {
                await updateCartBackend(productId, quantity, token);
                console.log("Updating product_id:", productId, "to quantity:", quantity, "in backend cart");
            } else {
                updateCart(productId, quantity);
                console.log("Updating product_id:", productId, "to quantity:", quantity, "in local cart");
            }
            await refreshCart();
        } catch (error:any) {
            console.error('Failed to update cart item:', error.message);
        }
    };

    // Remove an item from the cart
    const handleRemoveFromCart = async (productId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (token && userType==="user") {
                await removeFromCartBackend(productId, token);
                console.log("Removing product_id", productId, "from backend cart.");
            } else {
                removeFromCart(productId);
                console.log("Removing product_id", productId, "from local cart.");
            }
            await refreshCart();
        } catch (error: any) {
            console.error('Failed to remove item from cart:', error.message);
        }
    };

    const handleCartMergeOnLogin = async () => {
        const localCart = getCart();
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Cannot merge carts without a valid token.');
            return;
        }
        const backendCart = await getCartBackend(token);

        // Case 1: Local cart only
        if (localCart.items.length > 0 && backendCart.items.length === 0) {
            for (const item of localCart.items) {
                await addToCartBackend(item.product_id, item.quantity, token);
            }
            localStorage.removeItem('cart'); // Clear local cart
            console.log("Local cart successfully transferred to backend cart! (local cart deleted)");
    
        // Case 2: Both carts exist
        } else if (localCart.items.length > 0 && backendCart.items.length > 0) {
            const userChoice = await promptUserChoice(localCart, backendCart);   //prompt user for choice

            // Replace backend cart with local cart
            if (userChoice === 'local') {
                await clearCartBackend(token);
                for (const item of localCart.items) {
                    await addToCartBackend(item.product_id, item.quantity, token);
                }
                localStorage.removeItem('cart');
                console.log("Local cart successfully overwritten backend cart! (local cart deleted)");

                // Use backend cart and discard local cart
            } else if (userChoice === 'backend') {
                localStorage.removeItem('cart');
                console.log("Backend cart successfully overwritten local cart! (local cart deleted)");

                //Combine both carts together
            } else if (userChoice === 'combine') {
                // Combine carts
                const mergedCartItems = mergeCarts(localCart.items, backendCart.items);
                await clearCartBackend(token);
                for (const item of mergedCartItems) {
                    await addToCartBackend(item.product_id, item.quantity, token);
                }
                localStorage.removeItem('cart');
                console.log("Backend cart successfully merged with local cart! (local cart deleted)");
            }
        } else {
            console.log("Local cart was empty, backend cart successfully loaded!");
        }
        
        await refreshCart(); // Refresh cart data in context
    }
    

    const mergeCarts = (localItems: CartItem[], backendItems: CartItem[]) => {
        const mergedItems = [...backendItems];
        for (const localItem of localItems) {
            const backendItem = mergedItems.find(item => item.product_id === localItem.product_id);
            if (backendItem) {
                backendItem.quantity += localItem.quantity; // Merge quantities
                backendItem.total_price += localItem.total_price; // Adjust total price
            } else {
                mergedItems.push(localItem); // Add new item from local cart
            }
        }
        return mergedItems;
    };



    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartTotal,
                cartCount,
                handleAddToCart,
                handleUpdateCart,
                handleRemoveFromCart,
                refreshCart,
                handleCartMergeOnLogin
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};