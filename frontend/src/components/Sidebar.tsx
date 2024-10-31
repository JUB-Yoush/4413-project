import React, { useState } from 'react';
import CheckboxGroup from './CheckboxGroup';

const Sidebar: React.FC = () => {

    interface CheckboxItem {
        checked: boolean;
        displayText: string;
      }

    const [selectedAlbums, setSelectedAlbums] = useState<{ [key: string]: CheckboxItem }>({
        stares: { checked: false, displayText: 'Stares from Above' },
        heavens: { checked: false, displayText: 'Heavens' },
        angels: { checked: false, displayText: 'Angels' },
        cloud: { checked: false, displayText: 'Cloud Flare' },
    });

    const [selectedTypes, setSelectedTypes] = useState<{ [key: string]: CheckboxItem }>({
    apparel: { checked: false, displayText: 'Apparel' },
    music: { checked: false, displayText: 'Music' },
    accessories: { checked: false, displayText: 'Accessories' },
    preOrders: { checked: false, displayText: 'Pre-orders' },
    concert: { checked: false, displayText: 'Concert' },
    });

    const [selectedCost, setSelectedCost] = useState<{ [key: string]: CheckboxItem }>({
    sale: { checked: false, displayText: 'Sale' },
    });

    const handleAlbumCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedAlbums(prevState => ({
          ...prevState,
          [name]: {
            ...prevState[name],
            checked: checked,  // Only update the 'checked' value
          },
        }));
      };
    const handleTypeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedTypes(prevState => ({
            ...prevState,
            [name]: {
              ...prevState[name],
              checked: checked,  // Only update the 'checked' value
            },
        }));
    };
    const handleCostCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedCost(prevState => ({
          ...prevState,
          [name]: {
            ...prevState[name],
            checked: checked,  // Only update the 'checked' value
          },
        }));
      };

    return (
      <div className="w-[280px] text-camel pl-[60px] text-sm">
        <ul>
            <li className="mb-2 font-bold">Filter</li>

            <li className="mb-2">
                <CheckboxGroup
                    items={selectedAlbums}
                    onChange={handleAlbumCheckboxChange}
                    groupName="Album"
                />
            </li>

            <li className="mb-2">
                <CheckboxGroup
                    items={selectedTypes}
                    onChange={handleTypeCheckboxChange}
                    groupName="Type"
                />
            </li>

            <li className="mb-2">
                <CheckboxGroup
                    items={selectedCost}
                    onChange={handleCostCheckboxChange}
                    groupName="Cost"
                />
            </li>
        </ul>
        </div>
    );
};

export default Sidebar;