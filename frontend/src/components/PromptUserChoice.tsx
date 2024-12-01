import React from 'react';
import { createRoot } from 'react-dom/client';
import { Cart } from '../types';
import CartSummary from './CartSummary';
import Button from '../components/Button.tsx';

interface PromptUserChoiceProps {
    localCart: Cart; // Local cart data
    backendCart: Cart; // Backend cart data
    onChoice: (choice: string) => void; // Callback for user choice
}

const PromptUserChoice: React.FC<PromptUserChoiceProps> = ({ localCart, backendCart, onChoice }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-coffee bg-opacity-20 z-50 border border-camel">
            <div className="bg-cream w-[1000px] p-6 shadow-lg border border-camel">
                <h2 className="text-xl text-center font-semibold mb-4">Welcome back!</h2>
                <p className="mb-1 text-center">Seems you already had a cart going from your last visit! How would you like to handle your cart?</p>

                <div className="flex flex-row pb-2">
                     {/* Optional: Display local cart summary */}
                    <div className="mb-4 my-4 mx-2 basis-[50%] border border-camel">
                        <h3 className="text-lg py-2 font-semibold text-center">Your New Cart</h3>
                        <CartSummary cart={localCart}/>
                    </div>

                {/* Optional: Display backend cart summary */}
                    <div className="mb-4 my-4 mx-2 basis-[50%] border border-camel">
                        <h3 className="text-lg py-2 font-semibold text-center">Your Saved Cart</h3>
                        <CartSummary cart={backendCart}/>
                    </div>

                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => onChoice('local')}
                        className="mt-0"
                    >
                        Use New Cart 
                    </Button>
                    <Button
                        onClick={() => onChoice('backend')}
                        className="mt-0"
                    >
                        Use Saved Cart
                    </Button>
                    <Button
                        onClick={() => onChoice('combine')}
                        className="mt-0"
                    >
                        Combine Carts
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const usePromptUserChoice = (): ((localCart: Cart, backendCart: Cart) => Promise<string>) => {
    const promptUserChoice = (localCart: Cart, backendCart: Cart): Promise<string> => {
        return new Promise((resolve) => {
            const rootElement = document.createElement('div');
            document.body.appendChild(rootElement);

            const handleChoice = (choice: string) => {
                resolve(choice);
                root.unmount(); 
                document.body.removeChild(rootElement);
            };

            const root = createRoot(rootElement);
            root.render(<PromptUserChoice localCart={localCart} backendCart={backendCart} onChoice={handleChoice} />);
        });
    };

    return promptUserChoice;
};

export default usePromptUserChoice;
