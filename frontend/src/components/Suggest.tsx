import React, {useState, useEffect} from 'react'
import CatalogProduct from "../components/CatalogProduct";
import { Product } from '../types'; 
import axios from "axios";

interface SuggestProps {
    currentCategory: string;
    currentProduct: string;
  }

const Suggest: React.FC<SuggestProps> = ({ currentCategory, currentProduct }) => {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    
    useEffect(() => {
      const fetchProducts = async () => {
          try {
              const response = await axios.get<{ products: Product[] }>(
                  `http://127.0.0.1:5000/catalog/products?category=${currentCategory}`
              );

              // Exclude the current product from the results
              const filteredProducts = response.data.products.filter(
                  (product) => product.id.toString() !== currentProduct
              );

              setProducts(filteredProducts);
              setLoading(false);
          } catch (err) {
              console.error(err);
              setError('Failed to load products.');
              setLoading(false);
          }
      };

      fetchProducts();
  }, [currentCategory, currentProduct]); // Dependency on `currentProduct`

  if (loading) return <p>.</p>;
  if (error) return <p>{error}</p>;

    return (
        <div>
            <p className="pl-20 text-camel text-xl pb-2">You may also like </p>
            <div
                className="grid gap-3 pl-20 h-[calc(100vh-250px)] overflow-y-auto scrollbar-hidden"
                style={{
                    gridTemplateColumns: "repeat(1, minmax(200px, 0.9fr))",
                }}
                >
                {products.map((product) => (
                    <CatalogProduct key={product.id} product={product}/>
                ))}

            </div>
        
        </div>
    )
}

export default Suggest
