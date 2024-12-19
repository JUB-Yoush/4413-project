import React, {useCallback, useEffect, useState} from "react";
import Button from "../../components/Button.tsx";
import {Product} from "../../types.ts";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import SortDropdown from "../../components/Catalog/SortDropdown.tsx";
import InventoryProduct from "../../components/Admin/InventoryProduct.tsx";
import InventorySidebar from "../../components/Admin/InventorySidebar.tsx";

const Inventory: React.FC = () => {
    const searchQuery = '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Sorting state
    const [sortBy, setSortBy] = useState<string>("name");
    const [order, setOrder] = useState<string>("asc");
    const [selectedOption, setSelectedOption] = useState<string>("Product name");

    // Filtering state
    const [searchParams, setSearchParams] = useSearchParams();

    // Single category filter
    const categoryFilter = searchParams.get("category");
    const currentCategory = categoryFilter || "All Products";

    // Multi-album filter
    const albumFilter = searchParams.get("albums");
    const [selectedAlbums, setSelectedAlbums] = useState<Record<string, boolean>>(() => {
        const albums = albumFilter ? albumFilter.split(",") : [];
        return albums.reduce((acc, album) => {
            acc[album] = true;
            return acc;
        }, {} as Record<string, boolean>);
    });
    // price range
    const priceFilter = searchParams.get("priceRange");
    const [priceRange, setPriceRange] = useState<number[]>(() => {
        if (priceFilter) {
            const [min, max] = priceFilter.split(",").map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                return [min, max === 150 ? Infinity : max]; // Convert 150 to Infinity
            }
        }
        return [0, Infinity]; // Default range, with no upper limit
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        const minPrice = priceRange[0];
        const maxPrice = priceRange[1] === Infinity ? 999999 : priceRange[1];

        const queryParams = [
            searchQuery ? `name=${encodeURIComponent(searchQuery)}` : "",
            `sort_by=${sortBy}`,
            `order=${order}`,
            categoryFilter ? `category=${encodeURIComponent(categoryFilter)}` : "",
            albumFilter ? `album=${encodeURIComponent(albumFilter)}` : "",
            `min_price=${minPrice}`,
            `max_price=${maxPrice}`,
        ]
            .filter(Boolean)
            .join("&");

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
        // console.log("Query params:", queryParams);
    }, [searchQuery, sortBy, order, categoryFilter, albumFilter, priceRange]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSortChange = (sortBy: string, order: string, label: string) => {
        setSortBy(sortBy);
        setOrder(order);
        setSelectedOption(label);

        // Update URL query params for sorting
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("sort_by", sortBy);
        newSearchParams.set("order", order);
        setSearchParams(newSearchParams);
    };

    const handleCategoryChange = (category: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (category === "All Products") {
            newSearchParams.delete("category");
        } else {
            newSearchParams.set("category", category);
        }
        setSearchParams(newSearchParams); // Sync with URL
    };

    const handleAlbumChange = (updatedAlbums: Record<string, boolean>) => {
        setSelectedAlbums(updatedAlbums);

        const selectedAlbumKeys = Object.keys(updatedAlbums).filter((key) => updatedAlbums[key]);
        const newSearchParams = new URLSearchParams(searchParams);
        if (selectedAlbumKeys.length > 0) {
            newSearchParams.set("albums", selectedAlbumKeys.join(","));
        } else {
            newSearchParams.delete("albums");
        }
        setSearchParams(newSearchParams);
    };

    const handlePriceChange = (values: number[]) => {
        // console.log("Slider values:", values);
        setPriceRange(values);

        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("min_price", String(values[0]));
        newSearchParams.set("max_price", String(values[1]));

        // console.log("Updated query params:", newSearchParams.toString());
        setSearchParams(newSearchParams); // Sync with URL
    };


    const clearFilters = () => {
        setSelectedAlbums({});
        setPriceRange([0, Infinity]); // Reset price range
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("albums");
        newSearchParams.delete("category");
        newSearchParams.delete("min_price");
        newSearchParams.delete("max_price");
        setSearchParams(newSearchParams);
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
        <div>
            <Button onClick={()=>{window.location.href="/admin/inventory/addProduct"}}>Add a Product</Button>

            <div className="flex mt-4">
                {/* Sidebar for filtering */}
                <div className="border-r border-r-camel mb-10">
                    <InventorySidebar
                        selectedCategory={currentCategory}
                        selectedAlbums={selectedAlbums}
                        minPrice={priceRange[0]}
                        maxPrice={priceRange[1]}
                        onCategoryChange={handleCategoryChange}
                        onAlbumChange={handleAlbumChange}
                        onPriceChange={handlePriceChange}
                    />
                    <Button onClick={clearFilters} className="text-sm mt-2 ml-[55px]">
                        Clear Filters
                    </Button>
                </div>

                {/* Main section */}
                <div className="flex-grow ml-[45px] mr-[30px]">
                    <div className="text-2xl font-bold mb-4">Inventory - {currentCategory} </div>

                    <div className="flex justify-between items-center  gap-2 pt-2 py-5">
                        <div>Showing {products.length} products</div>
                        <SortDropdown onSortChange={handleSortChange} selectedOption={selectedOption} />
                    </div>

                    {/* Product grid */}
                    <div className="mb-10">
                        <div
                            className="grid gap-10"
                            style={{
                                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 0.3fr))",
                            }}
                        >
                            {products.map((product) => (
                                <InventoryProduct key={product.id} product={product} btnLabel={"View Product"}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>




        </div>
    );
};

export default Inventory;