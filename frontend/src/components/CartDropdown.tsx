import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import CartItemDisplay from './CartDropdownItem';
import { useCartContext } from '../cart/CartContext';

const CartDropdown: React.FC = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { cartItems, cartTotal, refreshCart } = useCartContext(); // Access cart data and methods from context


    // Toggle dropdown visibility
    const toggleDropdown = async () => {
        if (!isDropdownOpen) {
            await refreshCart(); // Refresh cart data when the dropdown is opened
        }
        setDropdownOpen(!isDropdownOpen);
    };
    const closeDropdown = () => setDropdownOpen(false);


    // Add event listener to detect outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node) // Click is outside the dropdown
            ) {
                closeDropdown();
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);


    return (
        <div className="relative" ref={dropdownRef}>
            {/* Cart Icon */}
            <CartIcon
                onClick={toggleDropdown}
                className={`transition-transform ${isDropdownOpen ? 'scale-110' : ''}`}
            />
            

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full -right-0.5 mt-2 bg-cream text-black border border-camel shadow-lg w-[350px] z-50">
                    <ul className="flex flex-col">
                        {cartItems.length === 0 ? (
                            // Empty cart dropdown
                            <>
                                <li className="px-3 py-1 border-b border-camel">
                                    Your cart is empty :(
                                </li>
                                <li 
                                    className="px-3 py-1 hover:text-white hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/" className="block w-full h-full">Continue Shopping</Link>
                                </li>
                            </>
                        ) : (
                            // Cart items dropdown
                            <>
                                {cartItems.map((item) => (
                                   <li key={item.product_id}>
                                        <CartItemDisplay item={item} closeDropdown={closeDropdown} />
                                    </li>
                                ))}
                                <li 
                                    className="px-5 pr-8 py-2 hover:text-white border-camel hover:font-medium hover:bg-camel flex justify-between items-center"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/cart" className="flex justify-between items-center w-full">
                                        <div className="font-bold">Cart Total: &nbsp;$ {cartTotal.toFixed(2)}</div>
                                        <div>Go to Cart &nbsp;&nbsp; → </div>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default CartDropdown;


