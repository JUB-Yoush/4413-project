export interface User{
    id: string;
    fname: string,
    lname: string,
    email: string,
    password: string,
    cc_info: string,
    decryption_key: string,
    street: string,
    city: string,
    province: string,
    postal_code: string,
    cart_items: [],
    cart_total: number,

}
export interface Product {
    id: string;           // MongoDB ObjectId
    name: string;          // Name of the product
    category: string;      // Category (e.g., vinyl)
    brand: string;         // Brand associated with the product
    album: string;         // Album name
    price: number;         // Price of the product
    description: string;   // Description of the product
    image_url: string;     // URL for the product's image
    quantity: number;      // Stock quantity
}

export interface CartItem {
    product_id: string;
    name: string;
    price: number;
    total_price: number;
    quantity: number;
    image_url: string;
}

export interface Cart {
    cart_total: number;
    items: CartItem[];
}
export interface Order {
    id: string;           // MongoDB ObjectId
    approved: boolean;
    date: string;
    purchases: CartItem[];
    user: User;
}
export interface OrderProxy {
    id: string;
    approved: string;
    date: string;
    purchases: string;
    user: string;
    total_price: string;
    [key:string]: string;
}
