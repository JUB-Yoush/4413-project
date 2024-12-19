import React from "react";
import {OrderProxy, User} from "../../types.ts";

interface UserCol{
    header: string,
    accessor: string
}
interface OrderCol{
    header: string,
    accessor: string
}
interface TableBodyProps{
    columns: UserCol[] | OrderCol[],
    data: User[] | OrderProxy[],
    setVis(s:boolean): void,
    setUser?(u:User): void,
    setOrderProxy?(o:OrderProxy): void,
    classname?: string
}
const TableBody: React.FC<TableBodyProps> = ({columns,data, setVis,
                                                 setUser, setOrderProxy,
                                                 classname}) =>{
    const defaultStyle = `py-2 px-4 border-b border-camel text-gray-800 hover:text-white
      whitespace-pre break-words`;
    const isUser = (x: any): x is User => data.includes(x);
    const isOrder = (x: any): x is OrderProxy => data.includes(x);

    return(
        <tbody>
        {data.map((row) => (
            <tr key={row.id}
                className="even:bg-cream cursor-pointer hover:bg-camel"
                onClick={()=>{
                    if (isUser(row) && setUser) setUser(row);
                    else if (isOrder(row) && setOrderProxy) setOrderProxy(row);
                    window.scrollTo(0,0);
                    setVis(true);
                    }
                }
            >

                {columns.map((column) => (
                    <td
                        key={column.accessor}
                        className={classname || defaultStyle}
                    >
                        {/*{isOrders? <></>:<></>}*/}
                        {row[column.accessor]}
                    </td>
                ))}
            </tr>
        ))}
        </tbody>
    )
}
export default TableBody;