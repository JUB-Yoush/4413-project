import React, { useEffect, useState } from 'react';
import { CartItem, updateCart, getCart } from '../cart/CartUtility'; 
import QuantityControl from '../components/QuantityControl.tsx';
import { Link } from 'react-router-dom';
import Button from '../components/Button.tsx';

interface CartDropdownItemProps {
    item: CartItem;
    closeDropdown: () => void;
    onUpdate: () => void;
}

const CartDropdownItem: React.FC<CartDropdownItemProps> = ({ item, closeDropdown, onUpdate }) => {
    const [selectedQuantity, setSelectedQuantity] = useState<number>(item.quantity);
    const [product, setProduct] = useState<CartItem | null>(null);
    

    // Necessary fetch of the full product in order for it to be saved as a state and be sent when clicked on the product in the cart
    useEffect(() => {
        const fetchFullProduct = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/catalog/products?name=${encodeURIComponent(item.name)}`
                );
                const data = await response.json();
                setProduct(data.products[0]);
            } catch (error) {
                console.error('Error fetching full product:', error);
            }
        };

        fetchFullProduct();
    }, [item.name]);

    if (!product) {
        return <div>Loading...</div>; // Show a loading indicator until data is fetched
    }


    const handleUpdateCart = () => {
        console.log(`Adding ${selectedQuantity} of ${item.name} to the cart.`);
        const totalPrice = selectedQuantity * item.price;

        updateCart({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            total_price: totalPrice,
            quantity: selectedQuantity,
            image_url: item.image_url,
        });

        console.log('Cart Contents:', getCart());
        onUpdate();
    };

    // const location = useLocation();
    // console.log('Location State:', location.state); 
    return (
        <div className="flex px-3 py-3 border-b border-camel hover:bg-beige transition-colors duration-300">
            <div>
            <Link 
                to={`/catalog/products/${encodeURIComponent(item.name)}`}
                onClick={closeDropdown}
                state={product} // Pass the item as state
            >
                <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-[100px] h-[100px] mr-2"
                />
                </Link>
            </div>

            <div className="flex flex-1 flex-col">
                <Link 
                    to={`/catalog/products/${encodeURIComponent(item.name)}`}
                    onClick={closeDropdown}
                    state={product} // Pass the item as state
                >
                    <span className="font-bold">{item.name}</span>
                </Link>
                <div className="ml-3 flex flex-col text-sm">
                        <QuantityControl
                            quantity={selectedQuantity}
                            setQuantity={setSelectedQuantity}
                        />

                        <div className="mr-6 flex items-center justify-between flex-row">
                            <div>Price: ${item.price.toFixed(2)}</div>
                            <div>
                                <Button onClick={handleUpdateCart} className="mt-0 px-1 py-0.5 ">Update</Button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
   
    );
};

export default CartDropdownItem;