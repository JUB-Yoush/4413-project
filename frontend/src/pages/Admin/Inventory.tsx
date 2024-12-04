import React from "react";
import Button from "../../components/Button.tsx";
import AddProductPage from "./AddProductPage.tsx";
const Inventory: React.FC = () => {

    return (
        <div>
            <p>Hello from Inventory</p>
            <Button onClick={()=>{window.location.href="/admin/inventory/addProduct"}}>Add a Product</Button>
            <Button onClick=
                        {()=>{window.location.href="/admin/inventory/editProduct/DJ%20WAMP's%20Angels%20Tee"}}>
                        Edit a Product</Button>
   <AddProductPage></AddProductPage>
        </div>
    );
};

export default Inventory;