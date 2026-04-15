import { MOCK } from './Shop';
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import "./ProductDetail.css";

const MOCK_PRODUCT =
  {
    _id: "1",
    name: "Rosé Dreams",
    slug: "rose-dreams",
    price: 800,
    comparePrice: 24.99,
    category: "almond",
    description:
      "A dreamy rose-toned set with a glossy finish. Perfect for any occasion — from casual brunches to glamorous evenings.",
    images: [
      {
        url: "https://i.pinimg.com/1200x/24/15/b0/2415b05294173f924453df503dc8fd7f.jpg",
        isPrimary: true,
        alt: "Rosé Dreams nails",
      },
      {
        url: "https://i.pinimg.com/1200x/24/15/b0/2415b05294173f924453df503dc8fd7f.jpg",
        alt: "Side view",
      },
    ],
    isBestSeller: true,
    isNew: false,
    ratings: { average: 4.8, count: 124 },
    sizes: [
      { label: "XS" },
      { label: "S" },
      { label: "M" },
      { label: "L" },
      { label: "XL" },
    ],
    variants: [{ stock: 15 }, { stock: 8 }, { stock: 0 }],
    inclusions: [
      "24 nails in 12 sizes",
      "Nail glue",
      "Adhesive tabs",
      "Mini nail file",
      "Application guide",
    ],
    applicationMethod: "both",
    wearDuration: "Up to 3 weeks with glue / 7 days with tabs",
    collection: "Everyday Glam",
  };

const MOCK_REVIEWS = [
  {
    _id: "r1",
    user: { name: "Sophia M." },
    rating: 5,
    title: "Absolutely stunning!",
    comment:
      "These nails are so beautiful and lasted 3 full weeks! I'm obsessed.",
    createdAt: "2024-01-10",
    isVerifiedPurchase: true,
  },
  {
    _id: "r2",
    user: { name: "Aisha K." },
    rating: 5,
    title: "Best press-ons ever",
    comment:
      "Easy to apply and the quality is incredible. Definitely buying again!",
    createdAt: "2024-01-05",
    isVerifiedPurchase: true,
  },
  {
    _id: "r3",
    user: { name: "Emma R." },
    rating: 4,
    title: "Love the color",
    comment: "Beautiful shade, just slightly tricky to size. But worth it!",
    createdAt: "2023-12-28",
    isVerifiedPurchase: false,
  },
];

