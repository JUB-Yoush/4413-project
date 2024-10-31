import React from 'react';

interface CatalogProduct {
    name: string;
    cost: string;
    image: string;
  }

  const CatalogProduct: React.FC<CatalogProduct> = ({ name, cost, image }) => {    
    return (
        <div className="">
            {/* Aspect Ratio Container */}
            <div className="relative w-full pt-[85%] overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="absolute top-0 left-0 w-full h-full object-cover"  // Ensures the image fills the container
                />
            </div>

            <div className="mt-2 text-sm">
                {name}
            </div>

            <div className="text-sm">
                {cost}
            </div>

            <button className="border border-camel w-full mt-1 border-black bg-transparent text-black text-sm py-0.5 px-4 hover:bg-camel">
                Add to Cart
            </button>
        </div>
    );
};

export default CatalogProduct;