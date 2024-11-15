import {useState} from "react";
import { type VariantProps } from "tailwind-variants";
import {baseAlert, errorAlert, successAlert} from "./Alert.ts";
import Button from "./Button.tsx";

interface AlertProps {
    variant?: "error" | "success";
    alertStyle?: VariantProps<typeof baseAlert |typeof errorAlert |typeof successAlert>;
    message?: string;
}

export default function Alert({variant, alertStyle, message,...children}: AlertProps) {
    const [visibility, setVisibility] = useState("");

    function renderAlertVariant(){
        if(variant==="error"){
            return errorAlert({...alertStyle});
        }
        if(variant==="success"){
            return successAlert({...alertStyle});
        }
        return baseAlert({...alertStyle});
    }
    function dismissAlert(){
        setVisibility( "hidden");
    }
    return (
        <>
        {(visibility !== "hidden") && (
        <div className={"bg-black bg-opacity-25 z-10 w-full h-full absolute grid items-center justify-center"}
                onClick={dismissAlert}>
                <div className={renderAlertVariant() + " flex flex-col max-h-md text-center justify-center" +
                    " p-20"}>
                {children || message}
                <Button type={"button"} onClick={dismissAlert}>Dismiss</Button>
            </div>
        </div>)
        }
        </>
    );
}