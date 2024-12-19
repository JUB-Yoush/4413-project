import React from 'react';

interface QuantityControlProps {
    quantity: number;
    setQuantity: (value: number) => void;
    hideLabel?: boolean;
    disabled?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, setQuantity, hideLabel, disabled }) => {
    const increment = () => {
        if (!disabled) setQuantity(quantity + 1); // Only increment if not disabled
    };

    const decrement = () => {
        if (quantity > 1) setQuantity(quantity - 1); // Always decrement if quantity > 1
    };

    return (
        <div className="flex items-center space-x-4">
            {!hideLabel && <p>Quantity:</p>}
            {/* Decrement Button - Never Disabled */}
            <button
                onClick={decrement}
                className="px-4 py-2 text-camel font-bold"
            >
                -
            </button>
            <span>{quantity}</span>
            {/* Increment Button - Can Be Disabled */}
            <button
                onClick={increment}
                disabled={disabled}
                className={`px-4 py-2 font-bold ${
                    disabled ? 'text-red-500 cursor-not-allowed opacity-50' : 'text-camel'
                }`}
            >
                +
            </button>
        </div>
    );
};

export default QuantityControl;


