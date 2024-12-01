import axios from "axios";

export const getCartBackend = async (token: string) => {
    const response = await axios.get('http://127.0.0.1:5000/cart/', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addToCartBackend = async (product_id: string, quantity: number, token: string) => {
    await axios.post(
        'http://127.0.0.1:5000/cart/',
        { product_id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const updateCartBackend = async (product_id: string, quantity: number, token: string) => {
    await axios.patch(
        `http://127.0.0.1:5000/cart/${product_id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const removeFromCartBackend = async (productId: string, token: string) => {
    await axios.delete(`http://127.0.0.1:5000/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const clearCartBackend = async (token: string) => {
    await axios.delete('http://127.0.0.1:5000/cart/', {
        headers: { Authorization: `Bearer ${token}` },
    });
};


