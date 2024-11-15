import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button.tsx';
import { Product } from '../types'; 

interface CatalogProductProps {
    product: Product;
}

  const CatalogProduct: React.FC<CatalogProductProps> = ({ product }) => {    

    const navigate = useNavigate();
    const isNavigating = useRef(false);

    const detailClick = () => {
        if (isNavigating.current) return; 
        isNavigating.current = true;

        navigate(`/catalog/products/${encodeURIComponent(product.name)}`, { state: product });
    };

    return (
        <div className="">
            {/* Aspect Ratio Container */}
            <div className="relative w-full pt-[100%] overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"  // Ensures the image fills the container
                />
            </div>

            <div className="mt-2 text-sm">
                {product.name}
            </div>

            <div className="text-sm">
                ${product.price}
            </div>
        
            <Button 
                onClick={detailClick}
                className ="w-full mt-3"
            >View Details</Button>
        </div>
    );
};

export default CatalogProduct;

