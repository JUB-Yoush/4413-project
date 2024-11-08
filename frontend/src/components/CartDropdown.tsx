import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cart from '../assets/cart.svg';

const CartDropdown = ({ items }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true); // Simulate login state

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const closeDropdown = () => setDropdownOpen(false); // Close dropdown function

    return (
        <div className="relative">
            {/* Profile Icon */}
            <img
                src={cart}
                alt="Profile"
                className={`cursor-pointer transition-transform ${
                    isDropdownOpen ? 'scale-110' : ''
                }`}
                onClick={toggleDropdown}
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full -right-0.5 mt-2 bg-cream text-black border border-camel shadow-md w-40 z-50">
                    <ul className="flex flex-col">
                        {isEmpty ? (
                            // Cart Empty dropdown
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
                            // Cart not empty dropdown
                            <>
                                {items.map((item, index) => (
                                    <li
                                        key={index}
                                        className="px-3 py-1 hover:text-white border-b border-camel hover:font-medium hover:bg-camel"
                                        onClick={closeDropdown} 
                                    >
                                        <Link to={item.link} className="block w-full h-full">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                                <li 
                                    className="px-3 py-1 hover:text-white border-camel hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/cart" className="block w-full h-full">Go to cart</Link>
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


