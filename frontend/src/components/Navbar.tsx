import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import CartDropdown from './CartDropdown';
import React from "react";

// Define a type for the navigation links
interface NavLink {
    name: string;
    href: string;
}
  
// Sample navigation links
const navLinks: NavLink[] = [
  { name: 'Merch', href: '/' },
  { name: 'Tour Dates', href: '/tour' },
  { name: 'Contact', href: '/contact' }
];

const cartItems = [
  { label: 'item1', link: '/item1' },
  { label: 'item2', link: '/item2' },
  { label: 'item3', link: '/item3' },
  { label: 'item4', link: '/item4' },
  { label: 'item5', link: '/item5' },
  { label: 'item6', link: '/item6' },
  // Add more items as needed
];

interface Prop{
  tokenStr: string|null;
  removeToken : ()=>void;
}

const Navbar: React.FC<Prop> = (prop) => {
  return (
    <nav className="bg-tea-800 p-10 text-sm"> 
      <ul className="flex flex-row text-center items-center">
        
        {/* DJ WAMP Logo */}
        <li className="basis-[24%] flex justify-start text-2xl font-['Lexend_Zetta']">DJ WAMP</li>

        {/* Page Links */}
        <li className="basis-[50%] pr-[90px]">
          <ul className="flex flex-row text-center w-full">
              {navLinks.map((link, index) => (
                <li
                    key={link.name}
                    className={`hover:text-white hover:font-medium hover:bg-camel flex-grow border-y border-l border-camel py-[5px] ${
                      index === navLinks.length - 1 ? 'border-r' : ''
                    }`}>
                      <Link to={link.href} className="flex items-center justify-center w-full h-full">
                        {link.name}
                      </Link>
                </li>
              ))}
            </ul>
        </li>

        {/* Shopping Cart */}
        <li className="basis-[3%] flex justify-end items-center">
          <CartDropdown items={cartItems} />
        </li>

        {/* Profile Dropdown */}
        <li className="basis-[3%] flex justify-end items-center">
          <ProfileDropdown tokenStr={prop.tokenStr} removeToken={prop.removeToken}/>
        </li>

        {/* Search Bar */}
        <li className="basis-[20%] flex items-center space-x-2 pl-[30px]">
          <span>Search</span>
          <input
            type="text"
            className="border border-camel bg-transparent p-1 flex-grow w-full"
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
