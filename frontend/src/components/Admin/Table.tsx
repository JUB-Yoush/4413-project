import React from 'react';
import {OrderProxy, User} from "../../types.ts";
import TableHeader from "./TableHeader.tsx";
import TableBody from "./TableBody.tsx";


const defaultTableContainerStyle = "max-w-11/12 h-5/6 overflow-auto"; //w-9/12
const defaultTableStyle = "bg-beige border border-camel text-sm";


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
