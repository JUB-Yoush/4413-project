import React, { memo } from "react";

interface SidebarTestProps {
  selectedAlbums: Record<string, boolean>;
  selectedCategories: Record<string, boolean>; // Updated to camelCase
  onAlbumChange: (album: string) => void;
  onCategoryChange: (category: string) => void; // Updated parameter name
}


const SidebarTest: React.FC<SidebarTestProps> = memo(
  ({ selectedAlbums, selectedCategories, onAlbumChange, onCategoryChange }) => {
    const albums = ["Stares from Above", "Heavens", "Angels", "Cloud Flare"];
    const categories = ["Apparel", "Music", "Accessories", "Pre-orders", "Concert"]; // Renamed from `types`

    // console.log("onCategoryChange:", onCategoryChange);
    return (
      <div className="mb-2 font-bold text-coffee" >
        
        <div className="pl-[50px] text-lg">
            Filters
        </div>


        {/* Albums Section */}
        <div className="w-[280px] pt-3 pl-[50px] text-sm">
          <h3 className="font-thin pb-2">Albums</h3>
          {albums.map((album) => (
            <label key={album} className="flex items-center pb-1 pl-1 space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="input-hidden"
              checked={selectedAlbums[album] || false}
              onChange={() => {onAlbumChange(album)}}
            />
            <span
              className={`w-4 h-4 flex items-center justify-center border-2 ${
                selectedAlbums[album] ? "bg-tea border-tea" : "bg-transparent border-tea"
              }`}
            >
            </span>
            <span className="text-black font-normal">{album}</span>
          </label>
          ))}
        </div>

        {/* Categories Section */}
        <div className="w-[280px] pt-3 pl-[50px] text-sm">
          <h3 className="font-thin pb-2">Category</h3>
          {categories.map((category) => (
            <label key={category} className="flex items-center pb-1 pl-1 space-x-3 cursor-pointer">
            <input
            type="checkbox"
            className="input-hidden"
            checked={selectedCategories?.[category] || false} 
            onChange={() => onCategoryChange(category)}
            />
            <span
                className={`w-4 h-4 flex items-center justify-center border-2 ${
                    selectedCategories[category] ? "bg-tea border-tea" : "bg-transparent border-tea"
              }`}
            >
            </span>
            <span className="text-black font-normal">{category}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
);

export default SidebarTest;
