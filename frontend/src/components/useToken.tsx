import { useState } from 'react';

function useToken() {
    function getToken() {
        const userToken = localStorage.getItem("token");
        return userToken && userToken
    }

    const [token, setToken] = useState(getToken());

    function saveToken(userToken:string) {
        localStorage.setItem("token", userToken);
        setToken(userToken);
    }

    function removeToken() {
        localStorage.removeItem("token");
        setToken(null);
        setTimeout(()=>{window.location.href = "/";},1000); //redirect to merch page
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}

export default useToken;