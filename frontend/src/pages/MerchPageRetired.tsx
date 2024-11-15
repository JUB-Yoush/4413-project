import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/SidebarRetired";
import CatalogProduct from "../components/CatalogProduct";
import SortDropdown from "../components/SortDropdown";
import Button from "../components/Button";
import axios from "axios";
import { Product } from '../types'; 

interface MerchPageProps {
  searchQuery: string;
}

const MerchPage: React.FC<MerchPageProps> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");
  const [selectedOption, setSelectedOption] = useState<string>("Product name");

  // Filtering state
  const [selectedAlbums, setSelectedAlbums] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const selectedAlbumKeys = Object.keys(selectedAlbums).filter((key) => selectedAlbums[key]);
    const selectedCategoryKeys = Object.keys(selectedCategories).filter((key) => selectedCategories[key]);

    const queryParams = [
      searchQuery ? `name=${searchQuery}` : "",
      `sort_by=${sortBy}`,
      `order=${order}`,
      selectedAlbumKeys.length > 0 ? `album=${selectedAlbumKeys.join(",")}` : "",
      selectedCategoryKeys.length > 0 ? `category=${selectedCategoryKeys.join(",")}` : "",
    ]
      .filter((param) => param !== "")
      .join("&");

    try {
      const response = await axios.get<{ products: Product[] }>(
        `http://127.0.0.1:5000/catalog/products${queryParams ? `?${queryParams}` : ""}`
      );
      setProducts(response.data.products);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching products:", err.message || err);
      setError("Failed to load products. Please try again.");
      setLoading(false);
    }
  }, [searchQuery, sortBy, order, selectedAlbums, selectedCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = useCallback((sortBy: string, order: string, label: string) => {
    setSortBy(sortBy);
    setOrder(order);
    setSelectedOption(label);
  }, []);

  const handleAlbumChange = (album: string) => {
    setSelectedAlbums((prev) => ({
      ...prev,
      [album]: !prev[album],
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const clearFilters = () => {
    setSelectedAlbums({});
    setSelectedCategories({});
  };

  if (loading) return <p></p>;
  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );

  return (
    <div className="flex mt-4">
      {/* Sidebar for filtering */}
      <div className="border-r border-r-camel">
        <Sidebar
          selectedAlbums={selectedAlbums}
          selectedCategories={selectedCategories}
          onAlbumChange={handleAlbumChange}
          onCategoryChange={handleCategoryChange}
        />
        <Button onClick={clearFilters} className="text-sm mt-2 ml-[55px]">
          Clear Filters
        </Button>
      </div>

      {/* Main section */}
      <div className="flex-grow ml-[45px] mr-[200px]">
        <div className="text-2xl">Merch Page</div>

        <div className="flex justify-between items-center py-5">
          <div>Showing {products.length} products</div>
          <SortDropdown onSortChange={handleSortChange} selectedOption={selectedOption} />
        </div>

        {/* Product grid */}
        <div
          className="grid gap-3 pt-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 0.3fr))",
          }}
        >
          {products.map((product) => (
            <div className="p-0 pb-8" key={product.id}>
              <CatalogProduct product={product}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchPage;
