import React, { useState } from 'react';

const QuantityControl: React.FC = () => {
    const [quantity, setQuantity] = useState(0);

    const increment = () => {
        setQuantity(prev => prev + 1);
    };

    const decrement = () => {
        setQuantity(prev => (prev > 0 ? prev - 1 : 0)); // Prevent negative values
    };

    return (
        <div className="flex items-center space-x-4">
            <p>Quantity:</p>
            <button
                onClick={decrement}
                className="px-4 py-2 text-camel"
            >
                -
            </button>
            <span>{quantity}</span>
            <button
                onClick={increment}
                className="px-4 py-2 text-camel"
            >
                +
            </button>
        </div>
    );
};

export default QuantityControl;