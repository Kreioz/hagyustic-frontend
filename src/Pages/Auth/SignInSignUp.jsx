import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import {
  signInWithPopup,
  getRedirectResult,
  linkWithCredential,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../../firebase";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Slice/UserSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { Sparkles, Flame, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

let pendingCred = null;

const methodMap = {
  "google.com": "Google",
  "facebook.com": "Facebook",
  password: "Email & Password",
};

const SignInSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const validationSchema = Yup.object(
    isSignUp
      ? {
          name: Yup.string().required("Name is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string().min(6).required("Password is required"),
        }
      : {
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string().min(6).required("Password is required"),
        }
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isSignUp
        ? `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`
        : `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

      const payload = isSignUp
        ? values
        : { email: values.email, password: values.password };

      const response = await axios.post(url, payload);
      const { token } = response.data;
      localStorage.setItem("token", token);

      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(login({ user: userResponse.data.user, token }));
      toast.success(isSignUp ? "Account created" : "Login successful", {
        autoClose: 2000,
      });
      navigate(isSignUp ? "/signin" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed", {
        autoClose: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFirebaseLogin = async (provider) => {
    try {
      setIsRedirecting(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();
      const providerId = provider.providerId.split(".")[0];

      const userData = {
        name: user.displayName || "Unknown",
        email: user.email || `${user.uid}@${providerId}.com`,
        provider: providerId,
        providerId: user.uid,
        idToken,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/social-login`,
        userData
      );

      const { token } = response.data;

      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", token);
      dispatch(login({ user: userResponse.data.user, token }));
      toast.success("Login successful", { autoClose: 2000 });
      navigate("/");
    } catch (error) {
      console.error("Firebase login error:", error);
      toast.error(error.message || "Social login failed", { autoClose: 3000 });
    } finally {
      setIsRedirecting(false);
    }
  };

  const FieldBlock = ({ name, label, type = "text" }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Field
        name={name}
        type={type}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden w-full">
      {/* Branding Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-[40%] bg-gray-300 flex items-center justify-center flex-col p-10"
      >
        <div className="space-y-4 text-gray-900 max-w-xs text-center">
          <div className="text-4xl logo-font font-bold uppercase tracking-tighter">
            HaGyustic
          </div>
          <p className="flex items-center justify-center gap-2 text-base leading-relaxed">
            <Sparkles className="text-purple-400" size={20} />
            Your style, your story.
          </p>
          <p className="flex items-center justify-center gap-2 text-base leading-relaxed">
            <Flame className="text-pink-400" size={20} />
            Explore top trends.
          </p>
          <p className="flex items-center justify-center gap-2 text-base leading-relaxed">
            <ShoppingBag className="text-emerald-400" size={20} />
            Shop with confidence.
          </p>
        </div>
      </motion.div>

      {/* Form Section */}
      <div className="w-full md:w-[60%] flex items-center justify-center px-4 py-6 md:py-12 overflow-x-hidden">
        {isRedirecting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <ClipLoader color="#6D28D9" size={45} />
            <span className="ml-3 text-white text-lg">Redirecting...</span>
          </div>
        )}

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <Formik
            initialValues={
              isSignUp
                ? { name: "", email: "", password: "" }
                : { email: "", password: "" }
            }
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                {isSignUp && <FieldBlock name="name" label="Name" />}
                <FieldBlock name="email" label="Email" type="email" />
                <FieldBlock name="password" label="Password" type="password" />
                {!isSignUp && (
                  <div className="text-right">
                    <Link
                      to="/password-reset"
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-md hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isSignUp
                    ? "Sign Up"
                    : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-600 hover:underline ml-1"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Or sign in with:</p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <div className="flex items-center justify-center gap-4 mt-6">
                {/* Google Icon Button */}
                <button
                  onClick={() => handleFirebaseLogin(googleProvider)}
                  className="w-12 h-12 rounded-full border border-gray-300 hover:border-red-500 hover:shadow-md transition flex items-center justify-center"
                  aria-label="Sign in with Google"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                </button>

                {/* Facebook Icon Button */}
                <button
                  onClick={() => handleFirebaseLogin(facebookProvider)}
                  className="w-12 h-12 rounded-full border border-gray-300 hover:border-blue-600 hover:shadow-md transition flex items-center justify-center"
                  aria-label="Sign in with Facebook"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
