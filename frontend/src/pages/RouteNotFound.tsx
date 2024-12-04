interface goTo{
    url: string;
    label: string;
}
const RouteNotFound = ({url,label}: goTo) =>{
    return(
        <div className={"flex flex-col justify-center items-center"}>
            <h1>We couldn't find the page you were looking for.</h1>
            <a href={url} className={"text-camel hover:font-black hover:text-lg"}>{label}</a>
        </div>
    )
};
export default RouteNotFound;