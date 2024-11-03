import React from 'react';

import { forwardRef } from "react";
import { type VariantProps } from "tailwind-variants";
// import { TbLoader } from "react-icons/tb";
import {secButton, clickedButton, baseButton} from "./ButtonStyles";

// define all the button attributes
type BaseButtonAttributes = React.ComponentPropsWithoutRef<"button">;

// define the ref type
type Ref = HTMLButtonElement;

// extend the base button attributes
interface ButtonProps extends BaseButtonAttributes {
    disabled?: boolean;
    buttonStyle?: VariantProps<typeof clickedButton |typeof secButton |typeof baseButton>;
    className?:string,
    buttonVariant?: "clicked" | "sec";
}
// default values for Button {isLoading = false, disabled = false, leftIcon = undefined, rightIcon = undefined, buttonStyle = {}, buttonVariant = "clicked"}

const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
    // destructure necessary props
    const { type, children, buttonStyle,
            className, buttonVariant, disabled = false,
            ...rest } = props;

    const renderButtonVariant=()=>{
        if(buttonVariant==="clicked"){
            return clickedButton({...buttonStyle,className}); //{...buttonStyle,className}
        }
        if(buttonVariant==="sec"){
            return secButton({...buttonStyle,className});
        }
        return baseButton({...buttonStyle,className});
    }

    return (
        <button
            className={renderButtonVariant()}
            {...rest}
            type={type ? "submit" : "button"}
            ref={ref}
        >
            {children}
        </button>
    );
});

export default Button;