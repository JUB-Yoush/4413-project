import React from 'react';
import { useCartContext } from '../../cart/CartContext'; // Adjust the import path

interface CartIconProps {
    onClick: () => void;
    className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick, className }) => {
    const { cartCount } = useCartContext(); // Access cart count from context

    return (
        <div onClick={onClick} className={`relative cursor-pointer ${className}`}>
            {/* Cart Icon SVG */}
            <svg
                width="36"
                height="36"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="Property 1=Default">
                    <rect
                        id="Rectangle 6"
                        x="7.25"
                        y="26.25"
                        width="3.5"
                        height="3.5"
                        fill="#D4A373"
                        stroke="#D4A373"
                        strokeWidth="1.0"
                    />
                    <rect
                        id="Rectangle 7"
                        x="24.25"
                        y="26.25"
                        width="3.5"
                        height="3.5"
                        fill="#D4A373"
                        stroke="#D4A373"
                        strokeWidth="1.0"
                    />
                    <line
                        id="Line 9"
                        y1="0.75"
                        x2="4.5"
                        y2="0.75"
                        stroke="#D4A373"
                        strokeWidth="1.0"
                    />
                    <line
                        id="Line 10"
                        x1="4.25"
                        y1="1"
                        x2="4.25"
                        y2="23"
                        stroke="#D4A373"
                        strokeWidth="1.0"
                    />
                    <line
                        id="Line 13"
                        x1="30.25"
                        y1="6"
                        x2="30.25"
                        y2="23.3827"
                        stroke="#D4A373"
                        strokeWidth="1.0"
                    />
                    <line
                        id="Line 11"
                        x1="30.5"
                        y1="6.25"
                        x2="4"
                        y2="6.24999"
                        stroke="#D4A373"
                        strokeWidth="1.0"
                    />
                    <line
                        id="Line 12"
                        x1="30.5"
                        y1="23.25"
                        x2="4"
                        y2="23.25"
                        stroke="#D4A373"
                        strokeWidth="1.0"
                    />
                </g>
            </svg>

            {/* Cart Count Display */}
            {cartCount > 0 && (
                <span
                    className="absolute bottom-[9px] left-[50%] transform -translate-x-[50%] text-xs text-camel font-thin"
                >
                    {cartCount}
                </span>
            )}
        </div>
    );
};

export default CartIcon;

