<<<<<<< HEAD
# 💅 SriNails — Full Stack MERN E-Commerce

A luxury press-on nails e-commerce store built with MongoDB, Express, React, and Node.js.

---

## ✨ Features

### Storefront
- 🎨 **Stunning UI** — Luxury feminine design with Playfair Display & Cormorant Garamond fonts
- 🏠 **Homepage** — Hero section, collections grid, featured products, how-it-works, testimonials, newsletter
- 🛍️ **Shop Page** — Filtering by shape/category, price range, finish type, sorting, pagination
- 🔍 **Search** — Live search by name and tags
- 💅 **Product Detail** — Image gallery, color/finish swatches, size selection, reviews tab, inclusions tab
- 🛒 **Cart** — Quantity controls, remove items, coupon code, free shipping progress bar
- 💳 **Checkout** — 3-step flow: Shipping → Payment → Review, multiple shipping options
- ❤️ **Wishlist** — Save favourite products, persisted to localStorage
- ⭐ **Reviews** — Star ratings, verified purchase badge, user photos

### User Account
- 🔐 **Auth** — Register, login, JWT-based session, 30-day token
- 👤 **Profile** — Edit name, phone; change password
- 📦 **Orders** — View all past orders with status tracking
- 🗺️ **Order Detail** — Visual progress tracker (pending → delivered), items, shipping info

### Content Pages
- 📖 **How To Apply** — Step-by-step application & removal guide, pro tips
- 💌 **Contact** — Contact form with email/Instagram/hours info
- 🌸 **About** — Brand story, values, mission

### Admin Panel
- 📊 **Dashboard** — Stats: orders, revenue, products, customers
- ➕ **Products** — Add, view, delete products with full form
- 📋 **Orders** — View all orders, update status (confirmed → shipped → delivered)

---

## 🏗️ Project Structure

```
prettynails/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js      # Sticky navbar with dropdowns, search, mobile menu
│       │   ├── Navbar.css
│       │   ├── Footer.js      # Full footer with links, social, payment icons
│       │   ├── Footer.css
│       │   ├── ProductCard.js # Product card with quick-add, wishlist
│       │   ├── ProductCard.css
│       │   ├── PrivateRoute.js
│       │   └── AdminRoute.js
│       ├── context/
│       │   ├── AuthContext.js    # JWT auth state
│       │   ├── CartContext.js    # Cart state (localStorage)
│       │   └── WishlistContext.js
│       ├── pages/
│       │   ├── Home.js / Home.css
│       │   ├── Shop.js / Shop.css
│       │   ├── ProductDetail.js / ProductDetail.css
│       │   ├── Cart.js / Cart.css
│       │   ├── Checkout.js / Checkout.css
│       │   ├── Login.js / Auth.css
│       │   ├── Register.js
│       │   ├── Account.js / Account.css
│       │   ├── Orders.js / Orders.css
│       │   ├── OrderDetail.js
│       │   ├── Wishlist.js
│       │   ├── About.js / Static.css   (also exports Contact, HowToApply)
│       │   ├── Contact.js
│       │   ├── HowToApply.js
│       │   └── admin/
│       │       ├── Dashboard.js
│       │       ├── Products.js  (also exports AdminOrders)
│       │       ├── Orders.js
│       │       └── Admin.css
│       ├── App.js             # Routes setup
│       ├── index.js
│       └── index.css          # Global styles & CSS variables
│
└── server/                    # Node/Express Backend
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   └── Review.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   ├── reviews.js
    │   ├── cart.js
    │   └── wishlist.js
    ├── middleware/
    │   └── auth.js            # JWT protect + adminOnly middleware
    ├── seed.js                # Database seeder with sample data
    ├── index.js               # Express server entry point
    ├── .env.example           # Environment variables template
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

### 1. Clone & Install

```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed the Database

```bash
cd server
node seed.js
```

This creates 8 sample products and an admin account:
- **Email:** admin@prettypressnails.com
- **Password:** admin123

### 4. Run the App

```bash
# From root — runs both server and client concurrently
npm run dev

# Or run separately:
npm run server    # Express on port 5000
npm run client    # React on port 3000
```

Visit: **http://localhost:3000**

---

## 🎨 Design System

```css
/* Color Palette */
--cream:      #fdf8f4   /* Page background */
--blush:      #f2cfc7   /* Light accents, borders */
--rose:       #d4817a   /* Primary brand color */
--deep-rose:  #a85a54   /* Hover states */
--mauve:      #8b5e6b   /* Subtle text */
--plum:       #4a2535   /* Headings, dark text */
--gold:       #c9a96e   /* Star ratings, accents */
--champagne:  #f0dfc1   /* Light gold tones */

/* Typography */
--font-display: 'Playfair Display' — headings, titles
--font-accent:  'Cormorant Garamond' — descriptions, italics
--font-body:    'Jost' — UI, labels, navigation
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user |
| PUT  | /api/auth/me | Update profile |
| PUT  | /api/auth/password | Change password |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/products | List with filters (category, price, sort, search, page) |
| GET  | /api/products/:slug | Single product |
| POST | /api/products | Create (admin) |
| PUT  | /api/products/:id | Update (admin) |
| DELETE | /api/products/:id | Soft delete (admin) |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/orders | Create order |
| GET  | /api/orders/my | My orders |
| GET  | /api/orders/:id | Single order |
| GET  | /api/orders | All orders (admin) |
| PUT  | /api/orders/:id/status | Update status (admin) |

### Reviews
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/reviews/product/:id | Product reviews |
| POST | /api/reviews | Add review |

---

## 🌐 Deployment

### Deploy to Heroku / Render / Railway

**Server:** Set these environment variables:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-frontend-url.com
PORT=5000
```

**Client:** Set proxy in package.json to your server URL, then:
```bash
cd client
npm run build
```

### Deploy to Vercel (Frontend) + Render (Backend)

1. Push to GitHub
2. Connect Vercel to your client folder
3. Connect Render to your server folder
4. Set environment variables on both platforms

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 30 days
- Admin routes protected with role middleware
- CORS configured for specific client origin
- Change `JWT_SECRET` in production!

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, React Hot Toast |
| Styling | Custom CSS with CSS Variables, Google Fonts |
| State | React Context API (Auth, Cart, Wishlist) |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Payments | Stripe (ready to integrate) |
| Uploads | Multer (ready for image upload) |

---

## 💅 Made with love for # 💅 SriNails

=======
# srinails
press-on nails website
>>>>>>> b2c6bbbe693bc05b0ec76c46a56f0bcfa5bcca6d
