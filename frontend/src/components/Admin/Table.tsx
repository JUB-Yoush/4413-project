import React from 'react';
import {OrderProxy, User} from "../../types.ts";
import TableHeader from "./TableHeader.tsx";
import TableBody from "./TableBody.tsx";

interface DataStructure{
    name: string,
    age: number,
    email: string
}
interface ColumnStructure{
    header: string,
    accessor: string
}
interface TableContent{
    columns: ColumnStructure[],
    data: DataStructure[]
}

const defaultTableContainerStyle = "max-w-11/12 h-5/6 overflow-auto"; //w-9/12
const defaultTableStyle = "bg-beige border border-camel";
const Table: React.FC<TableContent> = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent border border-camel">
                <thead className="bg-gray-200">
                <tr>
                    {columns.map((column:ColumnStructure) => (
                        <th
                            key={column.accessor}
                            className="py-2 px-4 bg-tea border-b border-camel text-left"
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-cream">
                        {columns.map((column:ColumnStructure) => (
                            <td
                                key={column.accessor}
                                className="py-2 px-4 border-b border-camel text-gray-800"
                            >
                                {row[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

interface UserCol{
    header: string,
    accessor: string
}
interface UserTableContent{
    columns: UserCol[],
    data: User[],
    setFilter({}): void,
    setVis: (s:boolean)=>void,
    toggleShowDD(b?:boolean): void,
    setUser: (u:User)=>void,
}

export const UserTable: React.FC<UserTableContent> = ({ columns, data, setVis, setUser,setFilter,toggleShowDD }) => {
    return (
        <div>
            <div className={defaultTableContainerStyle}>
                <table className={defaultTableStyle}>
                    <TableHeader columns={columns} setFilter={setFilter} toggleShowDD={toggleShowDD}></TableHeader>
                    <TableBody columns={columns} data={data} setUser={setUser} setVis={setVis}></TableBody>
                </table>
            </div>
        </div>
    );
};

interface OrderCol{
    header: string,
    accessor: string
}
interface OrderTableContent{
    columns: OrderCol[],
    data: OrderProxy[],
    setVis(s:boolean): void,
    toggleShowDD(b?:boolean): void,
    setFilter({}): void,
    setOrderProxy(o:OrderProxy): void,
}
export const OrderTable: React.FC<OrderTableContent> = ({ columns, data,
                                                            setOrderProxy, setVis, setFilter,
                                                            toggleShowDD}) => {
    return (
        <div className={defaultTableContainerStyle}>
            <table className={defaultTableStyle}>
                <TableHeader columns={columns} setFilter={setFilter} toggleShowDD={toggleShowDD}></TableHeader>
                <TableBody columns={columns} data={data} setOrderProxy={setOrderProxy} setVis={setVis}></TableBody>
            </table>
        </div>
    );
};

interface SalesRow{
    fname: string,
    lname: string,
    email: string,
    address: number
}
interface SalesCol{
    header: string,
    accessor: string
}
interface SalesTableContent{
    columns: SalesCol[],
    data: SalesRow[]
}
export const SalesTable: React.FC<SalesTableContent> = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent border border-camel">
                <thead className="bg-gray-200">
                <tr>
                    {columns.map((column:ColumnStructure) => (
                        <th
                            key={column.accessor}
                            className="py-2 px-4 bg-tea border-b border-camel text-left"
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-cream">
                        {columns.map((column:ColumnStructure) => (
                            <td
                                key={column.accessor}
                                className="py-2 px-4 border-b border-camel text-gray-800"
                            >
                                {row[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};



export default Table;
