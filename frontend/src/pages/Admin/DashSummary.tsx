import React, {useState} from "react";
import axios from "axios";
import {useTokenContext} from "../../components/TokenContext.tsx";
import {Link} from "react-router-dom";


interface GlanceStructure {
    count: number;
    name: string;
    href: string;
}

const Dashboard: React.FC = () => {
    const {token} = useTokenContext();
    const [glance, setGlanceState]
        = useState<GlanceStructure[]>(
        [{count:10, name: 'Total Orders', href: '/admin/orders' },
            {count:20, name: 'Total Users', href: '/admin/users' },
            {count:10, name: 'Total Sales', href: '/admin/sales' },
            {count:15, name: 'Total Inventory', href: '/admin/inventory' }]);
    function getGlance(){
        axios({
            method: "get",
            baseURL: "http://localhost:5000",
            url: "\s",
            headers:{
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            console.log("hello from dash");
            //     TODO update glancestate
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
    }

    return (
        <div className={"flex flex-col w-full"}>
            {/*at a glance stats*/}
            {/* Page Links */}
            <ul className={"flex flex-row gap-8 w-full items-center justify-center border border-camel"}>
                {glance.map((link) => (
                    <li
                        key={link.name}
                        className={`text-center`}>
                        <Link to={link.href} className={`text-sm flex flex-col p-2
                                hover:text-white hover:font-medium hover:bg-camel hover:border border-camel`}>
                            <p className={"text-lg"}>{link.count}</p>
                            <p>{link.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            {/*sales charts section*/}
        </div>
    );
};

export default Dashboard;