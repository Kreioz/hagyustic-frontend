import { Route, Routes } from "react-router-dom";
import MainLayout from "Components/Layout/MainLayout";

// Pages
import Home from "Pages/Shop/Home";
import Collection from "Pages/Shop/Collection";
import SearchResults from "Pages/SearchResults";
import ProductDetail from "Pages/Shop/ProductDetail";
import Cart from "Pages/Shop/Cart";
import Wishlist from "Pages/General/Wishlist";
import Checkout from "Pages/Shop/Checkout";
import OrderConfirmation from "Pages/Shop/OrderConfirmation";

// Auth
import SignInSignUp from "Pages/Auth/SignInSignUp";
import PasswordReset from "Pages/Auth/PasswordReset";

// User
import MyOrders from "Pages/User/MyOrders";
import OrderDetails from "Pages/User/OrderDetails";
import MyDetails from "Pages/User/MyDetails";

// Admin
import AdminDashboard from "Pages/Admin/AdminDashboard";
import AdminProductCreate from "Pages/Admin/AdminProductCreate";
import AdminProductEdit from "Pages/Admin/AdminProductEdit";
import AdminCarouselCreate from "Pages/Admin/AdminCarouselCreate";
import AdminCarouselEdit from "Pages/Admin/AdminCarouselEdit";

// Static Pages
import About from "Pages/General/About";
import Contact from "Pages/General/Contactus";
import Faq from "Pages/General/Faq";
import Privacy from "Pages/General/Privacy";
import Terms from "Pages/General/Terms";
import NotFound from "Pages/General/NotFound";

import PrivateRoute from "Components/Common/PrivateRoute";

/**
 * AllRoutes Component
 * Defines all application routes and wraps each route in a shared MainLayout
 */
const AllRoutes = () => {
  // Reusable helper to wrap each route in MainLayout
  const renderRoute = (path, element) => (
    <Route path={path} element={<MainLayout>{element}</MainLayout>} />
  );

  return (
    <Routes>
      {renderRoute("/", <Home />)}
      {renderRoute("/products", <Collection />)}
      {renderRoute("/search", <SearchResults />)}
      {renderRoute("/product/:id", <ProductDetail />)}
      {renderRoute("/cart", <Cart />)}
      
      {renderRoute("/wishlist", (
        <PrivateRoute>
          <Wishlist />
        </PrivateRoute>
      ))}

      {renderRoute("/checkout", (
        <PrivateRoute>
          <Checkout />
        </PrivateRoute>
      ))}

      {renderRoute("/order-confirmation", (
        <PrivateRoute>
          <OrderConfirmation />
        </PrivateRoute>
      ))}

      {renderRoute("/signin", <SignInSignUp />)}
      {renderRoute("/password-reset", <PasswordReset />)}
      {renderRoute("/password-reset/:token", <PasswordReset />)}

      {renderRoute("/orders", (
        <PrivateRoute>
          <MyOrders />
        </PrivateRoute>
      ))}

      {renderRoute("/orders/:id", (
        <PrivateRoute>
          <OrderDetails />
        </PrivateRoute>
      ))}

      {renderRoute("/profile", (
        <PrivateRoute>
          <MyDetails />
        </PrivateRoute>
      ))}

      {renderRoute("/admin/product/create", (
        <PrivateRoute adminOnly>
          <AdminProductCreate />
        </PrivateRoute>
      ))}

      {renderRoute("/admin/product/edit/:id", (
        <PrivateRoute adminOnly>
          <AdminProductEdit />
        </PrivateRoute>
      ))}

      {renderRoute("/admin/dashboard", (
        <PrivateRoute adminOnly>
          <AdminDashboard />
        </PrivateRoute>
      ))}

      {renderRoute("/admin/carousel/create", (
        <PrivateRoute adminOnly>
          <AdminCarouselCreate />
        </PrivateRoute>
      ))}

      {renderRoute("/admin/carousel/edit/:id", (
        <PrivateRoute adminOnly>
          <AdminCarouselEdit />
        </PrivateRoute>
      ))}

      {renderRoute("/about", <About />)}
      {renderRoute("/contact", <Contact />)}
      {renderRoute("/faq", <Faq />)}
      {renderRoute("/privacy", <Privacy />)}
      {renderRoute("/terms", <Terms />)}
      {renderRoute("/notfound", <NotFound />)}

      {/* Catch-all route for unmatched URLs */}
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  );
};

export default AllRoutes;
