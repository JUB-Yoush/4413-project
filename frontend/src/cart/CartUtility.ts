
export interface CartItem {
    product_id: string;
    name: string;
    price: number;
    total_price: number;
    quantity: number;
    image_url: string;
}


export function addToCart(item: CartItem): void {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart
    const existingItem = cart.find(cartItem => cartItem.product_id === item.product_id);

    if (existingItem) {
        existingItem.quantity += item.quantity; // Update quantity if item exists
        existingItem.total_price = existingItem.quantity * existingItem.price; // Update total price
    } else {
        item.total_price = item.quantity * item.price;
        cart.push(item); // Add new item
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
    console.log('Item added to cart:', cart);
}


export function updateCart(item: CartItem): void {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.product_id === item.product_id);

    if (existingItemIndex !== -1) {
        if (item.quantity > 0) {
            // Update the quantity and total_price of the existing item
            cart[existingItemIndex].quantity = item.quantity;
            cart[existingItemIndex].total_price = item.quantity * cart[existingItemIndex].price;
        } else {
            // Remove the item if the quantity is 0
            cart.splice(existingItemIndex, 1);
        }
    } else {
        console.warn(`Item with product_id ${item.product_id} not found in the cart.`);
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
    console.log('Cart updated:', cart);
}

export function getCart(): CartItem[] {
    return JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart or return empty array
}

export function getTotal(): number {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.total_price, 0);
    return total;
}

export function getCartCount(): number {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    return total;
}
