import React from 'react';

interface CheckboxGroupProps {
    items: { [key: string]: { checked: boolean; displayText: string } }; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  groupName: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, onChange, groupName }) => {
  return (
    <div>
      <h3 className="mb-1">{groupName}</h3>
      <ul>
        {Object.keys(items).map((key) => (
          <li className="flex items-center" key={key}>
            <input
              type="checkbox"
              id={key}
              name={key}
              checked={items[key].checked}
              onChange={onChange}
              className="mr-3 ml-5 appearance-none h-3.5 w-3.5 border border-tea-100 checked:bg-tea-100 checked:border-transparent focus:outline-none transition duration-200 ease-in-out relative cursor-pointer"

            />
              <label htmlFor={key} className="text-black">{items[key].displayText}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckboxGroup;