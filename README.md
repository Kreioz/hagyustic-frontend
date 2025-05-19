# HaGyustic – eCommerce Web App

**HaGyustic** is a full-stack eCommerce application built using the MERN stack. It demonstrates real-world features such as dynamic product filtering, secure authentication, admin product management, and responsive frontend UI with Stripe and PayPal integration.

This project was built as part of a personal portfolio to showcase full-stack development capabilities with a modern tech stack.


## Features

### User Functionality

* Sign Up / Sign In (Email/Password, Google, Facebook)
* Forgot Password & Reset Flow
* Browse products by category, size, color
* Product Search with live results
* Product Detail with size, color, quantity selectors
* Add to Cart / Wishlist
* Stripe & PayPal Checkout Integration
* Order Confirmation with Discount for First-Time Users
* View Order History & Detailed Receipts
* Update Address and Phone Number
* Change Password
* Link Google/Facebook accounts to existing email login

### Admin Functionality

* Secure Admin Access
* Create, Edit, and Delete Products
* Upload & Manage Product Images (via Cloudinary)
* View and Filter All Orders
* Update Order Status (e.g., Processing, Shipped, Delivered)
* Analytics Dashboard (Revenue, Users, Products, Orders)


## Technologies Used

### Frontend

* React.js with Vite
* Tailwind CSS
* Redux Toolkit + redux-persist
* Axios
* React Router DOM
* Formik + Yup
* Firebase Authentication
* Framer Motion

### Backend

* Node.js with Express
* MongoDB with Mongoose
* Cloudinary for Image Uploads
* Stripe & PayPal SDKs
* JSON Web Tokens (JWT)
* bcryptjs for password hashing
* Express Middleware for role-based protection



## Folder Structure and Component Overview

### `/frontend`

* `src/Components/` – Reusable UI components and sections
* `src/Pages/` – Route-based screens
* `src/Redux/` – Slices and store configuration
* `src/firebase.js` – Firebase Auth setup
* `App.jsx` – Main route and layout structure
* `.env` – Frontend environment variables (see below)


* **`Components/Common/`**

  * Shared components used across the app.
  * `ProductSelectionSidebar.jsx`: Opens when users want to add a product to cart or wishlist with size/color selection.

* **`Components/Products/`**

  * Product-specific UI elements.
  * `ProductList.jsx`: Displays a grid of filtered product cards.
  * `Topbar.jsx`: Contains sorting dropdown and view toggle (grid/list).
  * `FeaturedProducts.jsx`: Highlights selected featured products on the homepage.

* **`Components/Sections/`**

  * Reusable homepage sections.
  * `HeroCarousel.jsx`: Banner carousel with category-based slides.
  * `CategoryGrid.jsx`: Shows categories like MEN, WOMEN, ACCESSORIES visually.

* **`Pages/Home.jsx`**

  * Renders the full homepage including carousel, categories, featured, product grid, and newsletter.

* **`Pages/Collection.jsx`**

  * Product listing page with filters (size, color, category), sorting, and search.

* **`Pages/ProductDetail.jsx`**

  * Full product details page with image slider, color and size selection, add to cart/wishlist options.

* **`Pages/Cart.jsx`**

  * Displays all cart items with quantity controls, total calculation, and a link to checkout.

* **`Pages/Checkout.jsx`**

  * User fills in shipping info and selects payment method (Stripe or PayPal). Handles discount for first-time users.

* **`Pages/OrderConfirmation.jsx`**

  * Shown after successful payment. Confirms order and guides user back to shopping.

* **`Pages/MyOrders.jsx`**

  * Displays order history in a clean table with order ID, date, status, total, and view link.

* **`Pages/OrderDetails.jsx`**

  * Detailed breakdown of a specific order including items, quantities, price, and shipping address.

* **`Pages/MyDetails.jsx`**

  * Shows user profile info, allows updating contact/shipping details, changing password, and linking Google/Facebook.

* **`Pages/SignInSignUp.jsx`**

  * Combined sign in and sign up form with email/password and Firebase social login (Google, Facebook).

* **`Pages/PasswordReset.jsx`**

  * Handles forgot password and set new password using token.

* **`Pages/NotFound.jsx`**

  * Displays 404 message for undefined routes.

* **`Redux/`**

  * `CartSlice.js`: Manages cart items, quantities, total price.
  * `WishlistSlice.js`: Manages wishlist items.
  * `UserSlice.js`: Manages user login state and token.
  * `Store.js`: Configures Redux store with redux-persist.

* **`firebase.js`**

  * Initializes Firebase app and exports Google and Facebook providers for social login.

* **`App.jsx` & `main.jsx`**

  * Entry point for the app and routing logic.


### `/backend`

* `controllers/` – Route handlers (products, auth, orders, etc.)
* `models/` – Mongoose schemas
* `routes/` – API endpoints
* `middleware/` – JWT auth, admin protection, error handling
* `config/` – Database and cloud setup
* `server.js` – Main entry point


## Environment Variables

### Frontend `.env`

```
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Backend `.env`

```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/hagyustic
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
```


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hagyustic.git
cd hagyustic
```

### 2. Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

### 3. Set up environment variables

* Create `.env` files in both `frontend/` and `backend/` directories
* Add the required environment variables as listed above

### 4. Start development servers

#### Backend (Port 5000)

```bash
npm run dev
```

#### Frontend (Port 5173)

```bash
npm run dev
```


## Deployment

* Frontend can be deployed to Netlify or Vercel
* Backend can be hosted on Render
* MongoDB Atlas is recommended for production database
* Stripe & PayPal webhooks can be configured using services like ngrok


## Admin Dashboard Screenshots

The HaGyustic Admin Dashboard provides complete control over the store’s operations, from analytics to product and order management. Below are the main sections with their respective functions and screenshot previews.

## Dashboard
Displays key analytics like total sales, total orders, active users, and low-stock alerts. It also includes a monthly sales chart for the past 6 months.
![Dashboard Screenshot](/public/Admindashboard.png)


## Products
Lets you add new products, edit existing ones, delete items, upload multiple images, and monitor stock levels.
![Products Screenshot](/public/Admindashboard-Products.png)

## Users
Allows viewing all registered users, including their contact details, roles, and order history access (admin view only).
![Users Screenshot](/public/Admindasboard-user.png)

## Orders
Displays all customer orders with details like order date, status, total amount, shipping address, and items purchased. Admins can update the order status here.
![Orders Screenshot](/public/Admindashbaord-Orders.png)

## Carousel
Enables you to upload and manage banner slides shown on the homepage. Each slide can have a title, image, and redirect link.
![Carousel Screenshot](/public/Admindashboard-Carousel.png)

## Author

**Hari Krishnan Nagarajan**
Full-Stack Developer (MERN) | Portfolio Project


