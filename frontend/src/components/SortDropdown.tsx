import React, { useState } from "react";

const SortDropdown = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Newest");

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleOptionSelect = (option) => {
        setSelectedOption(option.label);
        setDropdownOpen(false);
        // Optionally, add any sorting function or action here
    };

    const options = [
        { label: "Price (low to high)", value: "low-to-high" },
        { label: "Price (high to low)", value: "high-to-low" },
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" }
    ];

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
};

export default SortDropdown;