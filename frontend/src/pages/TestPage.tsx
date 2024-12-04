import React, { useState, useEffect } from "react";

import { useTokenContext } from "../components/TokenContext.tsx"; // Access user token
import { Product } from "../types"; // Adjust path as needed

const TestPage: React.FC = () => {
    const { token } = useTokenContext(); // Retrieve the token



    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Test Page</h1>
            {token ? (
                <p className="text-green-500">User is logged in. TOKEN: {token}</p>
            ) : (
                <p className="text-red-500">User is not logged in.</p>
            )}


        </div>
    );
};

export default TestPage;
