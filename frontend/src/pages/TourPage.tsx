import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import CatalogProduct from "../components/CatalogProduct";
import SortDropdown from "../components/SortDropdown";
import Button from "../components/Button";
import axios from "axios";
import { Product } from "../types";

interface TourPageProps {
  searchQuery: string; // Passed from the navbar
}

const TourPage: React.FC<TourPageProps> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");
  const [selectedOption, setSelectedOption] = useState<string>("Product name");

  // Filtering state
  const [selectedAlbums, setSelectedAlbums] = useState<Record<string, boolean>>({});
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const currentCategory = categoryFilter || "All Tours";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const selectedAlbumKeys = Object.keys(selectedAlbums).filter((key) => selectedAlbums[key]);

    const queryParams = [
      searchQuery ? `name=${encodeURIComponent(searchQuery)}` : "",
      `sort_by=${sortBy}`,
      `order=${order}`,
      selectedAlbumKeys.length > 0 ? `album=${selectedAlbumKeys.join(",")}` : "",
      categoryFilter ? `category=${encodeURIComponent(categoryFilter)}` : "",
    ]
      .filter(Boolean)
      .join("&");

      console.log("Query Parameters:", queryParams);
    try {
      const response = await axios.get<{ products: Product[] }>(
        `http://127.0.0.1:5000/catalog/products${queryParams ? `?${queryParams}` : ""}`
      );
      setProducts(response.data.products);
    } catch (err: any) {
      console.error("Error fetching products:", err.message || err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, order, selectedAlbums, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, searchParams]);

  const handleSortChange = (sortBy: string, order: string, label: string) => {
    setSortBy(sortBy);
    setOrder(order);
    setSelectedOption(label);
  };

  const handleAlbumChange = (album: string) => {
    setSelectedAlbums((prev) => ({
      ...prev,
      [album]: !prev[album],
    }));
  };

  const clearFilters = () => {
    setSelectedAlbums({});
  };

  if (loading) return <p>Loading..</p>;
  if (error)
    return (
      <div className="text-center">
        <p>{error}</p>
        <Button onClick={fetchProducts} className="mt-4">
          Retry
        </Button>
      </div>
    );

  return (
    <div className="flex mt-4">
      {/* Sidebar for filtering */}
      <div className="border-r border-r-camel mb-10">
        <Sidebar selectedAlbums={selectedAlbums} onAlbumChange={handleAlbumChange} />
        <Button onClick={clearFilters} className="text-sm mt-2 ml-[55px]">
          Clear Filters
        </Button>
      </div>

      {/* Main section */}
      <div className="flex-grow ml-[45px] mr-[200px]">
        <div className="text-2xl">Upcoming Tours - {currentCategory} </div>

        <div className="flex justify-between items-center pt-2 py-5">
          <div>Showing {products.length} products</div>
          <SortDropdown onSortChange={handleSortChange} selectedOption={selectedOption} />
        </div>

        {/* Product grid */}
          <div className="mb-10">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 0.3fr))",
              }}
              >
              {products.map((product) => (
                <CatalogProduct key={product.id} product={product} btnLabel={"See options"}/>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default TourPage;


