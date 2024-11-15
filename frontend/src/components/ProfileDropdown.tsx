import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import person from '../assets/person.svg';

interface Prop{
    tokenStr: string|null;
    removeToken : ()=>void;
}
const ProfileDropdown: React.FC<Prop> = (prop) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const checkLoggedIn = !(!prop.tokenStr && prop.tokenStr !== "");

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setDropdownOpen(false); // Function to close dropdown

    function logOut() {
        prop.removeToken();
        alert("You have been signed out");
    }

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

