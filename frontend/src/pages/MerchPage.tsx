import React from 'react';
import Sidebar from '../components/Sidebar';
import CatalogProduct from '../components/CatalogProduct';
import SortDropdown from '../components/SortDropdown';

const MerchPage: React.FC = () => {

  const products = [
    { id: 1, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
    { id: 2, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
    { id: 3, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
    { id: 4, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
    { id: 5, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
    { id: 6, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
    { id: 7, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
    { id: 8, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
    { id: 9, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
    // Add more products here
  ];

  return (
    <div className="flex mt-4">

      {/* Sidebar section */}
      <div className="border-r border-r-camel">
        <Sidebar />
      </div>

      {/* Main section */}
      <div className="flex-grow ml-[45px] mr-[200px]">

        <div className="text-2xl">
          Page Name
        </div>

        <div className="flex justify-between items-center py-5">
          {/* Heading section */}
          <div>
            Showing pageMin - pageMax of total products
          </div>
          <div>
            <SortDropdown />
          </div>
        </div>

        {/* Product section */}
        <div className="grid gap-3 pt-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {products.map((product) => (
            <div className="p-0 pb-8" key={product.id}>
              <CatalogProduct
                name={product.name}
                cost={product.cost}
                image={product.image}
              />
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default MerchPage;