import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Product } from '../types'; 
import Button from '../components/Button.tsx';
import Suggest from '../components/Suggest.tsx';
import QuantityControl from '../components/QuantityControl.tsx';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { addToCart, getCart } from '../cart/CartUtility'; 


const DetailPage: React.FC = () => {
    const location = useLocation();
    const { name } = useParams<{ name: string }>();
    const [product, setProduct] = useState<Product | null>(location.state as Product);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // Default to 1

    // console.log('Location State:', location.state);
    
    useEffect(() => {
        // Reset product and fetch new data when route changes
        const fetchProduct = async () => {
            if (location.state) {
                setProduct(location.state as Product);
            } else if (name) {
                try {
                    const response = await fetch(
                        `http://127.0.0.1:5000/catalog/products?name=${encodeURIComponent(name)}`
                    );
                    const data = await response.json();
                    setProduct(data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            }
        };

        fetchProduct();
    }, [name, location.state]); 

    if (!product) return <div>Loading...</div>;

    const handleAddToCart = () => {
        console.log(`Adding ${selectedQuantity} of ${product.name} to the cart.`);

        const totalPrice = selectedQuantity * product.price;

        addToCart({
            product_id: product.id,
            name: product.name,
            price: product.price,
            total_price: totalPrice,
            quantity: selectedQuantity,
            image_url: product.image_url,
        });

        console.log('Cart Contents:', getCart());
        window.location.reload();
    };

    return(
        <>
            {/* Breadcrumb */}
            <div className="pb-5 px-10 mx-5 flex flex-row items-center space-x-2 text-sm text-coffee">
                <Link to="/" className="text-sm text-coffee hover:underline">
                    Merch Store
                </Link>

                &nbsp;&nbsp;﹥
                
                <Link
                to={`/catalog/products?category=${encodeURIComponent(product.category)}`}
                className="text-sm text-coffee hover:underline">
                {product.category}
                </Link>

                 &nbsp;&nbsp;﹥
                <p className="text-sm text-black"> {product.name} </p>

            </div>


            <div className="flex flex-row px-10 mx-5 h-[calc(100vh-200px)]">



                {/* Product*/}
                <div className="basis-[75%] flex flex-row">

                    {/* Product image */}
                    <div className="basis-1/3">
                        <div className="relative w-full pt-[100%] overflow-hidden">
                            <Zoom
                            zoomMargin={60}
                            >
                            <img 
                                src={product.image_url}
                                alt={product.name} 
                                className="absolute top-0 left-0 w-full h-full object-cover" 
                                />     
                            </Zoom>
                        </div>
                        <div>
                            <p className="mt-3 text-right">Click on image to zoom</p>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="basis-2/3 pl-8 border-r border-r-camel pr-[80px]">

                        {/* Product desc + checkout */}
                        <div>
                            <h1 className="text-xl">{product.name}</h1>
                            <p className="pt-4">$ {product.price}</p>
                            <p className="pt-4 text-sm"> {product.description}</p>
                            <p className="pt-3 pb-5"> In stock: {product.quantity}</p>
                            <QuantityControl
                                quantity={selectedQuantity}
                                setQuantity={setSelectedQuantity}
                            />
                            <Button onClick={handleAddToCart}>Add to Cart</Button>
                        </div>

                        {/* Shipping info */}
                        <div className="mt-8 border-t border-t-camel">
                            <p className="text-xl pt-8">Shipping and Refunds</p>
                            <br></br>
                            <p className="text-sm">Ships within 2-3 business days from warehouses in Nigeria</p>
                            <br></br>
                            <p className="text-sm">Refund Policy</p>
                            <ul className="text-sm list-disc ml-10">
                                <li className="pt-2">Refunds allowed within 30 days of receipt. Must be unopened.</li>
                                <li>No exchanges</li>
                            </ul>

                        </div>

                    </div>

                </div>

                {/* You may also like */}
                <div className="basis-[25%]">
                    <Suggest currentCategory={product.category} currentProduct={product.id} />
                </div>

            </div>
        </>
    );
};

export default DetailPage;

