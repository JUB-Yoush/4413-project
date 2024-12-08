import React from "react";
interface UserCol{
    header: string,
    accessor: string
}
interface TableHeaderProps{
    columns: UserCol[],
    setFilter({}): void,
    toggleShowDD(b?:boolean): void,
    classname?: string
}
const TableHeader: React.FC<TableHeaderProps> = ({columns, setFilter, toggleShowDD, classname}) =>{
    const defaultStyle = "py-2 px-4 bg-tea border-b border-camel text-left cursor-pointer hover:bg-browntea";

    return(
        <thead>
        <tr>
            {columns.map(({accessor, header}) => (
                <th
                    key={accessor}
                    className={classname || defaultStyle}
                    onClick={()=>{
                        setFilter(prevNote => ({...prevNote, ["column"]: accessor}) );
                        toggleShowDD();}
                    }
                >
                    {header}
                </th>
            ))}
        </tr>
        </thead>
    )
}
export default TableHeader;