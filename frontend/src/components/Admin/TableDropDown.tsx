import React from "react";

interface TableDDProps{
    showDD: boolean,
    options: string[],
    handleOptionSelect(o:string):void,
    collateProxiesAndOrders?(): void,
    collateProxiesAndUsers?(): void
}

const TableDropDown: React.FC<TableDDProps> =({showDD,options, handleOptionSelect,
                                                  collateProxiesAndUsers,collateProxiesAndOrders})=>{
    return(
        <div
            className={
                `flex flex-col
                    absolute top-[180px] left-[200px] text-coffee px-3 py-1 transition-opacity duration-500 
                    ${showDD ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
            }>
            <span className="whitespace-nowrap bg-beige">Filter by:</span>
            <div className="text-sm absolute top-full right-0 overflow-y-auto max-h-[200px] max-w-[250px] mt-2 bg-cream text-black border border-camel shadow-md z-50">
                <ul className="flex flex-col whitespace-nowrap">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="px-3 py-1 hover:text-white hover:font-medium hover:bg-camel cursor-pointer"
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                    <li
                        key={"clear"}
                        className="px-3 py-1 hover:text-white hover:font-medium hover:bg-pink cursor-pointer"
                        onClick={collateProxiesAndOrders || collateProxiesAndUsers}
                    >
                        Clear Filter
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default TableDropDown;