import React from "react";

interface HandleChangeStructure{
    handleChange?(event: React.ChangeEvent<HTMLInputElement>): void
}
export const new_pw_validation = (prop?: { handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return(
        {
            id: 'password',
            name: 'password',
            type: 'password',
            htmlFor: "password",
            label: 'Password',
            validation: {
                onChange: prop?.handleChange,
                required: {
                    value: true,
                    message: 'Required',
                },
                minLength: {
                    value: 3,
                    message: 'Min 3 characters',
                },
                maxLength: {
                    value: 20,
                    message: 'Max 20 characters',
                },
                pattern:{
                    value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{3,}$/,
                    message: 'Password must contain minimum 3 characters, \n at least one upper case letter, \n' +
                        'one lower case letter, one number and one special character'
                }
            }
        }
    );
}
export const pw_validation = (prop: HandleChangeStructure)=> {
    return(
        {
            id: 'password',
            name: 'password',
            type: 'password',
            htmlFor: "password",
            label: 'Password',
            validation: {
                onChange: prop.handleChange,
                required: {
                    value: true,
                    message: 'Required',
                },
                minLength: {
                    value: 3,
                    message: 'Min 3 characters',
                },
                maxLength: {
                    value: 20,
                    message: 'Max 20 characters',
                },
                pattern:{
                    value: /^([A-Za-z0-9#?!@$ %^&*-]).+$/,
                    message: 'Password must contain only letters, numbers or special characters'
                }
            }
        }
    );
}
export const fname_validation = (prop?: { handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) =>  {
    return(
        {
            id: 'fname',
            name: 'fname',
            type: 'fname',
            htmlFor: "fname",
            label: 'First Name',
            validation: {
                onChange: prop?.handleChange,
                required: {
                    value: true,
                    message: 'Required',
                },
                maxLength: {
                    value: 26,
                    message: 'Max 26 characters',
                },
                pattern: {
                    value: /^[A-Za-z]+(\s[A-Za-z]*)*$/,
                    message: 'Field should contain only letters and single spaces'
                }
            }
        }
    );
}
export const lname_validation = (prop?: { handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return(
        {
            id: 'lname',
            name: 'lname',
            type: 'lname',
            label: 'Last Name',
            htmlFor: 'lname',
            validation: {
                onChange: prop?.handleChange,
                required: {
                    value: true,
                    message: 'Required',
                },
                maxLength: {
                    value: 26,
                    message: 'Max 26 characters',
                },
                pattern: {
                    value: /^[A-Za-z]+(\s[A-Za-z]*)*$/,
                    message: 'Field should contain only letters and single spaces'
                }
            }
        }
    );
}
export const email_validation = (prop?: { handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return(
        {
            id: 'email',
            name: 'email',
            type: 'email',
            label: 'Email Address',
            htmlFor: 'email',
            validation: {
                onChange: prop?.handleChange,
                required: {
                    value: true,
                    message: 'Required',
                },
                maxLength: {
                    value: 26,
                    message: 'Max 26 characters',
                },
                pattern: {
                    value: /^[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?$/,
                    message: 'Email should be in this format:\n aaa@aaa.com'
                }
            }
        }
    );
}

export const province_validation = (prop?: { handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return(
        {
            id: 'province',
            name: 'province',
            type: 'province',
            htmlFor: "province",
            label: 'Province',
            validation: {
                onChange: prop?.handleChange,
                maxLength: {
                    value: 10,
                    message: 'Max 10 characters',
                },
                pattern: {
                    value: /^[A-Za-z]+(\s[A-Za-z]*)*$/,
                    message: 'Field should contain only letters and single spaces'
                }
            }
        }
    );
}
export const text_only_validation = (prop: HandleChangeStructure)=> {
    return(
        {
            validation: {
                onChange: prop.handleChange,
                maxLength: {
                    value: 26,
                    message: 'Max 26 characters',
                },
                pattern: {
                    value: /^[A-Za-z]+(\s[A-Za-z]*)*$/,
                    message: 'Field should contain only letters and single spaces'
                }
            }
        }
    );
}
export const flex_text_only_validation = (prop: HandleChangeStructure)=> {
    return(
        {
            validation: {
                onChange: prop.handleChange,
                maxLength: {
                    value: 30,
                    message: 'Max 26 characters',
                },
                pattern: {
                    value: /^[A-Za-z0-9]+(\s[A-Za-z0-9]*)*$/,
                    message: 'Field should contain only letters, numbers and single spaces'
                }
            }
        }
    );
}
export const number_only_validation = (prop: HandleChangeStructure)=> {
    return(
        {
            validation: {
                onChange: prop.handleChange,
                min: {
                    value: 0,
                    message: 'Min is 0',
                },
                max: {
                    value: 9999.99,
                    message: 'Max is 9999.99',
                }
            }
        }
    );
}
export const street_validation = (prop?: { handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return(
        {
            id: 'street',
            name: 'street',
            type: 'street',
            htmlFor: "street",
            label: 'Street Address',
            validation: {
                onChange: prop?.handleChange,
                maxLength: {
                    value: 26,
                    message: 'Max 26 characters',
                },
                pattern: {
                    value: /^[0-9]+\s([A-Za-z]+( [A-Za-z]*)*)$/,
                    message: 'Street should be in the format: 123 All St'
                }
            }
        }
    );
}
export const postal_code_validation = (prop?: { handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return(
        {
            id: 'postal_code',
            name: 'postal_code',
            type: 'postal_code',
            htmlFor: "postal_code",
            label: 'Postal Code',
            validation: {
                onChange: prop?.handleChange,
                minLength: {
                    value: 6,
                    message: 'Min 6 characters',
                },
                maxLength: {
                    value: 6,
                    message: 'Max 6 characters',
                },
                pattern: {
                    value: /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][0-9][ABCEGHJ-NPRSTV-Z][0-9]$/,
                    message: 'Invalid format. Should be A1A1A1.'
                }
            }
        }
    );
}
