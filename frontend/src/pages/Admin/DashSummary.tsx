import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {Order, Product, User} from "../../types.ts";
import Inventory from "./Inventory.tsx";


interface GlanceStructure {
    count: number;
    name: string;
    href: string;
}

const Dashboard: React.FC = () => {

    const defaultOrder: Order = {
        "id": "120", "approved": true, "date": "Wed,22 Nov, 2024",
        "purchases": [{"image_url": "", "name": "defaultOrder4Item", "price": 0.00, "product_id": "",
            "quantity": 3, "total_price": 0.00}],
        "user": {"cart_items": [], "cart_total": 0.0, "cc_info": "", "city": "",
            "decryption_key": "", "email": "defaultOrder4.c", "fname": "Fname", "id": "",
            "lname": "", "password": "", "postal_code": "", "province": "", "street": ""}
    };
    const [orders, setOrders] = useState<Order[]>(
        [defaultOrder]);
    const defaultUser: User = {"id": "", "fname": "", "lname": "", "email": "", "password": "",
        "street": "", "city": "", "postal_code": "", "province": "", "cc_info": "",
        "decryption_key": "", "cart_items": [], "cart_total": 0.0,
    }
    const [users, setUsers] = useState<User[]>([defaultUser]);
    const [products, setProducts] = useState<Product[]>([]);

    const [glance, setGlanceState]
        = useState<GlanceStructure[]>(
        [{count:orders.length, name: 'Total Orders', href: '/admin/orders' },
            {count:users.length, name: 'Total Users', href: '/admin/users' },
            {count:products.length, name: 'Total Inventory', href: '/admin/inventory' }]);

    function getGlance(){
        /*
        * Get # of sales/orders
        * */
        axios({
            method: "get",
            baseURL: "http://localhost:5000",
            url: "/sale/history",
        }).then((response) => {
            setOrders(response.data.sales);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
        /*
        * Get # of users
        * */
        axios({
            method: "get",
            baseURL: "http://localhost:5000",
            url: "/user/users",
        }).then((response) => {
            setUsers(response.data.users);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
        /*
        * Get # of products
        * */
        axios({
            method: "get",
            baseURL: "http://localhost:5000",
            url: "/catalog/products",
        }).then((response) => {
            setProducts(response.data.products);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
        setGlanceState(
            [{count:orders.length, name: 'Total Orders', href: '/admin/orders' },
                {count:users.length, name: 'Total Users', href: '/admin/users' },
                {count:products.length, name: 'Total Inventory', href: '/admin/inventory' }]
        )
    }
    useEffect(()=>{getGlance()},[orders,users,products]);

    return (
        <div className={"flex flex-col w-full"}>
            {/*at a glance stats*/}

            {/* Page Links */}
            <ul className={"flex flex-row gap-8 w-full mb-8 items-center justify-center border border-camel"}>
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
            <Inventory/>
        </div>
    );
};

export default Dashboard;