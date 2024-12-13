import React, {useEffect, useState} from "react";
import {useForm, FormProvider} from "react-hook-form";
import {UserTable} from "../../components/Admin/Table.tsx";
import axios from "axios";
import Button from "../../components/Button.tsx";
import {User} from "../../types.ts";
import TableDropDown from "../../components/Admin/TableDropDown.tsx";
import {forEach} from "lodash";
import Input from "../../components/Input.tsx";
import {
    email_validation,
    fname_validation,
    lname_validation, postal_code_validation,
    province_validation, street_validation, text_only_validation
} from "../../components/InputValidations.tsx";
const Users: React.FC = () => {

    const defaultUser: User = {
        "id": "",
        "fname": "",
        "lname": "",
        "email": "",
        "password": "",
        "street": "",
        "city": "",
        "postal_code": "",
        "province": "",
        "cc_info": "",
        "decryption_key": "",
        "cart_items": [],
        "cart_total": 0.0,
    }

    const [isVisible, setIsVisible]
        = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState<User[]>([defaultUser]);

    // user to be passed to dialog box for editing
    const [user, setUser] = useState<User>(defaultUser);

    function getUsers(){
        axios({
            method: "get",
            baseURL: "http://localhost:5000",
            url: "/user/users",
        }).then((response) => {
            setUsers(response.data.users);
            collateProxiesAndUsers();
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
    }
    useEffect(()=>{getUsers()},[]);

    const defaultUserForm = {
        "id": user.id, "fname": user.fname, "lname": user.lname,
        "email": user.email, "password": user.password,
        "cc_info": user.cc_info, "street": user.street, "city": user.city,
        "province": user.province, "postal_code": user.postal_code.toUpperCase(),
        "cart_items": user.cart_items, "cart_total": user.cart_total,
    };

    const [userForm, setUserForm]
        = useState(defaultUserForm);

    useEffect(()=>{setUserForm(defaultUserForm);},[users, isVisible]);

    const closeNoSave = () =>{
        setShowForm(false);
        setUserForm(defaultUserForm);
    }

    const methods = useForm();

    const editUser = methods.handleSubmit(() => {
        // handle sending info to flask once the form is submitted
        axios({
            method: "patch",
            baseURL: 'http://127.0.0.1:5000', //can replace with personal port
            url: `/user/${user.id}`,
            data: {
                fname: userForm.fname,
                lname: userForm.lname,
                email: userForm.email,
                street: userForm.street,
                city: userForm.city,
                province: userForm.province,
                postal_code: userForm.postal_code,
            }
        }).then(async () => {
            alert("Account Edited!");
            setShowForm(false);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // handle updating the userForm state whenever a field changes
        const {value, name} = event.target;
        setUserForm(prevNote => ({
                ...prevNote, [name]: value
            })
        );
        methods.trigger(name);
    }

    // table data to be manipulated, leaving real values unchanged
    const [userProxies, setUserProxies] = useState<User[]>(
        [defaultUser]);

    const [filter, setFilter]
        = useState({column: "fname", value: defaultUser.fname});

    // show dropdown for the filter
    const [showDD, setShowDD] = useState(false);
    const toggleShowDD=(b?:boolean)=>{
        if(b) { setShowDD(true);}
        else { setShowDD(!showDD)}
    }
    /*
    * collate the hashmap of values for the dropdown
    * - unique user ids
    * - unique date
    * - unique User Email
    * - unique Purchases
    * - unique Approved
    * */

    const [ddValues, setDDValues]
        = useState({fname: [""], lname: [""], email: [""],
        street: [""], city: [""], postal_code: [""], province: [""],
        cart_total: [0]}
    ); //id: [""],  password: [""], cc_info: [""], decryption_key: [""], cart_items: [[]],
    //update userProxies and column filtering options
    const collateProxiesAndUsers = ()=>{
        // will create user Proxies from each user in users
        const temp: User[] = [];
        // store the user details for filtering
        // const tempuserIDs : string[] = [];
        const tempuserFnames : string[] = [];
        const tempuserLnames : string[] = [];
        const tempuserEmails : string[] = [];
        // const tempuserPWs : string[] = [];
        const tempuserStreets : string[] = [];
        const tempuserCities : string[] = [];
        const tempuserPostals : string[] = [];
        const tempuserProvinces : string[] = [];
        // const tempuserCCs : string[] = [];
        // const tempuserDKs : string[] = [];
        // const tempuserCartItems = [[]];
        const tempuserCartTotals : number[] = [];

        forEach(users, (u)=>{
            // const currID = u.id;
            const currFname = u.fname.toLowerCase();
            const currLname = u.lname.toLowerCase();
            const currEmail = u.email.toLowerCase();
            // const currPW = u.password;
            const currStreet = u.street.toLowerCase();
            const currCity = u.city.toLowerCase();
            const currPostal = u.postal_code.toLowerCase();
            const currProvince = u.province.toLowerCase();
            // const currCC = u.cc_info;
            // const currDK = u.decryption_key;
            // const currCartItems = u.cart_items;
            const currCartTotal = Number(u.cart_total.toFixed(2));

            temp.push({...u, cart_total: currCartTotal});

            // tempuserIDs.push(currID);
            tempuserFnames.push(currFname);
            tempuserLnames.push(currLname);
            tempuserEmails.push(currEmail);
            // tempuserPWs.push(currPW);
            tempuserStreets.push(currStreet);
            tempuserCities.push(currCity);
            tempuserPostals.push(currPostal);
            tempuserProvinces.push(currProvince);
            // tempuserCCs.push(currCC);
            // tempuserDKs.push(currDK);
            // tempuserCartItems.push(currCartItems);
            tempuserCartTotals.push(currCartTotal);
        });
        setUserProxies(temp);

        setDDValues({fname: [...new Set(tempuserFnames)], lname: [...new Set(tempuserLnames)],
                email: [...new Set(tempuserEmails)], street: [...new Set(tempuserStreets)],
            city: [...new Set(tempuserCities)], province: [...new Set(tempuserProvinces)],
            postal_code: [...new Set(tempuserPostals)], cart_total: [...new Set(tempuserCartTotals)]
           });
    }
    useEffect(()=>{collateProxiesAndUsers()},[users]);

    const [options, setOptions] = useState([""]);

    // update dropdown when filter changes
    useEffect(()=>{setOptions(ddValues[filter.column]);},[filter]);

    const handleOptionSelect=(option: string)=> {
        // manipulate users so the data is only per filter
        // option is the value that should be shown in the column
        setFilter(prevNote => ({...prevNote, ["value"]: option}) );

        const temp: User[] = [];
        forEach(users, (u)=>{
            if(u[filter.column].toLowerCase()===option.toLowerCase()) temp.push(u);
        });
        setUserProxies(temp);
    }

    const ucolumns = [
        { id: 1, header: 'First Name', accessor: 'fname' },
        { id: 2, header: 'Last Name', accessor: 'lname' },
        { id: 3, header: 'Email', accessor: 'email' },
        { id: 4, header: 'Street', accessor: 'street' },
        { id: 5, header: 'City', accessor: 'city' },
        { id: 6, header: 'Province', accessor: 'province' },
        { id: 7, header: 'Postal', accessor: 'postal_code' },
        { id: 8, header: 'Cart Total', accessor: 'cart_total' }
    ];

    const labelDivStyle = "mb-4 w-full";
    const pStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-beige border-t-camel";

    return (
        <div>
            {/*Dropdown for column filter*/}
            <TableDropDown showDD={showDD} options={options} collateProxiesAndUsers={collateProxiesAndUsers}
                           handleOptionSelect={handleOptionSelect}/>
            {isVisible ?
                <div className={"z-10 flex absolute t-0 l-0 p-10 w-9/12 h-full items-center justify-center bg-beige"}>
                    <dialog open className={"bg-beige border border-camel px-10 py-4 w-9/12 h-5/6 overflow-y-auto"}>

                        <div className={"grid grid-cols-2 mb-6"}>
                        {showForm?
                            <Button onClick={closeNoSave}>Cancel Edit</Button>
                            :
                            <Button onClick={()=>{setShowForm(true)}}>Edit</Button>
                        }
                        <Button onClick={()=>{setIsVisible(false); setShowForm(false)}}>Close</Button>
                        </div>

                        {showForm ?
                            <FormProvider {...methods}>
                            <form noValidate onSubmit={e => e.preventDefault()}>
                                <div className="grid items-center min-w-full">

                                    {/*Account Section*/}
                                    <p className={"text-3xl mb-6"}>Editing User</p>
                                    <div className={"grid grid-cols-2 gap-4"}>
                                        <Input value={userForm.fname} {...fname_validation({handleChange})}/>
                                        <Input value={userForm.lname} {...lname_validation({handleChange})}/>
                                        <Input value={userForm.email} {...email_validation({handleChange})}/>
                                    </div>

                                    {/*Shipping Address Section*/}
                                    <p className={"text-3xl mb-6 mt-4"}>Shipping Address</p>
                                    <div className={"grid grid-cols-2 gap-4 w-auto"}>
                                        <Input value={userForm.street} {...street_validation({handleChange })}/>
                                        <Input id={"city"} name={"city"} value={userForm.city} type={"text"}
                                               htmlFor={"city"} label={"City"}
                                               {...text_only_validation({handleChange })}
                                        />
                                        <Input value={userForm.province} {...province_validation({handleChange})}/>
                                        <Input value={userForm.postal_code} {...postal_code_validation({handleChange})}/>
                                    </div>
                                    <Button onClick={editUser}>Save User Edit</Button>
                                </div>
                            </form>
                            </FormProvider>


                            :

                            // only show user account details, no edit
                            <div className="grid items-center min-w-full">
                                {/*px-8 pt-6 pb-8 mb-4 h-auto w-full */}
                                {/*Account Section*/}
                                <p className={"text-3xl mb-6"}>Viewing User</p>
                                <div className={"grid grid-cols-2 gap-4"}>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"fname"} >First Name</label>
                                        <p className={pStyle}>{userForm.fname}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"lname"}>Last Name</label>
                                        <p className={pStyle}>{userForm.lname}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"email"}>Email Address</label>
                                        <p className={pStyle}>{userForm.email}</p>
                                    </div>
                                </div>

                                {/*Shipping Address Section*/}
                                <p className={"text-3xl mb-6 mt-4"}>Shipping Address</p>
                                <div className={"grid grid-cols-2 gap-4 w-auto"}>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"street"}>Street Address</label>
                                        <p className={pStyle}>{userForm.street}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"city"}>City</label>
                                        <p className={pStyle}>{userForm.city}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"province"}>Province</label>
                                        <p className={pStyle}>{userForm.province}</p>
                                    </div>
                                    <div className={labelDivStyle}>
                                        <label htmlFor={"postal_code"}>Postal Code</label>
                                        <p className={pStyle+" uppercase"}>{userForm.postal_code}</p>
                                    </div>
                                </div>
                            </div>}
                    </dialog>
                </div>
                :
                <></>
            }
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <Button onClick={getUsers}>Update table</Button>
            <UserTable columns={ucolumns} data={userProxies} setVis={setIsVisible} setUser={setUser}
                       setFilter={setFilter} toggleShowDD={toggleShowDD}/>
        </div>
    );
};

export default Users;