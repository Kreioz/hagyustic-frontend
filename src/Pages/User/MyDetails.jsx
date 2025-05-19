import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../Redux/Slice/UserSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  getAuth,
} from "firebase/auth";
import { auth } from "../../firebase";

// MyDetails Component
// Handles viewing, updating, and linking user details securely
const MyDetails = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.data;
        setUserData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "Not provided",
          deliveryAddress: data.deliveryAddress || "Not provided",
        });

        dispatch(login({ user: data, token }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
        toast.dismiss();
        toast.error(
          err.response?.data?.message || "Failed to fetch user data",
          { autoClose: 2000 }
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token, dispatch]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword)
      return setPasswordError("Current password is required");
    if (passwordData.newPassword !== passwordData.confirmNewPassword)
      return setPasswordError("New passwords do not match");
    if (passwordData.newPassword.length < 6)
      return setPasswordError(
        "New password must be at least 6 characters long"
      );

    try {
      setPasswordLoading(true);
      setPasswordError(null);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      toast.success("Password updated successfully", { autoClose: 2000 });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password"
      );
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to update password", {
        autoClose: 2000,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLinkGoogle = async () => {
    try {
      await linkWithPopup(getAuth().currentUser, new GoogleAuthProvider());
      toast.dismiss();
      toast.success("Google account linked successfully!", { autoClose: 2000 });
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Google link failed", { autoClose: 3000 });
    }
  };

  const handleLinkFacebook = async () => {
    try {
      await linkWithPopup(getAuth().currentUser, new FacebookAuthProvider());
      toast.dismiss();
      toast.success("Facebook account linked successfully!", {
        autoClose: 2000,
      });
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Facebook link failed", { autoClose: 3000 });
    }
  };

  let address = "", city = "", postalCode = "", country = "";
try {
  const [a, b, c, d] = userData.deliveryAddress.split(", ");
  address = a || "";
  city = b || "";
  postalCode = c || "";
  country = d || "";
} catch {
  // fallback
}


  const validationSchema = Yup.object({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    postalCode: Yup.string()
      .matches(/^\d{5}(-\d{4})?$/, "Invalid postal code")
      .required("Postal code is required"),
    country: Yup.string().required("Country is required"),
    phoneNumber: Yup.string()
      .matches(/^\+?\d{9,15}$/, "Invalid phone number (e.g., +1234567890)")
      .required("Phone number is required"),
  });

  const initialValues = {
    address,
    city,
    postalCode,
    country,
    phoneNumber:
      userData.phoneNumber !== "Not provided" ? userData.phoneNumber : "",
  };

  const FieldBlock = ({ name, label, type = "text", placeholder, errors }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          errors[name]
            ? "border-red-500"
            : "border-gray-300 focus:ring-indigo-500"
        }`}
        aria-label={label}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>
    );
  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Profile Information
          </h3>
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone:</strong> {userData.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {userData.deliveryAddress}
            </p>
            <div className="space-y-2 mt-4">
              <button
                onClick={handleLinkGoogle}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Link Google
              </button>
              <button
                onClick={handleLinkFacebook}
                className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900 transition"
              >
                Link Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Update Info */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Update Contact Information
          </h3>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const cleanAddressParts = [
                  values.address?.trim() || "",
                  values.city?.trim() || "",
                  values.postalCode?.trim() || "",
                  values.country?.trim() || "",
                ];

                const deliveryAddress = cleanAddressParts.join(", ");

                const res = await axios.put(
                  `${import.meta.env.VITE_API_BASE_URL}/api/user`,
                  {
                    phoneNumber: values.phoneNumber,
                    deliveryAddress,
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                const updated = res.data.data;
                setUserData({
                  ...userData,
                  phoneNumber: updated.phoneNumber || "Not provided",
                  deliveryAddress: updated.deliveryAddress || "Not provided",
                });
                dispatch(login({ user: updated, token }));
                toast.dismiss();
                toast.success("Details updated successfully", {
                  autoClose: 2000,
                });
              } catch (err) {
                toast.dismiss();
                toast.error(
                  err.response?.data?.message || "Failed to update details",
                  { autoClose: 2000 }
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form className="space-y-4">
                <FieldBlock
                  name="address"
                  label="Address"
                  placeholder="Freedom Square 2/22"
                  errors={errors}
                />
                <FieldBlock
                  name="city"
                  label="City"
                  placeholder="Bielawa"
                  errors={errors}
                />
                <FieldBlock
                  name="postalCode"
                  label="Postal Code"
                  placeholder="58260"
                  errors={errors}
                />
                <FieldBlock
                  name="country"
                  label="Country"
                  placeholder="Poland"
                  errors={errors}
                />
                <FieldBlock
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="+48123456789"
                  errors={errors}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Details"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Password Change */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {["currentPassword", "newPassword", "confirmNewPassword"].map(
              (field, i) => (
                <input
                  key={i}
                  type="password"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  value={passwordData[field]}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
                  required
                />
              )
            )}
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyDetails;
