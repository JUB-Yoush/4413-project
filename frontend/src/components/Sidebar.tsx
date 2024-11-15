import React, { memo } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface SidebarProps {
  selectedAlbums: Record<string, boolean>;
  onAlbumChange: (album: string) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ selectedAlbums, onAlbumChange }) => {
  const categories = ["All Products", "Apparel", "Music", "Accessories", "Pre-orders", "Concert"];
  const albums = ["Stares from Above", "Heavens", "Angels", "Cloud Flare"];

  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "All Products";

  return (
    <div className="mb-2 font-bold text-coffee">
      <div className="pl-[50px] text-lg">Browse</div>

      {/* Categories Section */}
      <div className="w-[280px] pt-3 pl-[50px] text-sm">
        <h3 className="font-thin pb-2">Categories</h3>
        {categories.map((category) => {
          const isActive = category === currentCategory || (category === "All Products" && !searchParams.has("category"));
          return (
            <Link
              to={category === "All Products" 
                ? "/catalog/products" 
                : `/catalog/products?category=${encodeURIComponent(category)}`}
              key={category}
              className={`block pb-1 pl-1 font-normal hover:text-tea ${
                isActive ? "font-semibold text-black" : "font-normal text-black"
              }`}
            >
              {category}
            </Link>
          );
        })}
      </div>

      {/* Albums Section */}
      <div className="w-[280px] pt-5 pl-[50px] text-sm">
        <h3 className="font-thin pb-2">Filter by Album</h3>
        {albums.map((album) => (
          <label key={album} className="flex items-center pb-1 pl-1 space-x-3 cursor-pointer">
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
        ))}
      </div>
    </div>
  );
});

export default Sidebar;

