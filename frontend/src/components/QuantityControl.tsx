import React from 'react';

interface QuantityControlProps {
    quantity: number;
    setQuantity: (value: number) => void;
    hideLabel?: boolean; 
}
const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, setQuantity, hideLabel }) => {
    const increment = () => setQuantity(quantity + 1);
    const decrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    return (
        <div className="flex items-center space-x-4">
            {!hideLabel && <p>Quantity:</p>}
            <button onClick={decrement} className="px-4 py-2 text-camel font-bold">-</button>
            <span>{quantity}</span>
            <button onClick={increment} className="px-4 py-2 text-camel font-bold">+</button>
        </div>
    );
};

export default QuantityControl;