import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import person from '../assets/person.svg';

const ProfileDropdown = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate login state

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    return (
        <div className="relative">
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
                        {isLoggedIn ? (
                            // Logged-in dropdown
                            <>
                                <li className="hover:text-white border-b border-camel hover:font-medium hover:bg-camel">
                                    <Link to="/account-settings" className="block w-full h-full px-3 py-1">Account Settings</Link>
                                </li>
                                <li className="hover:text-white border-b border-camel hover:font-medium hover:bg-camel">
                                    <Link to="/order-history" className="block w-full h-full px-3 py-1">Order History</Link>
                                </li>
                                <li className="hover:text-white hover:font-medium hover:bg-camel">
                                    <Link to="/sign-out" className="block w-full h-full px-3 py-1" onClick={() => setIsLoggedIn(false)}>Sign Out</Link>
                                </li>
                            </>
                        ) : (
                            // Logged-out dropdown
                            <>
                                <li className="hover:text-white border-b border-camel hover:font-medium hover:bg-camel">
                                    <Link to="/create-account" className="block w-full h-full px-3 py-1">Create an Account</Link>
                                </li>
                                <li className="hover:text-white hover:font-medium hover:bg-camel">
                                    <Link to="/sign-in" className="block w-full h-full px-3 py-1" onClick={() => setIsLoggedIn(true)}>Sign In</Link>
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


