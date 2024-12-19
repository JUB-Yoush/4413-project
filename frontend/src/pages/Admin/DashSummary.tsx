import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Order, Product, User } from "../../types.ts";
import Inventory from "./Inventory.tsx";

const Dashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    function getGlance() {
        setLoading(true);
        Promise.allSettled([
            axios.get("http://localhost:5000/sale/history"),
            axios.get("http://localhost:5000/user/users"),
            axios.get("http://localhost:5000/catalog/products"),
        ])
            .then((results) => {
                const sales = results[0].status === "fulfilled" ? results[0].value.data.sales : [];
                const users = results[1].status === "fulfilled" ? results[1].value.data.users : [];
                const products = results[2].status === "fulfilled" ? results[2].value.data.products : [];

                setOrders(sales);
                setUsers(users);
                setProducts(products);
            })
            .catch(console.error)
            .finally(()=> {setLoading(false)});
    }

    useEffect(() => {
        getGlance();
    }, []);

    const glance = [
        { count: products.length, name: 'Total Inventory', href: '/admin/inventory' },
        { count: users.length, name: 'Total Users', href: '/admin/users' },
        { count: orders.length, name: 'Total Orders', href: '/admin/orders' },
    ];

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-2xl font-bold mb-4">Quick Summary</h1>
            {loading? <p>Loading</p>: <></>}
            <ul className="flex flex-row gap-8 w-full items-center justify-center border border-camel">
                {glance.map((link) => (
                    <li key={link.name} className="text-center">
                        <Link to={link.href} className="text-sm flex flex-col p-2 hover:text-white hover:font-medium hover:bg-camel hover:border border-camel">
                            <p className="text-lg">{link.count}</p>
                            <p>{link.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <Inventory/>
        </div>
    );
};

export default Dashboard;
