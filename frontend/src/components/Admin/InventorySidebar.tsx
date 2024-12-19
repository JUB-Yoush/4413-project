import React, { memo } from "react";
import MinimumDistanceSlider from "../Sidebars/MinimumDistanceSlider";
import { useMetadata } from "../MetadataContext";

interface SidebarProps {
  selectedCategory: string;
  selectedAlbums: Record<string, boolean>;
  minPrice: number;
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onAlbumChange: (updatedAlbums: Record<string, boolean>) => void;
  onPriceChange: (priceRange: number[]) => void; 
}

const Sidebar: React.FC<SidebarProps> = memo(
  ({
    selectedCategory,
    selectedAlbums,
    minPrice,
    maxPrice,
    onCategoryChange,
    onAlbumChange,
    onPriceChange,
  }) => {
    const { metadata } = useMetadata(); // Fetch metadata from the React Context

    if (!metadata) {
      return <div className="pl-[50px] text-sm"></div>;
    }

    const { categories, albums } = metadata;
    const allCategories = ["All Products", ...categories];

  return (
    <div className="mb-2 pr-6 font-bold text-coffee">
      <div className="text-lg">Browse</div>

      {/* Categories Section */}
      <div className="pt-3 text-sm">
        <h3 className="font-thin pb-2">Categories</h3>
        {allCategories.map((category) => (
            <div
              key={category}
              onClick={() => onCategoryChange(category === "All Products" ? "" : category)} 
              className={`block pb-1 pl-1 font-normal hover:text-tea cursor-pointer ${
                category === selectedCategory || (category === "All Products" && selectedCategory === "")
                  ? "font-semibold text-black"
                  : "font-normal text-black"
              }`}
            >
            {category}
          </div>
        ))}
      </div>

      {/* Albums Section */}
      <div className="pt-5 text-sm">
        <h3 className="font-thin pb-2">Filter by Album</h3>
        {albums.map((album) => (
          <label key={album} className="flex items-center pb-1 space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="input-hidden"
              checked={selectedAlbums[album] || false}
              onChange={() => {
                const updatedAlbums = { ...selectedAlbums, [album]: !selectedAlbums[album] };
                onAlbumChange(updatedAlbums);
              }}
            />
            <span
              className={`w-4 h-4 flex items-center justify-center border-2 ${
                selectedAlbums[album] ? "bg-tea border-tea" : "bg-transparent border-tea"
              }`}
            ></span>
            <span className="text-black font-normal">{album}</span>
          </label>
        ))}
      </div>



      {/* Price Section */}
      <div className="pt-5 text-sm">
        <h3 className="font-thin pb-2">Filter by Price</h3>

        <MinimumDistanceSlider
            priceRange={[minPrice, maxPrice]}
            onPriceChange={onPriceChange}
      />

        {/* {albums.map((album) => (
          <label key={album} className="flex items-center pb-1 space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="input-hidden"
              checked={selectedAlbums[album] || false}
              onChange={() => onAlbumChange(album)}
            />
            <span
              className={`w-4 h-4 flex items-center justify-center border-2 ${
                selectedAlbums[album] ? "bg-tea border-tea" : "bg-transparent border-tea"
              }`}
            ></span>
            <span className="text-black font-normal">{album}</span>
          </label>
        ))} */}
      </div>

    </div>
  );
});

export default Sidebar;

