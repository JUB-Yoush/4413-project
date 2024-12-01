const RouteNotFound = () =>{
    return(
        <div className={"flex flex-col justify-center items-center"}>
            <h1>We couldn't find the page you were looking for.</h1>
            <a href={"/"} className={"text-camel hover:font-black hover:text-lg"}>Back to Home</a>
        </div>
    )
};
export default RouteNotFound;