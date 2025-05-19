import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Swiper styles for carousel components
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import AllRoutes from "./Routes/AllRoutes";

/**
 * App Component
 * Sets up global toast notifications and renders application routes.
 */
const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500} // Slightly faster for smoother UX
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable
        theme="colored"
      />
      <AllRoutes />
    </>
  );
};

export default App;
