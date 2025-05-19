import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

// PasswordReset
// Manages both request mode (email input) and reset mode (password form)
const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const isRequestMode = !token;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validation schemas
  const requestValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const resetValidationSchema = Yup.object({
    newPassword: Yup.string().min(6, "At least 6 characters").required("Required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Required"),
  });

  // Request password reset email
  const handleRequestSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset-request`, {
        email: values.email,
      });
      toast.success("Reset email sent. Check your inbox.", { autoClose: 2000 });
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send email";
      setError(message);
      toast.error(message, { autoClose: 2000 });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  // Submit new password
  const handleResetSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset`, {
        token,
        newPassword: values.newPassword,
      });
      toast.success("Password updated. Please sign in.", { autoClose: 2000 });
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      const message = err.response?.data?.message || "Reset failed";
      setError(message);
      toast.error(message, { autoClose: 2000 });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isRequestMode ? "Reset Password" : "Set New Password"}
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {isRequestMode ? (
        // Request form
        <Formik
          initialValues={{ email: "" }}
          validationSchema={requestValidationSchema}
          onSubmit={handleRequestSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <FieldBlock
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                aria-label="Send reset link"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        // Reset form
        <Formik
          initialValues={{ newPassword: "", confirmNewPassword: "" }}
          validationSchema={resetValidationSchema}
          onSubmit={handleResetSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <FieldBlock
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter new password"
              />
              <FieldBlock
                name="confirmNewPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
              />
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                aria-label="Submit new password"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

// Reusable input block
const FieldBlock = ({ name, label, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

export default PasswordReset;
