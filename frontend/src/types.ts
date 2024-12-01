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
