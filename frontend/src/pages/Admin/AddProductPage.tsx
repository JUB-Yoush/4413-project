import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Product } from '../../types';
import Button from '../../components/Button.tsx';
import Suggest from '../../components/Suggest.tsx';
import QuantityControl from '../../components/QuantityControl.tsx';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useCartContext } from '../../cart/CartContext';
import axios from "axios";

const AddProductPage: React.FC = () => {
    const location = useLocation();
    const { name } = useParams<{ name: string }>();
    const [product, setProduct] = useState<Product | null>(location.state as Product);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // Default to 1
    const [popupVisible, setPopupVisible] = useState(false); // Controls visibility
    const { handleAddToCart } = useCartContext();

    // useEffect(() => {
    //     // Reset product and fetch new data when route changes
    //     const fetchProduct = async () => {
    //         if (location.state) {
    //             setProduct(location.state as Product);
    //         } else if (name) {
    //             try {
    //                 const response = await fetch(
    //                     `http://127.0.0.1:5000/catalog/products?name=${encodeURIComponent(name)}`
    //                 );
    //                 const data = await response.json();
    //                 setProduct(data.products[0]); // Assuming API returns products array
    //             } catch (error) {
    //                 console.error('Error fetching product:', error);
    //             }
    //         }
    //     };
    //
    //     // fetchProduct();
    // }, [name, location.state]);

    // if (!product) return <div>Loading...</div>;

    const handleAddToCartWrapper = async () => {
        try {
            await handleAddToCart(product, selectedQuantity); // Add product to cart
            setPopupVisible(true); // Show the popup
            setTimeout(() => setPopupVisible(false), 800); // Start fade out
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    // addProduct form state starts with email and password as empty strings
    const [prodForm, setProdForm]
        = useState({name: "", category: "", brand: "", album: "", price: 0.00,
            description: "", image_url: "", quantity: 0});

    function addProduct(event: React.FormEvent) {
        // handle sending info to flask once the form is submitted
        axios({
            method: "post",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: "/catalog/products", //flask route that handles addProduct auth
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
        }).then((response) => {
        //     TODO confirmation of product added
        //     perhaps prompt to view on merch page
            alert("Product Added!");
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })

        setProdForm(({
            name: "",
            category: "",
            brand: "",
            album: "",
            price: 0.00,
            description: "",
            image_url: "",
            quantity: 0
        }))
        event.preventDefault();
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the prodForm state whenever a field changes
        const {value, name} = event.target
        setProdForm(prevNote => ({
                ...prevNote, [name]: value
            })
        )
    }
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
    const defaultFieldFormat = "bg-transparent w-full mt-1 py-1 px-2 border border-camel";

    return (
        <div className={"min-w-full flex-grow"}>
            <form className="px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center" method={"post"}>
                <h1 className="text-3xl mb-4">Add a Product to Inventory</h1>
                <div className="mb-4">
                    <label
                        htmlFor={"name"}>Name</label>
                    <input
                        id={"name"} name={"name"} value={prodForm.name} type={"text"} onChange={handleChange}
                        placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}/>
                </div>
                <div className="mb-4 w-full">
                    <label
                        htmlFor={"category"}>Category</label>
                    <input
                        id={"category"} name={"category"} value={prodForm.category} type={"text"}
                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}/>
                </div>
                <div className="mb-4 w-full">
                    <label
                        htmlFor={"brand"}>Brand</label>
                    <input
                        id={"brand"} name={"brand"} value={prodForm.brand} type={"text"}
                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}/>
                </div>

                <div className="mb-4 w-full">
                    <label
                        htmlFor={"album"}>Album</label>
                    <input
                        id={"album"} name={"album"} value={prodForm.album} type={"text"}
                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}/>
                </div>
                <div className="mb-4 w-full">
                    <label
                        htmlFor={"price"}>Price</label>
                    <input
                        id={"price"} name={"price"} value={prodForm.price} type={"number"}
                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}/>
                </div>
                <div className="mb-4 w-full">
                    <label
                        htmlFor={"description"}>Description</label>
                    <input
                        id={"description"} name={"description"} value={prodForm.description} type={"text"}
                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}
                        pattern={"^(?=.*\d)(?=.*[a-zA-Z](?=.*[^a-zA-Z0-9]))"}/>
                </div>
                {/*<div className="mb-4 w-full">*/}
                {/*    <label*/}
                {/*        htmlFor={"image_url"}>image_url</label>*/}
                {/*    <input*/}
                {/*        id={"image_url"} name={"image_url"} value={prodForm.image_url} type={"file"}*/}
                {/*        onChange={handleChange} placeholder={""} autoComplete={"on"}*/}
                {/*        className={defaultFieldFormat}/>*/}
                {/*</div>*/}
                <div className="mb-4 w-full">
                    <label
                        htmlFor={"image_url"}>Image URL</label>
                    <input
                        id={"image_url"} name={"image_url"} value={prodForm.image_url} type={"url"}
                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}/>
                </div>
                <div className="mb-4 w-full">
                    <label
                        htmlFor={"quantity"}>Quantity</label>
                    <input
                        id={"quantity"} name={"quantity"} value={prodForm.quantity} type={"number"}
                        onChange={handleChange} placeholder={""} autoComplete={"on"}
                        className={defaultFieldFormat}/>
                </div>

                <div className="mb-4 w-full grid justify-center items-center">
                    <Button type={"submit"} onClick={addProduct}>
                        Add Product</Button>
                </div>
                <div className="mb-4 w-full grid justify-center items-center">
                    <Button type={"reset"} onClick={()=>{window.location.href='/admin';}}>
                        Cancel</Button>
                </div>

            </form>
        </div>
    );
};

export default AddProductPage;


