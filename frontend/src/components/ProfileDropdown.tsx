import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import person from '../assets/person.svg';
import { useTokenContext } from './TokenContext.tsx'; // Adjust the path as needed

const ProfileDropdown: React.FC = () => {
    const {token, removeToken} =useTokenContext();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const checkLoggedIn = Boolean(token);

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setDropdownOpen(false); // Function to close dropdown
    const dropdownRef = useRef<HTMLDivElement>(null);

    function logOut() {
        removeToken(); //also redirects them to merch page
    }

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
            {/* Profile Icon */}
            <img
                src={person}
                alt="Profile"
                className={`cursor-pointer transition-transform ${
                    isDropdownOpen ? 'scale-110' : ''
                }`}
                onClick={toggleDropdown}
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-cream text-black border border-camel shadow-md w-40 z-50">
                    <ul className="flex flex-col">
                        {checkLoggedIn ? (
                            // Logged-in dropdown
                            <>
                                <li
                                    className="hover:text-white border-b border-camel hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/account-settings" className="block w-full h-full px-3 py-1">Account Settings</Link>
                                </li>
                                <li
                                    className="hover:text-white border-b border-camel hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/order-history" className="block w-full h-full px-3 py-1">Order History</Link>
                                </li>
                                <button
                                    className="block w-full h-full px-3 py-1 hover:text-white hover:font-medium hover:bg-camel"
                                    onClick={() => {
                                        logOut();
                                        closeDropdown();
                                    }}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            // Logged-out dropdown
                            <>
                                <li
                                    className="hover:text-white border-b border-camel hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/signup" className="block w-full h-full px-3 py-1">Create an Account</Link>
                                </li>
                                <li
                                    className="hover:text-white hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/login" className="block w-full h-full px-3 py-1" >Sign In</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;

