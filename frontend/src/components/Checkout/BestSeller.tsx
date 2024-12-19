import React, { useEffect, useState } from "react";
import axios from "axios";
import CatalogProduct from "../Catalog/CatalogProduct"; // Component for displaying products
import { Product } from "../../types"; 


interface TopSeller {
  product_id: string;
  total_quantity: number;
}

interface SuggestProps {
  columns?: number; // Optional column count
}

const SuggestBest: React.FC<SuggestProps> = ({ columns = 4 }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        // Step 1: Fetch top sellers
        const response = await axios.get<{ top_sellers: TopSeller[] }>(
          "http://127.0.0.1:5000/sale/top-sellers"
        );
  
        // Step 2: Extract only the first 4 product IDs
        const topFourProductIds = response.data.top_sellers
          .map((item) => item.product_id)
          .slice(0, 4); // Limit to 4 products here
  
        // Step 3: Fetch product details only for the top 4 products
        const productRequests = topFourProductIds.map((id) =>
          axios.get<Product>(`http://127.0.0.1:5000/catalog/products/${id}`)
        );
  
        const productResponses = await Promise.all(productRequests);
  
        // Step 4: Set the products state
        setProducts(productResponses.map((res) => res.data));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load top-selling products.");
        setLoading(false);
      }
    };
  
    fetchTopSellers();
  }, []); // Runs only on component mount

  if (loading) return <p>""</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <p className="pl-20 text-camel text-xl pb-2">You may also like our best sellers</p>
      <div
        className="grid gap-3 pl-20 h-[calc(100vh-250px)] overflow-y-auto scrollbar-hidden"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(200px, 0.9fr))`,
        }}
      >
        {products.map((product) => (
          <CatalogProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SuggestBest;

