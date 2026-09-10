# StyleCart

A full-stack e-commerce app for a clothing store, built as the final project for the Full Stack Web Development bootcamp. Users can browse products by category, manage a shopping cart, place orders, and track their order history. Admins can manage the product catalog and order statuses.

## Description

StyleCart is a full-stack application for an online clothing shop, with a React frontend and an Express/MongoDB backend. It covers user registration and authentication (JWT with access/refresh tokens), a product catalog organized by categories, a per-user shopping cart, and an order system with stock validation.

**Core features:**
- User registration and login with hashed passwords (bcrypt)
- JWT authentication with access and refresh tokens
- Role-based access control (`user` / `admin`)
- Full CRUD on products and categories (admin only for writes)
- Shopping cart tied to each user account
- Order creation with real-time stock validation and deduction
- Order history per user, and full order management for admins

## Tech Stack

- **Frontend:** React (Vite), React Router, Context API for state management, plain CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken), bcrypt for password hashing
- **Email:** Nodemailer (welcome email on signup)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/stylecart.git
   cd stylecart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   SECRET_TOKEN=your_jwt_secret
   SECRET_TOKEN_REFRESH=your_jwt_refresh_secret
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_app_password
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The API will be running at `http://localhost:4000`.

### Creating an admin user

By design, the signup endpoint always creates users with the `user` role, so no one can self-assign admin privileges. To create an admin for testing:

1. Register a normal user via `POST /api/signup`.
2. Open the `Users` collection in MongoDB Compass (or `mongosh`).
3. Manually change that user's `role` field from `"user"` to `"admin"`.
4. Log in again — the new JWT will include `role: "admin"`.

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/signup` | Register a new user | Public |
| POST | `/api/login` | Log in and receive tokens | Public |
| GET | `/api/refresh-token` | Refresh access token | Refresh token |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PATCH | `/api/user` | Update profile data | User |
| GET | `/api/user/cart` | Get current cart | User |
| POST | `/api/user/cart` | Add item to cart | User |
| PATCH | `/api/user/cart/:itemId` | Update cart item quantity | User |
| DELETE | `/api/user/cart/:itemId` | Remove item from cart | User |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | List all categories | Public |
| POST | `/api/categories` | Create a category | Admin |
| PATCH | `/api/categories/:id` | Update a category | Admin |
| DELETE | `/api/categories/:id` | Delete a category | Admin |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (supports `?category`, `?size`, `?color` filters) | Public |
| GET | `/api/products/:idProduct` | Get product details | Public |
| POST | `/api/products` | Create a product | Admin |
| PATCH | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create an order from the current cart | User |
| GET | `/api/orders/my-orders` | List the logged-in user's orders | User |
| GET | `/api/orders/:id` | Get a single order (owner or admin) | User/Admin |
| GET | `/api/orders` | List all orders | Admin |
| PATCH | `/api/orders/:id/status` | Update order status | Admin |

## Frontend Pages

| Route | Page | Auth required |
|-------|------|----------------|
| `/` | Home (featured products) | No |
| `/products` | Product listing, with category filter | No |
| `/products/:idProduct` | Product detail, add to cart | No (login required to add to cart) |
| `/login` | Log in | No |
| `/register` | Sign up | No |
| `/contact` | Contact form | No |
| `/cart` | Shopping cart | Yes |
| `/checkout` | Place an order | Yes |
| `/orders` | Order history | Yes |
| `/profile` | Edit name and address | Yes |

## Project Structure

```
backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── db/
├── services/
├── utils/
├── index.js
└── .env

frontend/
└── ecommerce-frontend/
    └── src/
        ├── components/   (Navbar, Footer, ProtectedRoute)
        ├── context/      (AuthContext, CartContext)
        ├── pages/
        ├── services/     (API calls per resource)
        └── styles/       (global CSS variables)
```

## Design Decisions

A few choices made deliberately for this project, worth explaining in case they come up:

- **State management via Context API, not Redux.** The app only needs two pieces of shared state (the logged-in user and the cart), which doesn't justify Redux's boilerplate. `AuthProvider` wraps `CartProvider` since the cart depends on the current auth token.
- **Products have a single fixed `size`/`color`/`stock`, not a variants array.** A simpler model than a full size/color variant matrix — if the same design comes in multiple colors, each is a separate product document. This keeps the schema and cart/order logic straightforward while still supporting a full multi-product catalog.
- **The signup endpoint always forces `role: "user"`.** Admin accounts are never self-assignable through the API; they're created by manually editing a user's role in the database (see "Creating an admin user" above). This avoids a privilege-escalation bug where anyone could register as an admin.
- **`priceAtPurchase` is stored on each order item.** Orders keep the price paid at checkout time, independent of later changes to a product's price, so order history stays accurate.
- **Stock validation runs in two passes.** When placing an order, the app first checks that every cart item has enough stock, and only then deducts stock and creates the order. This avoids partially deducting stock if a later item in the cart turns out to be unavailable.
- **The contact form is UI-only.** It's not wired to a real backend endpoint, since messaging isn't part of the app's core data model (`User`, `Product`, `Category`, `Order`). In a production version, it would call a Nodemailer-based endpoint (already used for the signup welcome email) or store messages in a dedicated collection.
- **The JWT access token is valid for 2 hours.** Balances security (a stolen token has a limited window) against usability (users aren't forced to re-login constantly during a session).

## Author

[Your Name](https://github.com/your-username)

## Version

1.0.0