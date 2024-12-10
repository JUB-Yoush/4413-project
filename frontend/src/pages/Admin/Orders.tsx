import React, {useEffect, useState} from "react";
import {Order, OrderProxy} from "../../types.ts";
import axios from "axios";
import Button from "../../components/Button.tsx";
import {OrderTable} from "../../components/Admin/Table.tsx";
import {forEach} from "lodash";
import TableDropDown from "../../components/Admin/TableDropDown.tsx";
const Orders: React.FC = () => {

    const defaultOrder: Order = {
        "id": "90", "approved": false, "date": "Wed,19 Nov, 2024",
        "purchases": [{"image_url": "", "name": "defaultOrderItem", "price": 0.00, "product_id": "",
            "quantity": 8, "total_price": 0.00}],
        "user": {"cart_items": [], "cart_total": 0.0, "cc_info": "", "city": "",
            "decryption_key": "", "email": "defaultOrder.co", "fname": "Fname", "id": "",
            "lname": "", "password": "", "postal_code": "", "province": "", "street": ""}
    }; //default order structure to be used by objects with state

    const [showDialog, setShowDialog]
        = useState(false);
    const [orders, setOrders] = useState<Order[]>(
        []);
    // order to be passed to dialog box for editing
    const [order, setOrder] = useState<Order>(defaultOrder);

    const defaultProxy = {
        "id": "", "approved": "false", "date": "",
        "purchases": "", "user": "", "total_price":"0.00"
    };

    // list of proxy orders to be passed to table for displaying
    const [orderProxies, setOrderProxies] = useState<OrderProxy[]>(
        [defaultProxy]);
    // proxy order to be parsed before setOrder() is called | proxy order to be passed to table for displaying
    const [orderProxy, setOrderProxy] = useState<OrderProxy>(
        defaultProxy);

    const findOrder = (proxy: OrderProxy)=>{
        let temp :Order = defaultOrder;
        //will return the order matching the proxy's id
        forEach(orders, (o)=>{
            if(o.id === proxy.id){
                temp = o;
        }})
        return temp;
    }
    //keep orderProxy and order in sync
    useEffect(()=>{setOrder(findOrder(orderProxy))},[orderProxy]);

    const [filter, setFilter]
        = useState({column: "id", value: defaultOrder.id});

    // show dropdown for the filter
    const [showDD, setShowDD] = useState(false);
    const toggleShowDD=(b?:boolean)=>{
        if(b) { setShowDD(true);}
        else { setShowDD(!showDD)}
    }
    /*
    * collate the hashmap of values for the dropdown
    * - unique order ids
    * - unique date
    * - unique User Email
    * - unique Purchases
    * - unique Approved
    * */
    const [ddValues, setDDValues]
        = useState({id: [""], date: [""], user: [""], purchases: [""], approved: [""], total_price:[""]}
    );

    //update orderProxies and column filtering options
    const collateProxiesAndOrders = ()=>{
        // will create order Proxies from each order in orders
        const temp: OrderProxy[] = [];
        // store the order details for filtering
        const temporderIDs : string[] = [];
        const temporderDates : string[] = [];
        const temporderUsers : string[] = [];
        const temporderPrices : string[] = [];
        const temporderPurchases : string[] = [];
        const temporderApproveds : string[] = [];

        forEach(orders, (o)=>{
            const currID = o.id;
            const currApproved = `${o.approved}`;
            const currDate= o.date.slice(0,16);
            const currPurchases = `(${o.purchases[0].quantity}) ${o.purchases[0].name}`;
            const currUser = o.user.email;
            const currPrice = `${o.purchases[0].total_price}`;
            temp.push({
                "id": currID, "approved": currApproved, "date": currDate,
                "purchases": currPurchases,
                "user": currUser, total_price: currPrice
            });

            temporderIDs.push(currID);
            temporderDates.push(currDate);
            temporderUsers.push(currUser);
            temporderPrices.push(currPrice);
            temporderPurchases.push(currPurchases)
            temporderApproveds.push(currApproved);
        });
        setOrderProxies(temp);

        setDDValues({id: [...new Set(temporderIDs)], approved: [...new Set(temporderApproveds)],
            user: [...new Set(temporderUsers)], purchases: [...new Set(temporderPurchases)],
            date: [...new Set(temporderDates)], total_price: [...new Set(temporderPrices)]});
    }
    // keep proxies in sync
    useEffect(()=>{collateProxiesAndOrders()},[orders]);

    function getOrders(){
        axios({
            method: "get",
            baseURL: "http://localhost:5000",
            url: "/sale/history",
        }).then((response) => {
            setOrders(response.data.sales);
            collateProxiesAndOrders();
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
    }

    const defaultOrderForm = {
        "id": order.id, "approved": `${order.approved}`,
        "date": order.date,
        "purchases": order.purchases,
        "user": {
            "cart_items": order.user.cart_items, "cart_total": order.user.cart_total,
            "cc_info": order.user.cc_info, "city": order.user.city,
            "decryption_key": order.user.decryption_key, "email": order.user.email,
            "fname": order.user.fname, "id": order.user.id, "lname": order.user.lname,
            "password": order.user.password, "postal_code": order.user.postal_code,
            "province": order.user.province, "street": order.user.street
        }
    };

    const [orderForm, setOrderForm]
        = useState(defaultOrderForm);

    useEffect(()=>{setOrderForm(defaultOrderForm)},[order]);

    function editOrder(event: React.FormEvent) {
        // handle sending info to flask once the form is submitted
        if(order.id) {
            axios({
                method: "patch",
                baseURL: 'http://127.0.0.1:5000', //can replace with personal port
                url: `/order/${orderForm.id}`,
                data: {
                    approved: orderForm.approved,
                }
            }).then(async () => {
                alert("Order Edited!");
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            })
            event.preventDefault();
        }
    }

    const ocolumns = [
        { id: 1, header: 'Order ID', accessor: 'id' },
        { id: 2, header: 'Date', accessor: 'date' },
        { id: 3, header: 'User Email', accessor: 'user' },
        { id: 4, header: 'Purchases', accessor: 'purchases' },
        { id: 5, header: 'Approved', accessor: 'approved' },
        { id: 6, header: 'Total', accessor: 'total_price' }
    ];

    // const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
    const labelDivStyle = "mb-4 w-full";
    const pStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-beige border-t-camel";

    const [options, setOptions] = useState([""]);

    // update dropdown when filter changes
    useEffect(()=>{setOptions(ddValues[filter.column]);},[filter]);

    const handleOptionSelect=(option: string)=> {
        // manipulate orders so the data is only per filter
        // option is the value that should be shown in the column
        const temp: OrderProxy[] = [];

        setFilter(prevNote => ({...prevNote, ["value"]: option}) );

        forEach(orders, (o)=>{
            const currID = o.id;
            const currApproved = `${o.approved}`;
            const currDate= o.date.slice(0,16);
            const currPurchases = `(${o.purchases[0].quantity}) ${o.purchases[0].name}`;
            const currUser = o.user.email;
            const currPrice = `${o.purchases[0].total_price}`;
            const tempProxy: OrderProxy = {
                "id": currID, "approved": currApproved, "date": currDate,
                "purchases": currPurchases,
                "user": currUser, total_price: currPrice
            };

            if(tempProxy[filter.column]===option) temp.push(tempProxy);
        });
        setOrderProxies(temp);
    }

    return (
        <div>
            {/*Dropdown for column filter*/}
            <TableDropDown showDD={showDD} options={options} collateProxiesAndOrders={collateProxiesAndOrders}
                           handleOptionSelect={handleOptionSelect}/>
            {showDialog ?
                <div className={"z-10 flex absolute t-0 l-0 p-10 w-9/12 h-5/6 items-center justify-center bg-cream"}>
                    <dialog open className={"bg-beige border border-camel px-10 py-4 w-9/12 h-5/6 overflow-y-auto"}>

                        <div className={"grid grid-cols-2 mb-6"}>
                            {orderForm.approved?
                                <Button onClick={editOrder} buttonVariant={"sec"}>Decline Order</Button>
                                :
                                <Button onClick={editOrder}>Approve Order</Button>
                            }
                            <Button onClick={()=>{setShowDialog(false);}}>Close</Button>
                        </div>

                        {/*{showForm ?*/}
                        {/*    <form method={"post"}>*/}
                        {/*        <div className="grid items-center min-w-full">*/}

                        {/*            /!*Account Section*!/*/}
                        {/*            <p className={"text-3xl mb-6"}>Editing Order</p>*/}
                        {/*            <div className={"grid grid-cols-2 gap-4"}>*/}
                        {/*                <div className={labelDivStyle}>*/}
                        {/*                    <label htmlFor={"date"}>Date</label>*/}
                        {/*                    <input*/}
                        {/*                        id={"date"} name={"date"} value={orderForm.date} type={"text"}*/}
                        {/*                        onChange={handleChange} placeholder={""} autoComplete={"on"}*/}
                        {/*                        className={fieldStyle}/>*/}
                        {/*                </div>*/}
                        {/*                <div className={labelDivStyle}>*/}
                        {/*                    <label htmlFor={"email"}>User Email</label>*/}
                        {/*                    <input*/}
                        {/*                        id={"email"} name={"email"} value={orderForm.user.email} type={"email"}*/}
                        {/*                        onChange={handleChange} placeholder={""} autoComplete={"on"}*/}
                        {/*                        className={fieldStyle}/>*/}
                        {/*                </div>*/}
                        {/*                <div className={labelDivStyle}>*/}
                        {/*                    <label htmlFor={"purchases"}>Purchases</label>*/}
                        {/*                    <input*/}
                        {/*                        id={"purchases"} name={"purchases"} value={orderForm.purchases[0].image_url} type={"email"}*/}
                        {/*                        onChange={handleChange} placeholder={""} autoComplete={"on"}*/}
                        {/*                        className={fieldStyle}/>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <Button onClick={editOrder}>Save Order Edit</Button>*/}
                        {/*        </div>*/}
                        {/*    </form>*/}


                        {/*    :*/}

                            {/*// only show user account details, no edit*/}
                            <div className="grid items-center min-w-full">
                                {/*px-8 pt-6 pb-8 mb-4 h-auto w-full */}
                                {/*Account Section*/}
                                <p className={"text-3xl mb-6"}>Viewing Order</p>
                                <div className={"grid grid-cols-2 gap-4"}>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"date"}>Date</label>
                                        <p className={pStyle}>{orderForm.date}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"email"}>User Email</label>
                                        <p className={pStyle}>{orderForm.user.email}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"purchases"}>Purchases</label>
                                        <p className={pStyle}>{`(${orderForm.purchases[0].quantity}) ${orderForm.purchases[0].name}`}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"approved"}>Approval State</label>
                                        <p className={pStyle}>{orderForm.approved}</p>
                                    </div>
                                </div>
                            </div>
                    </dialog>
                </div>
                :
                <></>
            }
            <h1 className="text-2xl font-bold mb-4">Orders</h1>
            <Button onClick={getOrders}>Update table</Button>
            <OrderTable columns={ocolumns} data={orderProxies}
                        setVis={setShowDialog} setOrderProxy={setOrderProxy}
                        setFilter={setFilter} toggleShowDD={toggleShowDD}
            />
        </div>
    );
};

export default Orders;