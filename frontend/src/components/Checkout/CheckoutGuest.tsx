import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import Button from "../../components/Button.tsx";
import Input from "../../components/Input.tsx"; 
import { useCartContext } from "../../cart/CartContext";
import { useTokenContext } from "../../components/TokenContext";
import { useOrderDialog } from "../Checkout/OrderDialog.tsx";
import { useNavigate } from "react-router-dom";
import {
  fname_validation,
  lname_validation,
  email_validation,
  new_pw_validation,
} from "../../components/InputValidations.tsx"; 

interface AccountInfo {
  fname: string;
  lname: string;
  email: string;
  password: string;
  card: string;
  expiry: string;
  cvv: string;
  street: string;
  city: string;
  province: string;
  postal: string;
}

const CheckoutGuest: React.FC = () => {
  const methods = useForm<AccountInfo>({
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      card: "",
      expiry: "",
      cvv: "",
      street: "",
      city: "",
      province: "",
      postal: "",
    },
  });

  const { handleSubmit } = methods;
  const { handleCartMergeOnLogin } = useCartContext();
  const { setToken, setUserType } = useTokenContext();
  const showOrderDialog = useOrderDialog();
  const navigate = useNavigate();


  async function onSubmit(data: AccountInfo) {
    const { fname, lname, email, password, card, expiry, cvv, street, city, province, postal } = data;
    const formattedCard = `${card}-${expiry}-${cvv}`;

    try {

      // Step 1: Submit user creation form
      await axios.post("http://127.0.0.1:5000/signup", {
        fname,
        lname,
        email,
        password,
        card: "", // Card is not stored at signup
        street,
        city,
        province,
        postal,
      });
  
      // Step 2: Automatically log in
      const loginResponse = await axios.post("http://127.0.0.1:5000/login", { email, password });
      const token = loginResponse.data.token;
      setToken(token);
      setUserType("user");
  
      // Step 3: Submit credit card details
      await axios.patch(
        "http://127.0.0.1:5000/user/cc",
        { cc_info: formattedCard },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Credit Card Saved Successfully");
  
      // Step 4: Merge cart
      await handleCartMergeOnLogin();
  
      // Step 5: Place order
      await axios.post(
        "http://127.0.0.1:5000/sale/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Order Placed Successfully");
  
      // Final Steps
      await showOrderDialog();
      navigate("/order-history");
    } catch (error: any) {
      console.error("Checkout failed:", error);
      alert(error.response?.data?.error || "An error occurred during checkout.");
    }
  }
  

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="-mt-5 text-2xl pb-5">Make an Account to Checkout</p>

          {/* Scrollable Form Section */}
          <div className="overflow-y-auto h-[calc(100vh-380px)] scrollbar-hidden">
            <div className="flex flex-row justify-between pb-10">
              <p className="text-xl">Already have an Account?</p>
              <Button className="m-0 px-10" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>

            <div className="grid gap-4">
              {/* User Fields */}
              <div className="grid grid-cols-2 gap-2">
                <Input  {...fname_validation()} />
                <Input  {...lname_validation()} />
                <Input  {...email_validation()} />
                <Input  {...new_pw_validation()} />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xl col-span-2">Shipping Address</label>
                <Input
                  id="street"
                  name="street"
                  label="Street Address"
                  htmlFor="street"
                  validation={{
                    required: "Street Address is required",
                    pattern: {
                      value: /^\d+\s[A-Za-z\s]+$/,
                      message: "Street Address must be in the format: '12 Main Street'",
                    },
                  }}
                />
                <Input
                  id="city"
                  name="city"
                  label="City"
                  htmlFor="city"
                  validation={{
                    required: "City is required",
                    pattern: { value: /^[a-zA-Z\s]+$/, message: "City must contain only letters" },
                  }}
                />
                <Input
                  id="province"
                  name="province"
                  label="Province"
                  htmlFor="province"
                  validation={{
                    required: "Province is required",
                    pattern: { value: /^[a-zA-Z\s]+$/, message: "Province must contain only letters" },
                  }}
                />
                <Input
                  id="postal"
                  name="postal"
                  label="Postal Code"
                  htmlFor="postal"
                  validation={{
                    required: "Postal Code is required",
                    pattern: {
                      value: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
                      message: "Invalid Postal Code format (e.g., A1A 1A1)",
                    },
                  }}
                />
              </div>

              {/* Payment Information */}
              <div className="grid gap-2">
                <label className="text-xl col-span-2">Payment Information</label>

                {/* Credit Card Number Validation */}
                <Input
                  id="card"
                  name="card"
                  label="Credit Card Number"
                  htmlFor="card"
                  validation={{
                    required: "Credit Card Number is required",
                    pattern: {
                      value: /^\d{16}$/, // Exactly 16 digits
                      message: "Credit Card Number must be exactly 16 digits without spaces",
                    },
                  }}
                />

                <div className="grid grid-cols-2 gap-2">
                  {/* Expiry Validation */}
                  <Input
                    id="expiry"
                    name="expiry"
                    label="Expiry (MMYY)"
                    htmlFor="expiry"
                    validation={{
                      required: "Expiry date is required",
                      pattern: {
                        value: /^\d{4}$/, // Exactly 4 digits for MMYY
                        message: "Expiry must be 4 digits (MMYY)",
                      },
                    }}
                  />

                  {/* CVV Validation */}
                  <Input
                    id="cvv"
                    name="cvv"
                    label="CVV"
                    htmlFor="cvv"
                    validation={{
                      required: "CVV is required",
                      pattern: {
                        value: /^\d{3}$/, // Exactly 3 digits
                        message: "CVV must be exactly 3 digits",
                      },
                    }}
                  />
                </div>
              </div>


            </div>
          </div>

          {/* Button Section */}
          <div className="mt-6">
            <Button type="submit" className="w-full py-2 bg-tea text-coffee">
              Place Order
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CheckoutGuest;