const Stars = ({ rating, size = 16 }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        style={{
          color: i <= Math.round(rating) ? "var(--gold)" : "var(--blush)",
          fontSize: size,
        }}
      >
        ★
      </span>
    ))}
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState(MOCK_PRODUCT);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");
  const wished = isWishlisted(product._id);

  // useEffect(() => {
  //   axios
  //     .get(`/api/products/${slug}`)
  //     .then((res) => setProduct(res.data))
  //     .catch(() => { });
  //   axios
  //     .get(`/api/reviews/product/${MOCK_PRODUCT._id}`)
  //     .then((res) => {
  //       if (res.data?.length) setReviews(res.data);
  //     })
  //     .catch(() => { });
  // }, [slug]);
    useEffect(() => {
  const foundProduct = MOCK.find(p => p.slug === slug);
  setProduct(foundProduct);
}, [slug]);
  const handleAddToCart = () => {
    if (!selectedSize) return toast.error("Please select a size!");
    const variant = product.variants?.[selectedVariant];
    if (variant?.stock === 0) return toast.error("This variant is sold out");
    addToCart(product, qty, variant, selectedSize);
  };

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <div className="product-detail page-wrapper">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/shop">Shop</Link> <span>/</span>
          <Link to={`/shop/${product.category}`}>{product.category}</Link>{" "}
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      <div className="container detail-layout">
        {/* Images */}
        <div className="detail-images">
          <div className="detail-thumbnails">
            {product.images?.map((img, i) => (
              <button
                key={i}
                className={`thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img.url} alt={img.alt || product.name} />
              </button>
            ))}
          </div>
          <div className="detail-main-img">
            <img src={product.images?.[activeImg]?.url} alt={product.name} />
            {wished && <div className="detail-heart">♥</div>}
            <div className="detail-badges">
              {product.isBestSeller && (
                <span className="badge badge-bestseller">Best Seller</span>
              )}
              {product.isNew && <span className="badge badge-new">New</span>}
              {/* {discount && (
                <span className="badge badge-sale">-{discount}%</span>
              )} */}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-category">
            {product.category} · {product.collection}
          </div>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating-row">
            <Stars rating={product.ratings?.average} />
            <span className="rating-num">{product.ratings?.average}</span>
            <span className="rating-count">
              ({product.ratings?.count} reviews)
            </span>
            <a href="#reviews" className="rating-link">
              Read reviews →
            </a>
          </div>

          <div className="detail-price-row">
            <span className="price detail-price">
              ₹{product.price?.toFixed(2)}
            </span>
            {/* {product.comparePrice && (
              <span className="price-compare">
                ${product.comparePrice?.toFixed(2)}
              </span>
            )} */}
            {/* {discount && (
              <span className="discount-badge">Save {discount}%</span>
            )} */}
          </div>

          <p className="detail-desc">{product.description}</p>

          {/* Size */}
          {product.sizes?.length > 0 && (
            <div className="option-group">
              {/* <label className="option-label">
                Size Kit: <strong>{selectedSize || "Select a size"}</strong>
                <Link to="/sizing" className="size-guide-link">
                  Size Guide →
                </Link>
              </label> */}
              <label className="option-label">
  Size: <strong>{selectedSize || "Select a size"}</strong>
</label>
              <div className="size-buttons">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    className={`size-btn ${selectedSize === s.label ? "active" : ""}`}
                    onClick={() => setSelectedSize(s.label)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to cart */}
          <div className="detail-actions">
            <div className="qty-control detail-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button
              className="btn-primary add-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Bag 💅
            </button>
            <button
              className={`wishlist-heart-btn ${wished ? "wished" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist"
            >
              {wished ? "♥" : "♡"}
            </button>
          </div>

          {/* Wear duration */}
          <div className="detail-wear">
            <span>⏱</span>
            <span>{product.wearDuration}</span>
          </div>

          {/* Trust badges */}
          <div className="detail-trust">
            {[
              { icon: "🚚", text: "Free shipping over ₹500" },
              { icon: "🔄", text: "30-day return policy" },
              { icon: "🔒", text: "Secure checkout" },
            ].map((t) => (
              <div key={t.text} className="trust-badge">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Details, Inclusions, Reviews */}
      <div className="detail-tabs-section">
        <div className="container">
          <div className="tabs-nav">
            {["details", "inclusions", "reviews"].map((t) => (
              <button
                key={t}
                className={`tab-btn ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "reviews"
                  ? `Reviews (${reviews.length})`
                  : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content" id="reviews">
            {tab === "details" && (
              <div className="tab-panel">
                <h3>Product Details</h3>
                <p>{product.description}</p>
                <div className="detail-specs">
                  <div className="spec-row">
                    <span>Shape</span>
                    <span className="spec-val">{product.category}</span>
                  </div>
                  <div className="spec-row">
                    <span>Collection</span>
                    <span className="spec-val">{product.collection}</span>
                  </div>
                  <div className="spec-row">
                    <span>Application</span>
                    <span className="spec-val">Glue & Adhesive Tabs</span>
                  </div>
                  <div className="spec-row">
                    <span>Wear Duration</span>
                    <span className="spec-val">{product.wearDuration}</span>
                  </div>
                </div>
              </div>
            )}
            {tab === "inclusions" && (
              <div className="tab-panel">
                <h3>What's Included</h3>
                <ul className="inclusions-list">
                  {product.inclusions?.map((inc, i) => (
                    <li key={i}>
                      <span>✓</span>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "reviews" && (
              <div className="tab-panel reviews-panel">
                <div className="reviews-summary">
                  <div className="rating-big">
                    <span className="rating-score">
                      {product.ratings?.average}
                    </span>
                    <Stars rating={product.ratings?.average} size={20} />
                    <span className="rating-total">
                      {product.ratings?.count} reviews
                    </span>
                  </div>
                </div>
                <div className="reviews-list">
                  {reviews.map((r) => (
                    <div key={r._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-avatar">
                          {r.user?.name?.[0]}
                        </div>
                        <div>
                          <strong>{r.user?.name}</strong>
                          {r.isVerifiedPurchase && (
                            <span className="verified-badge">
                              ✓ Verified Purchase
                            </span>
                          )}
                          <div className="review-date">
                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      {r.title && <h4 className="review-title">{r.title}</h4>}
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
