import React, { useState } from 'react';
import Button from '../../components/Button.tsx';
import 'react-medium-image-zoom/dist/styles.css';
import axios from "axios";
import { useMetadata } from "../../components/MetadataContext";
import {flex_text_only_validation, number_only_validation} from "../../components/InputValidations.tsx";
import Input from "../../components/Input.tsx";
import {FormProvider, useForm} from "react-hook-form";

const AddProductPage: React.FC = () => {

    const { refreshMetadata } = useMetadata();
    const [error, setError] = useState(false);
    // addProduct form state starts with email and password as empty strings
    const [prodForm, setProdForm]
        = useState({name: "", category: "", brand: "", album: "", price: 0.00,
            description: "", image_url: "", quantity: 0});
    const methods = useForm();

    function addProduct(event: React.FormEvent) {
        setError(false);
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
        }).then(() => {
        //     TODO confirmation of product added
        //     perhaps prompt to view on merch page
            alert("Product Added!");
            setError(false);
            refreshMetadata();
            window.location.href = `/admin/inventory`;
        }).catch((error) => {
            setError(true);
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
        );
        methods.trigger(name);
    }
    function cancel(event: React.FormEvent){
        window.location.href='/admin/inventory';
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

    return (
        <div className={"min-w-full flex-grow"}>
            <FormProvider {...methods}>
            <form className="px-8 pt-6 pb-8 mb-4 w-auto h-auto grid items-center justify-center">
                <h1 className="text-3xl mb-4">Add a Product to Inventory</h1>
                <div className="mb-4">
                    <Input id={"name"} name={"name"} value={prodForm.name} type={"text"}
                           htmlFor={"name"} label={"Name"}
                           {...flex_text_only_validation({handleChange })}
                    />
                    <Input id={"category"} name={"category"} value={prodForm.category} type={"text"}
                           htmlFor={"category"} label={"Category"}
                           {...flex_text_only_validation({handleChange })}
                    />
                    <Input id={"brand"} name={"brand"} value={prodForm.brand} type={"text"}
                           htmlFor={"brand"} label={"Brand"}
                           {...flex_text_only_validation({handleChange })}
                    />
                    <Input id={"album"} name={"album"} value={prodForm.album} type={"text"}
                           htmlFor={"album"} label={"Album"}
                           {...flex_text_only_validation({handleChange })}
                    />
                    <Input id={"price"} name={"price"} value={prodForm.price} type={"number"}
                           htmlFor={"price"} label={"Price"}
                           {...number_only_validation({handleChange })}
                    />
                    <Input id={"description"} name={"description"} value={prodForm.description} type={"text"}
                           htmlFor={"description"} label={"Description"}
                           {...flex_text_only_validation({handleChange })}
                    />
                    <Input id={"image_url"} name={"image_url"} value={prodForm.image_url} type={"url"}
                           htmlFor={"image_url"} label={"Image URL"}
                           {...flex_text_only_validation({handleChange })}
                    />
                    <Input id={"quantity"} name={"quantity"} value={prodForm.quantity} type={"number"}
                           htmlFor={"quantity"} label={"Quantity"}
                           {...number_only_validation({handleChange })}
                    />
                </div>

                {error?
                    <div className="flex items-center gap-1 px-2 font-semibold text-pink text-sm bg-red-100">
                        <p className="text-sm text-pink text-balance">Error. Please confirm inputs.</p>
                    </div>
                    : <></>}
                <div className="mb-4 w-full grid justify-center items-center">
                    <Button type={"submit"} onClick={addProduct}>
                        Add Product</Button>
                </div>
                <div className="mb-4 w-full grid justify-center items-center">
                    <Button type={"reset"} onClick={cancel}>
                        Cancel</Button>
                </div>

            </form>
            </FormProvider>
        </div>
    );
};

export default AddProductPage;


