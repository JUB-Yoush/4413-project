import {Cart, CartItem} from '../types';
import axios from "axios";


// Helper to fetch valid product IDs from the backend
const fetchValidProductIds = async (): Promise<Set<string>> => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/catalog/products`);
        const validProductIds = response.data.products.map((product: any) => product.id);
        return new Set(validProductIds);
    } catch (error: any) {
        console.error("Failed to fetch valid product IDs:", error.message);
        return new Set();
    }
};

const saveCart = (cart: Cart) => {
    console.log("Saving cart to localStorage:", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCart = async (): Promise<Cart> => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || '{"cart_total": 0, "items": []}');
    console.log("Fetched cart from localStorage at start:", storedCart);

    const cart: Cart = {
        cart_total: storedCart.cart_total || 0,
        items: storedCart.items || [],
    };

    try {
        const validProductIds = await fetchValidProductIds();
        console.log("Valid product IDs:", validProductIds);

        // Filter items based on valid product IDs
        const filteredItems = cart.items.filter(item => validProductIds.has(item.product_id));

        if (filteredItems.length !== cart.items.length) {
            console.warn("Some items were invalid and removed during validation:", {
                invalidItems: cart.items.filter(item => !validProductIds.has(item.product_id)),
            });
        }

        const updatedCart = {
            cart_total: filteredItems.reduce((sum, item) => sum + item.total_price, 0),
            items: filteredItems,
        };

        // Save the validated cart back to localStorage only if it differs
        if (JSON.stringify(updatedCart) !== JSON.stringify(cart)) {
            saveCart(updatedCart);
            console.log("Validated and saved updated cart:", updatedCart);
        }

        return updatedCart;
    } catch (error: any) {
        console.error("Failed to validate cart:", error.message);
        return cart; // Return unfiltered cart if validation fails
    }
};



export const addToCart = async (product: any, quantity: number): Promise<void> => {
    const cart = await getCart(); // Fetch the validated cart
    console.log("Cart before adding product:", cart);

    const existingItem = cart.items.find((item: CartItem) => item.product_id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total_price = existingItem.quantity * existingItem.price;
    } else {
        cart.items.push({
            product_id: product.id,
            name: product.name,
            price: product.price,
            total_price: product.price * quantity,
            quantity,
            image_url: product.image_url,
        });
    }

    cart.cart_total = cart.items.reduce((sum, item) => sum + item.total_price, 0);
    console.log("Cart after adding product:", cart);

    saveCart(cart);
};


// Update an item's quantity in the cart
export const updateCart = async (productId: string, quantity: number): Promise<void> => {
    const cart = await getCart();
    const item = cart.items.find((item: CartItem) => item.product_id === productId);

    if (item) {
        // Update quantity even if it's 0
        item.quantity = quantity;
        item.total_price = item.price * quantity;
    }

    // Update cart total (including items with quantity 0)
    cart.cart_total = cart.items.reduce((sum, item) => sum + item.total_price, 0);

    // Save updated cart
    saveCart(cart);
};

// Remove an item from the cart
export const removeFromCart = async (productId: string): Promise<void> => {
    const cart = await getCart();
    cart.items = cart.items.filter((item: CartItem) => item.product_id !== productId);

    // Update cart total
    cart.cart_total = cart.items.reduce((sum, item) => sum + item.total_price, 0);

    // Save updated cart
    saveCart(cart);
};

// Clear the cart
export const clearCart = () => {
    saveCart({ cart_total: 0, items: [] });
};