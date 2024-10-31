import React from "react";

function SortDropdown() {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-700 font-medium">Sort by:</span>
      <select
        className="bg-cream text-black focus:ring-0 px-2 py-2"
      >
        <option value="low-to-high">Price (low to high)</option>
        <option value="high-to-low">Price (high to low)</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}

export default SortDropdown;