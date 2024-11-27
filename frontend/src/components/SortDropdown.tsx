import React, { useState, memo} from "react";


interface SortOption {
    label: string;
    value: string;
}

interface SortDropdownProps {
    onSortChange: (sortBy: string, order: string, label: string) => void;
    selectedOption: string; // Add selectedOption here
}

const SortDropdown: React.FC<SortDropdownProps> = memo(({ onSortChange, selectedOption }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleOptionSelect = (option: SortOption) => {
        // console.log("Selected Option:", option.label); // Log the selected option
        setDropdownOpen(false);
    
        const [sortBy, order] = option.value.split("-");
        // console.log("sortBy:", sortBy);
        // console.log("order:", order);
        onSortChange(sortBy, order, option.label);
    };

    const options = [
        { label: "Price (low to high)", value: "price-asc" },
        { label: "Price (high to low)", value: "price-desc" },
        { label: "Product name", value: "name-asc" },
        { label: "Album", value: "album-asc" },
        { label: "Product category", value: "category-asc" }
    ];

    // console.log("SortDropdown rendered with selectedOption:", selectedOption);
    return (
        <div className="relative inline-flex items-center space-x-2">
          <span className="whitespace-nowrap">Sort by:</span> 
            <button
                onClick={toggleDropdown}
                className="bg-cream text-black px-2 py-2 hover:bg-camel hover:text-white focus:outline-none transition-colors w-full text-left flex justify-between items-center"
                style={{ minWidth: "180px" }}
            >
                <span>{selectedOption}</span>
                <span>⮟</span>
            </button>

            {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-cream text-black border border-camel shadow-md w-40 z-50"
                style={{ width: "180px" }}
                >
                    <ul className="flex flex-col">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="px-3 py-1 hover:text-white hover:font-medium hover:bg-camel cursor-pointer"
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
});

export default SortDropdown;
