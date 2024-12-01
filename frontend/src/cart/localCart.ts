import {Cart, CartItem} from '../types';

export const getCart = (): Cart => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '{"cart_total": 0, "items": []}');
    return {
        cart_total: storedCart.cart_total || 0,
        items: storedCart.items || [],
    };
};

// Helper to set the cart in localStorage
const saveCart = (cart: Cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Add an item to the cart
export const addToCart = (product: any, quantity: number) => {
    const cart = getCart();
    const existingItem = cart.items.find((item: CartItem) => item.product_id === product.id);

    if (existingItem) {
        // Update existing item
        existingItem.quantity += quantity;
        existingItem.total_price = existingItem.quantity * existingItem.price;
    } else {
        // Add new item
        cart.items.push({
            product_id: product.id,
            name: product.name,
            price: product.price,
            total_price: product.price * quantity,
            quantity,
            image_url: product.image_url,
        });
    }
    // Update cart total
    cart.cart_total = cart.items.reduce((sum, item) => sum + item.total_price, 0);
    // Save updated cart
    saveCart(cart);
};

// Update an item's quantity in the cart
export const updateCart = (productId: string, quantity: number) => {
    const cart = getCart();
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
export const removeFromCart = (productId: string) => {
    const cart = getCart();
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