import React, { useEffect, useState } from 'react';
import {useParams, useLocation} from 'react-router-dom';
import { Product } from '../../types';
import Button from '../../components/Button.tsx';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import axios from "axios";


const EditProductPage: React.FC = () => {
    const location = useLocation(); //to receive data from previous page
    const {id } = useParams<{ id: string }>() ?? {id:""};
    const [product, setProduct] = useState<Product>(location.state as Product);
    const [popupVisible, setPopupVisible] = useState(false); // Controls visibility

    const [showForm, setShowForm] = useState(false);
    const [prodForm, setProdForm]
        = useState({id: "Product ID", name: "Product Name", category: "Product Category",
        brand: "Product Brand", album: "Product Album", price: 0.00,
        description: "Product Description", image_url: "Image URL", quantity: 1});

    function getProduct(id: string) {
        // only used if the person directly searches for the product url
        axios({
            method: "get",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: `/catalog/products/${encodeURIComponent(id)}`,
        }).then(async (response) => {
            const resp = response.data;
            setProduct(resp); // Assuming API returns products array
            console.log("Product Retrieved! ", product);
            setProdForm(
                {id: product.id, name: product.name, category: product.category,
                    brand: product.brand, album: product.album, price: product.price,
                    description: product.description, image_url: product.image_url,
                    quantity: product.quantity}
            );
        }).catch((error) => {
            if (error.response) {
                console.log('Error fetching product:', error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
    }
    useEffect(() => {
        // Reset product and fetch new data when route changes
        if (id) getProduct(id);

        console.log("Product: ", product);
    }, [id]);

    function editProduct(event: React.FormEvent) {
        // handle sending info to flask once the form is submitted
        if(id) {
            axios({
                method: "patch",
                baseURL: 'http://127.0.0.1:5000', //can replace with personal port
                url: `/catalog/products/${encodeURIComponent(id)}`,
                data: {
                    name: prodForm.name,
                    category: prodForm.category,
                    brand: prodForm.brand,
                    album: prodForm.album,
                    price: prodForm.price,
                    description: prodForm.description,
                    image_url: prodForm.image_url,
                    quantity: prodForm.quantity
                }
            }).then(async () => {
                setPopupVisible(true); // Show the popup
                setTimeout(() => setPopupVisible(false), 800); // Start fade out
                setShowForm(false);
                alert("Product Edited!");
                getProduct(id); //update the product
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

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the prodForm state whenever a field changes
        const {value, name} = event.target
        setProdForm(prevNote => ({
                ...prevNote, [name]: value
            })
        )
    }



    if (!product) return <div>Loading...</div>;



    const fieldStyle = "bg-transparent w-full mt-1 py-1 px-2 border border-camel";
    const labelStyle = "text-sm";

    return (
        <>
            {/* Breadcrumb */}
            <div className="flex flex-row text-coffee">
                <p>Merch Store</p>

                &nbsp;&nbsp;﹥

                <p>{prodForm.category}</p>

                &nbsp;&nbsp;﹥
                <p className="text-black">{prodForm.name}</p>
            </div>
            <div className={"flex flex-row items-center"}>
                {showForm ?
                    <h1 className="text-3xl grow">Editing {prodForm.name}</h1>
                :
                    <>
                    <h1 className="text-3xl grow">Viewing {prodForm.name}</h1>
                    <Button onClick={()=>{setShowForm(true)}}>
                        Edit</Button>
                    </>
                }
            </div>
            <div className="mt-4 flex flex-row h-[calc(100vh-200px)]">

                {showForm ?
                <form method={"post"}>
                    {/* Product */}
                    <div className="basis-[75%] flex flex-row">
                        {/* Product image */}
                        <div className="basis-1/3">
                            <div className="relative w-full pt-[100%] overflow-hidden">
                                <Zoom zoomMargin={60}>
                                    <img
                                        src={prodForm.image_url}
                                        alt={prodForm.name}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </Zoom>
                            </div>
                            <div>
                                <p className="mt-3 text-sm text-center">Click on image to zoom</p>
                            </div>
                            <div className="mb-4 w-full">
                                <label
                                    htmlFor={"image_url"} className={labelStyle}>Image URL</label>
                                <input
                                    id={"image_url"} name={"image_url"} value={prodForm.image_url} type={"url"}
                                    onChange={handleChange} placeholder={""} autoComplete={"on"}
                                    className={fieldStyle}/>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="basis-2/3 pl-8 pr-[80px] h-[calc(100vh-250px)] overflow-y-auto">
                            {/* Product desc + checkout */}
                            <div>
                                <div className="mb-4">
                                    <label
                                        htmlFor={"name"} className={labelStyle}>Name</label>
                                    <input
                                        id={"name"} name={"name"} value={prodForm.name} type={"text"} onChange={handleChange}
                                        placeholder={""} autoComplete={"on"}
                                        className={fieldStyle+" text-xl"}/>
                                </div>
                                <div className="mb-4 w-full">
                                    <label
                                        htmlFor={"category"} className={labelStyle}>Category</label>
                                    <input
                                        id={"category"} name={"category"} value={prodForm.category} type={"text"}
                                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                                        className={fieldStyle}/>
                                </div>
                                <div className="mb-4 w-full">
                                    <label
                                        htmlFor={"brand"} className={labelStyle}>Brand</label>
                                    <input
                                        id={"brand"} name={"brand"} value={prodForm.brand} type={"text"}
                                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                                        className={fieldStyle}/>
                                </div>
                                <div className="mb-4 w-full">
                                    <label
                                        htmlFor={"album"} className={labelStyle}>Album</label>
                                    <input
                                        id={"album"} name={"album"} value={prodForm.album} type={"text"}
                                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                                        className={fieldStyle}/>
                                </div>
                                <div className="mb-4 w-full">
                                    <label
                                        htmlFor={"price"} className={labelStyle}>Price</label>
                                    <input
                                        id={"price"} name={"price"} value={prodForm.price} type={"number"}
                                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                                        className={fieldStyle}/>
                                </div>
                                <div className="mb-4 w-full">
                                    <label
                                        htmlFor={"description"} className={labelStyle}>Description</label>
                                    <input
                                        id={"description"} name={"description"} value={prodForm.description} type={"text"}
                                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                                        className={fieldStyle}
                                    />
                                </div>

                                <div className="mb-4 w-full">
                                    <label
                                        htmlFor={"quantity"} className={labelStyle}>Quantity</label>
                                    <input
                                        id={"quantity"} name={"quantity"} value={prodForm.quantity} type={"number"}
                                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                                        className={fieldStyle}/>
                                </div>
                                <div className="mb-4 w-full grid justify-center items-center">
                                    <Button type={"submit"} buttonVariant={"clicked"} onClick={editProduct}>
                                        Save</Button>
                                    {/* Popup Notification with Fade-Out */}
                                    <div
                                        className={`absolute -top-3 -left-7 text-coffee px-3 py-1 transition-opacity duration-500 ${
                                            popupVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                        }`}
                                    > ✨Wamptastic✨
                                    </div>
                                    <Button type={"reset"} onClick={()=>{setShowForm(false)}}>
                                        Cancel</Button>
                                </div>
                        </div>


                        {/* Shipping info */}
                        <div className="mt-8 border-t border-t-camel">
                            <p className="text-xl pt-8">Shipping and Refunds</p>
                            <br />
                            <p className="">Ships within 2-3 business days from warehouses in Nigeria</p>
                            <br />
                            <p className="">Refund Policy</p>
                            <ul className="list-disc ml-10">
                                <li className="pt-2">Refunds allowed within 30 days of receipt. Must be unopened.</li>
                                <li>No exchanges</li>
                            </ul>
                        </div>
                    </div>
                </div>
                </form>


                    :

                // only show product details, no edit
                <div className="flex flex-row">
                    {/* Product image */}
                    <div className="basis-1/3">
                        <div className="relative w-full pt-[100%] overflow-hidden">
                            <Zoom zoomMargin={60}>
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </Zoom>
                        </div>
                        <div>
                            <p className="mt-3 text-right text-center">Click on image to zoom</p>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="basis-2/3 pl-8 border-r border-r-camel pr-[80px] h-[calc(100vh-250px)] overflow-y-auto scrollbar-hidden">
                        {/* Product desc + checkout */}
                        <div>
                            <h1 className="text-xl">{product.name}</h1>
                            <p className="pt-4">$ {product.price.toFixed(2)}</p>
                            <p className="pt-4 text-sm">{product.description}</p>
                            <p className="pt-3 pb-5">In stock: {product.quantity}</p>
                        </div>


                        {/* Shipping info */}
                        <div className="mt-8 border-t border-t-camel">
                            <p className="text-xl pt-8">Shipping and Refunds</p>
                            <br />
                            <p className="text-sm">Ships within 2-3 business days from warehouses in Nigeria</p>
                            <br />
                            <p className="text-sm">Refund Policy</p>
                            <ul className="text-sm list-disc ml-10">
                                <li className="pt-2">Refunds allowed within 30 days of receipt. Must be unopened.</li>
                                <li>No exchanges</li>
                            </ul>
                        </div>
                    </div>
                </div>}
            </div>
        </>
    );

    // TODO form validation to prevent empty product submissions
    // const checkValidation = () => {
    //     let errors = validation;
    //
    //     //first Name validation
    //     if (!inputValues.fName.trim()) {
    //         errors.fName = "First name is required";
    //     } else {
    //         errors.fName = "";
    //     }
    //     //last Name validation
    //     if (!inputValues.lName.trim()) {
    //         errors.lName = "Last name is required";
    //     } else {
    //         errors.lName = "";
    //     }
    //
    //     // email validation
    //     const emailCond =
    //         "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/";
    //     if (!inputValues.email.trim()) {
    //         errors.email = "Email is required";
    //     } else if (!inputValues.email.match(emailCond)) {
    //         errors.email = "Please ingress a valid email address";
    //     } else {
    //         errors.email = "";
    //     }
    //
    //     //password validation
    //     const cond1 = "/^(?=.*[a-z]).{6,20}$/";
    //     const cond2 = "/^(?=.*[A-Z]).{6,20}$/";
    //     const cond3 = "/^(?=.*[0-9]).{6,20}$/";
    //     const password = inputValues.password;
    //     if (!password) {
    //         errors.password = "password is required";
    //     } else if (password.length < 6) {
    //         errors.password = "Password must be longer than 6 characters";
    //     } else if (password.length >= 20) {
    //         errors.password = "Password must shorter than 20 characters";
    //     } else if (!password.match(cond1)) {
    //         errors.password = "Password must contain at least one lowercase";
    //     } else if (!password.match(cond2)) {
    //         errors.password = "Password must contain at least one capital letter";
    //     } else if (!password.match(cond3)) {
    //         errors.password = "Password must contain at least a number";
    //     } else {
    //         errors.password = "";
    //     }
    //
    //     //matchPassword validation
    //     if (!inputValues.confirmPassword) {
    //         errors.confirmPassword = "Password confirmation is required";
    //     } else if (inputValues.confirmPassword !== inputValues.Password) {
    //         errors.confirmPassword = "Password does not match confirmation password";
    //     } else {
    //         errors.password = "";
    //     }
    //
    //     setValidation(errors);
    // };
};

export default EditProductPage;


