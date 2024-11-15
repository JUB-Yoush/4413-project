import React from 'react';

interface Item {
    name: string;
    cost: string;
    image: string;
    qty: number;
    total: string;
  }

const OrderedItem: React.FC<Item> = ({ name, cost, image , qty,total}) => {
    return (
        <div className={"flex flex-row max-h-40 max-w-2xl gap-4"}>
            {/* Aspect Ratio Container */}
            <div className={"relative w-40 pt-[40%] overflow-hidden"}>
                <img
                    src={image}
                    alt={name}
                    className={"absolute top-0 left-0 object-cover"} // Ensures the image fills the container
                />
            </div>

            <div className={"flex flex-col flex-grow gap-4"}>
                <div className={""}>
                    {name}
                </div>

                <div className={""}>
                    {"$"+cost}
                </div>
            </div>
            <div className={""}>
                {qty}
            </div>

            <div className={""}>
                {"$"+total}
            </div>
        </div>
    );
};

export default OrderedItem;