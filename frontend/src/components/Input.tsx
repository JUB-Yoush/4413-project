import React from 'react';
import {FieldErrors, FieldValues, useFormContext} from "react-hook-form";

// define all the input attributes
type BaseInputAttributes = React.ComponentPropsWithoutRef<"input">;

// extend the base input attributes
interface InputProps extends BaseInputAttributes {
    id: string,
    name: string,
    value: string,
    handleChange?(event: React.ChangeEvent<HTMLInputElement>): void,

    validation: {}

    label: string,
    htmlFor: string,

    className?:string,
    divClassName?: string,
    labelClassName?: string
}
const isFormInvalid = (errors: FieldErrors<FieldValues>) => {
    return Object.keys(errors).length > 0;

}
const findInputError = (errors: FieldErrors<FieldValues>, name: string) => {
    return Object.keys(errors)
        .filter(key => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, {error: errors[key]})
        }, {})
}
const InputError: React.FC<{message: string}> = ({message}) => {
    return (
        <div className="flex items-center gap-1 px-2 font-semibold text-pink text-sm bg-red-100">
            {message}
        </div>
    )
}

const Input: React.FC<InputProps> = ({ id, name, type, value,
                                         validation, handleChange,
                                         label, htmlFor, divClassName,
                                         className, labelClassName, ...rest })=> {

    const { register, formState: { errors }} = useFormContext()

    const inputError = findInputError(errors, id);
    const isInvalid = isFormInvalid(inputError);
    const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
    const labelDivStyle = "mb-4 w-full";

    // const specificError

    return (
        <div className={divClassName || labelDivStyle}>
            <label htmlFor={htmlFor} className={labelClassName||""}>{label}</label>

            {isInvalid && (<InputError message={inputError.error.message} />)}

            <input
                id={id}
                value={value}
                type={type}
                className={className || fieldStyle}
                placeholder={""} autoComplete={"on"}
                {...rest}
                {...register(id, validation)}
            />
        </div>
    )
}


export default Input;