import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../Button.tsx";
import { useOrderDialog } from "./OrderDialog.tsx";
import { useNavigate } from "react-router-dom";

interface AccountInfo {
  cc_info: string;
  expiry: string;
  cvv: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

const Checkout: React.FC = () => {
  const [accountData, setAcctData] = useState<AccountInfo>({
    cc_info: "",
    expiry: "",
    cvv: "",
    street: "",
    city: "",
    province: "",
    postal_code: "",
  });

  const [maskedCC, setMaskedCC] = useState("************");
  const [noCard, setNoCard] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEditCC, setIsEditCC] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const showOrderDialog = useOrderDialog();
  const navigate = useNavigate();

  // Centralized function to fetch user data
  const fetchAccountData = async () => {
    try {
      const userResponse = await axios.get("http://127.0.0.1:5000/user/");
      const user = userResponse.data.user;

      if (!user) {
        setNoCard(true);
        setIsFormValid(false);
        return;
      }

      const preloadedData = {
        cc_info: user.cc_info || "",
        expiry: "",
        cvv: "",
        street: user.street || "",
        city: user.city || "",
        province: user.province || "",
        postal_code: user.postal_code || "",
      };
      setAcctData(preloadedData);

      // Validate credit card
      if (user.cc_info) {
        try {
          const ccResponse = await axios.get("http://127.0.0.1:5000/user/cc", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const decodedCC = ccResponse.data.cc_info;

          if (decodedCC && decodedCC.trim().length > 0) {
            const lastFour = decodedCC.split("-")[0].slice(-4);
            setMaskedCC(`************${lastFour}`);
            setNoCard(false);
          } else {
            setMaskedCC("************");
            setNoCard(true);
          }
        } catch {
          setMaskedCC("************");
          setNoCard(true);
        }
      } else {
        setNoCard(true);
      }

      // Address validation
      const addressFieldsEmpty =
        !preloadedData.street || !preloadedData.city || !preloadedData.province || !preloadedData.postal_code;

      setIsFormValid(!(noCard && addressFieldsEmpty));
    } catch (error) {
      setNoCard(true);
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAcctData((prev) => ({ ...prev, [name]: value }));
  };

  // Edit credit card info
  const editUserCC = async (event: React.FormEvent) => {
    event.preventDefault();
    const fullCCInfo = `${accountData.cc_info}-${accountData.expiry}-${accountData.cvv}`;

    try {
      await axios.patch("http://127.0.0.1:5000/user/cc", { cc_info: fullCCInfo });
      alert("Payment Information Updated!");
      setIsEditCC(false);
      fetchAccountData();
    } catch {
      alert("Invalid Credit Card. Expected 'xxxxxxxxxxxxxxxx-mmyy-cvv'");
    }
  };

  // Edit address
  const editUserAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.patch(
        "http://127.0.0.1:5000/user/address",
        {
          street: accountData.street,
          city: accountData.city,
          province: accountData.province,
          postal_code: accountData.postal_code,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      // Print and display success message
      console.log("Server Response:", response.data);
      alert(response.data.message || "Shipping Address Updated Successfully!");
  
      setIsEditAddress(false);
      fetchAccountData();
    } catch (error: any) {
      // Handle error response and display error + rules
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
  
        const errorMessage = error.response.data.error || "Failed to update address.";
        const rules = error.response.data.rules
          ? `\nRules:\n${JSON.stringify(error.response.data.rules, null, 2)}`
          : "";
  
        alert(`${errorMessage}${rules}`);
      } else {
        // Network or unexpected errors
        console.error("Error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Place order logic
  const placeOrder = async () => {
    if (!isFormValid) {
      alert("Please ensure your payment and address information are complete.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/sale/", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await showOrderDialog();
      window.location.href = '/order-history';
      navigate("/order-history");
    } catch {
      alert("Failed to place order. Please try again.");
    }
  };

  const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
  const labelDivStyle = "mb-4 w-full";

  return (
    <div>
   
      <p className="text-2xl mb-6">Confirm your Order</p>
  
      {/* Scrollable Section */}
      <div className="overflow-y-auto h-[calc(100vh-380px)] scrollbar-hidden">
        <div className="grid gap-8">
          {/* Payment Information */}
          <div>
            <p className="text-xl mb-6">Payment Method</p>
            {isEditCC ? (
              <form onSubmit={editUserCC}>
                <div className="grid grid-cols-2 gap-4">
                  <div className={labelDivStyle}>
                    <label htmlFor="cc_info">Credit Card Number</label>
                    <input
                      id="cc_info"
                      name="cc_info"
                      type="text"
                      value={accountData.cc_info}
                      onChange={handleChange}
                      className={fieldStyle}
                      placeholder="Enter 16-digit card number"
                    />
                  </div>
                  <div className={labelDivStyle}>
                    <label htmlFor="expiry">Expiry Date (MMYY)</label>
                    <input
                      id="expiry"
                      name="expiry"
                      type="text"
                      value={accountData.expiry}
                      onChange={handleChange}
                      className={fieldStyle}
                      placeholder="MMYY"
                    />
                  </div>
                  <div className={labelDivStyle}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      value={accountData.cvv}
                      onChange={handleChange}
                      className={fieldStyle}
                      placeholder="3 digits"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <Button type="submit">Save Payment Info</Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditCC(false)}
                    className="bg-pink text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className={labelDivStyle}>
                  <label>Credit Card</label>
                  <p>{noCard ? "No card on file" : maskedCC}</p>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setIsEditCC(true);
                      setAcctData((prev) => ({
                        ...prev,
                        cc_info: "",
                        expiry: "",
                        cvv: "",
                      }));
                    }}
                  >
                    {noCard ? "Add Card" : "Update Card"}
                  </Button>
                </div>
              </div>
            )}
          </div>
  
          {/* Shipping Address */}
          <div>
            <p className="text-xl mb-6">Shipping Address</p>
            {isEditAddress ? (
              <form onSubmit={editUserAddress}>
                <div className="grid grid-cols-2 gap-4">
                  <div className={labelDivStyle}>
                    <label htmlFor="street">Street Address</label>
                    <input
                      id="street"
                      name="street"
                      type="text"
                      value={accountData.street}
                      onChange={handleChange}
                      className={fieldStyle}
                      placeholder="Street Address"
                    />
                  </div>
                  <div className={labelDivStyle}>
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={accountData.city}
                      onChange={handleChange}
                      className={fieldStyle}
                      placeholder="City"
                    />
                  </div>
                  <div className={labelDivStyle}>
                    <label htmlFor="province">Province</label>
                    <input
                      id="province"
                      name="province"
                      type="text"
                      value={accountData.province}
                      onChange={handleChange}
                      className={fieldStyle}
                      placeholder="Province"
                    />
                  </div>
                  <div className={labelDivStyle}>
                    <label htmlFor="postal_code">Postal Code</label>
                    <input
                      id="postal_code"
                      name="postal_code"
                      type="text"
                      value={accountData.postal_code}
                      onChange={handleChange}
                      className={fieldStyle}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <Button type="submit">Save Address</Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditAddress(false)}
                    className="bg-pink text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className={labelDivStyle}>
                  <label>Street Address</label>
                  <p>{accountData.street}</p>
                </div>
                <div className={labelDivStyle}>
                  <label>City</label>
                  <p>{accountData.city}</p>
                </div>
                <div className={labelDivStyle}>
                  <label>Province</label>
                  <p>{accountData.province}</p>
                </div>
                <div className={labelDivStyle}>
                  <label>Postal Code</label>
                  <p>{accountData.postal_code}</p>
                </div>
                <Button
                  className="-mt-3 w-[120px]"
                  onClick={() => setIsEditAddress(true)}
                >
                  Edit Address
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Button Outside Scrollable Section */}
      <div className="mt-2">
        <Button
          onClick={placeOrder}
          disabled={!isFormValid}
          className={`w-full py-2 ${
            isFormValid
              ? "bg-tea text-coffee hover:bg-cream"
              : "cursor-not-allowed bg-cream text-coffee hover:bg-cream hover:text-coffee"
          }`}
        >
          Place Order
        </Button>
      </div>
  </div>
  
  );
};

export default Checkout;
