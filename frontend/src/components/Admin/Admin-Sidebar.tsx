import React, { memo } from "react";

interface NavLink {
    name: string;
    href: string;
}

// To be edited to contain sidebar items
// const sidebarItems: NavLink[] = [
//     { name: 'Merch', href: '/catalog/products' },
//     { name: 'Tour Dates', href: '/tour' },
//     { name: 'Contact', href: '/contact' }
// ];

const AdminSidebar: React.FC = memo(() => {
    // Sample navigation links
    function logOut() {
        alert("You have been signed out");
    }
    return (
        <aside className="text-camel w-[200px] h-auto pl-8 pr-8 border-r border-camel" aria-label="Sidebar">
            <a href={"/account-settings"}><p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Dashboard</p></a>
            <a href={"/order-history"}><p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Inventory</p></a>
            <a href={"/order-history"}><p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Orders</p></a>
            <a href={"/order-history"}><p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Users</p></a>
            <a href={"/order-history"}><p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                Sales</p></a>
            <a href={""} onClick={logOut}>
                <p className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                    Log Out</p>
            </a>

        </aside>
    );

});

export default AdminSidebar;

