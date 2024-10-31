
import React from 'react';  // Ensure React is imported if using JSX
import cart from '../assets/cart.svg';  
import person from '../assets/person.svg'

// Define a type for the navigation links
interface NavLink {
    name: string;
    href: string;
  }
  
  // Sample navigation links
  const navLinks: NavLink[] = [
    { name: 'Merch', href: '/' },
    { name: 'Sale', href: '/shop' },
    { name: 'Gift Cards', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];
  
  const Navbar: React.FC = () => {
    return (
      <nav className="bg-tea-800 p-10 text-sm"> 

        <ul className="flex flex-row text-center items-center">


          {/* DJ WAMP Logo */}
          <li className="basis-[20%] flex justify-start text-2xl font-['Lexend_Zetta']">DJ WAMP</li>
          {/* Page Links */}
          <li className="basis-[54%] pr-[90px]">
            <ul className="flex flex-row text-center w-full">
              <li className="flex-grow border-[1px] border-r-[0px] border-camel py-[5px]">Merch</li>
              <li className="flex-grow border-[1px] border-r-[0px] border-camel py-[5px]">Sale</li>
              <li className="flex-grow border-[1px] border-r-[0px] border-camel py-[5px]">Gift Cards</li>
              <li className="flex-grow border-[1px] border-camel py-[5px]">Contact</li>
            </ul>
          </li>

          {/* Shopping Cart + Profile */}
          <li className="basis-[6%] flex justify-end items-center">
            <img src={cart} alt="Shopping Cart" />
            <img src={person} alt="Profile" className="pl-5" />
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