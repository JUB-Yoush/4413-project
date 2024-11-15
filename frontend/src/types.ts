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