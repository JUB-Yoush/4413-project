import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from '../Button.tsx';

interface OrderSuccessProps {
    onAcknowledge: () => void; // Callback when the user acknowledges the success message
}

const OrderDialog: React.FC<OrderSuccessProps> = ({ onAcknowledge }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-coffee bg-opacity-20 z-50 border border-camel">
            <div className="bg-cream w-[500px] p-6 shadow-lg border border-camel text-center">
                <h2 className="text-2xl font-semibold mb-4">Order Success!</h2>
                <p className="text-lg">Thank you for your purchase. Your order has been placed successfully!</p>
                <Button className="px-10"
                    onClick={onAcknowledge}
                >
                    OK
                </Button>
            </div>
        </div>
    );
};

export const useOrderDialog = (): (() => Promise<void>) => {
    const showOrderDialog = (): Promise<void> => {
        return new Promise((resolve) => {
            const rootElement = document.createElement('div');
            document.body.appendChild(rootElement);

            const handleAcknowledge = () => {
                resolve();
                root.unmount();
                document.body.removeChild(rootElement);
            };

            const root = createRoot(rootElement);
            root.render(<OrderDialog onAcknowledge={handleAcknowledge} />);
        });
    };

    return showOrderDialog;
};

export default OrderDialog;
