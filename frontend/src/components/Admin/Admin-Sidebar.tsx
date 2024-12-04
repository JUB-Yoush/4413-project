import React, { memo } from "react";
import {Link} from "react-router-dom";
import {useTokenContext} from "../TokenContext.tsx";
import {useSPAContext} from "./AdminSPAContext.tsx";

interface NavLink {
    name: string;
    href: string;
}

const sidebarItems: NavLink[] = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Inventory', href: '/admin/inventory' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Sales', href: '/admin/sales' }
];

const AdminSidebar: React.FC = memo(() => {
    const {removeToken} = useTokenContext();
    const {setCurrentPage} = useSPAContext();
    function logOut() {
        removeToken();
        window.location.href="/admin";
        alert("You have been signed out");
    }
    return (
        <aside className="w-[200px] h-auto pl-8 pr-8" aria-label="Sidebar">
            <button className={"mb-4"}>
                <svg className={"stroke-camel text-white hover:bg-camel"}
                     width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">

                    <line y1="0.5" x2="24" y2="0.5"/>
                    <line y1="5.5" x2="24" y2="5.5"/>
                    <line y1="10.5" x2="24" y2="10.5"/>
                </svg>
            </button>
            <p className={"mb-2 text-camel"}>Main Menu</p>
            {/* Page Links */}
            <ul>
                {sidebarItems.map((link) => (
                    <li
                        key={link.name}
                        className={`pl-1 mb-2 hover:text-white hover:font-medium hover:bg-camel hover:border border-camel`}>
                        <Link to={link.href} className="" onClick={()=>{setCurrentPage(link.name.toLowerCase())}}>
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <a href={""} onClick={logOut}>
                <p className={"mb-2 hover:font-extrabold"}>
                    Log Out</p>
            </a>
        </aside>
    );

});

export default AdminSidebar;

