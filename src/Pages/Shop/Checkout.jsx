import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../Redux/Slice/CartSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import namer from "color-namer";

// Convert hex to color name
const getColorName = (hex) => {
  try {
    return namer(hex).ntc[0].name;
  } catch {
    return hex;
  }
};

const shippingOptions = [
  { value: "standard", label: "Standard (3–5 days) – €5.99", cost: 5.99 },
  { value: "express", label: "Express (1–2 days) – €9.99", cost: 9.99 },
  { value: "overnight", label: "Overnight – €14.99", cost: 14.99 },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal Code is required"),
  country: Yup.string().required("Country is required"),
  phone: Yup.string().required("Phone is required"),
  shippingMethod: Yup.string().required("Select shipping method"),
});

const FieldBlock = ({ name, label, type = "text", placeholder, errors }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md ${
        errors[name] ? "border-red-500" : "border-gray-300"
      }`}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [shippingCost, setShippingCost] = useState(5.99);
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailabl_hbyyve.webp";

  useEffect(() => {
    const checkFirstOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/has-placed-order`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsNewUser(!res.data.hasPlacedOrder);
      } catch {
        setIsNewUser(false);
      }
    };
    if (user) checkFirstOrder();
  }, [user]);

  const createOrderOnServer = async ({ values }) => {
    const token = localStorage.getItem("token");
    const discount = isNewUser ? totalPrice * 0.2 : 0;
    const grandTotal = totalPrice - discount + shippingCost;

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
      {
        user: user._id,
        items: items.map((item) => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        totalAmount: grandTotal,
        status: "Processing",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const orderId = res.data?.order?._id;
    if (!orderId) throw new Error("Order creation failed");

    localStorage.setItem("hasPlacedOrder", "true");
    setIsNewUser(false);

    return { orderId, grandTotal };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const { orderId } = await createOrderOnServer({ values });

      if (paymentMethod === "stripe") {
        const session = await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/payment/create-checkout-session`,
          { items, orderId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(clearCart());
        window.location.href = session.data.url;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const addressParts = user?.deliveryAddress?.split(", ") || [];

const initialValues = {
  name: user?.name || "",
  email: user?.email || "",
  address: addressParts[0] || "",
  city: addressParts[1] || "",
  postalCode: addressParts[2] || "",
  country: addressParts[3] || "",
  phone: user?.phoneNumber || "",
  shippingMethod: "standard",
  paymentMethod: "stripe",
};


  const discount = isNewUser ? totalPrice * 0.2 : 0;
  const grandTotal = totalPrice - discount + shippingCost;

  if (!items.length)
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <Link to="/products" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Form */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <PayPalScriptProvider
          options={{
            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
            currency: "EUR",
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors }) => (
              <Form className="space-y-4">
                <FieldBlock name="name" label="Full Name" errors={errors} />
                <FieldBlock
                  name="email"
                  label="Email"
                  errors={errors}
                  type="email"
                />
                <FieldBlock name="address" label="Address" errors={errors} />
                <FieldBlock name="city" label="City" errors={errors} />
                <FieldBlock
                  name="postalCode"
                  label="Postal Code"
                  errors={errors}
                />
                <FieldBlock name="country" label="Country" errors={errors} />
                <FieldBlock name="phone" label="Phone Number" errors={errors} />

                {/* Shipping Option */}
                <div>
                  <label className="font-medium">Shipping Method</label>
                  <Field
                    as="select"
                    name="shippingMethod"
                    className="w-full mt-1 border p-2 rounded"
                    onChange={(e) => {
                      const option = shippingOptions.find(
                        (opt) => opt.value === e.target.value
                      );
                      setShippingCost(option?.cost || 5.99);
                      setFieldValue("shippingMethod", e.target.value);
                    }}
                  >
                    {shippingOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>
                </div>

                {/* Payment Method */}
                <div className="mt-4">
                  <label className="font-medium block mb-1">
                    Payment Method
                  </label>
                  <div className="flex gap-4">
                    <label>
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                      />
                      Stripe
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                      />
                      PayPal
                    </label>
                  </div>
                </div>

                {/* Stripe Button */}
                {paymentMethod === "stripe" && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-2 rounded mt-4"
                  >
                    {isLoading ? "Processing..." : "Pay with Stripe"}
                  </button>
                )}

                {/* PayPal Button */}
                {paymentMethod === "paypal" && (
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={async (data, actions) => {
                      const { orderId, grandTotal } = await createOrderOnServer(
                        { values }
                      );
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: grandTotal.toFixed(2),
                              currency_code: "EUR",
                            },
                            custom_id: orderId,
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      await axios.post(
                        `${
                          import.meta.env.VITE_API_BASE_URL
                        }/api/payment/paypal-capture`,
                        {
                          orderId: details.purchase_units[0].custom_id,
                          paypalOrderId: details.id,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );
                      dispatch(clearCart());
                      toast.success("Payment successful!");
                      navigate("/order-confirmation");
                    }}
                    onError={(err) => {
                      toast.error("PayPal payment failed.");
                    }}
                  />
                )}
              </Form>
            )}
          </Formik>
        </PayPalScriptProvider>
      </div>

      {/* Right: Summary */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-4">
              <img
                src={item.image || fallbackImage}
                className="w-16 h-16 rounded object-contain"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} | Size: {item.size} | Color:{" "}
                  {getColorName(item.color)}
                </p>
                <p className="text-sm font-semibold">
                  €{(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>
          {isNewUser && (
            <div className="flex justify-between text-green-600">
              <span>First-time Discount (20%)</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>€{shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>€{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
