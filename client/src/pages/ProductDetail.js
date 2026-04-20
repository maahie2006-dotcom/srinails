import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductReviews from "../components/ProductReviews"; // ✅ Import the Review Component
import toast from "react-hot-toast";
import "./ProductDetail.css";

const Stars = ({ rating, size = 16 }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        style={{
          color: i <= Math.round(rating || 0) ? "var(--gold)" : "var(--blush)",
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
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${slug}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Nail set not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProductData();
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error("Please select your size!");
    addToCart(product, qty, null, selectedSize);
    toast.success(`${product.name} added to your bag! 💅`);
  };

  if (loading) return <div className="luxe-loader">Curating your view...</div>;
  if (!product) return <div className="error-msg">This set is currently unavailable.</div>;

  const wished = isWishlisted(product._id);

  return (
    <div className="product-detail page-wrapper">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/shop">Shop</Link> <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      <div className="container detail-layout">
        {/* Images Section */}
        <div className="detail-images">
          <div className="detail-thumbnails">
            {product.images?.map((img, i) => (
              <button
                key={i}
                className={`thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img.url} alt={product.name} />
              </button>
            ))}
          </div>
          <div className="detail-main-img">
            <img src={product.images?.[activeImg]?.url} alt={product.name} />
            <div className="detail-badges">
              {product.isBestSeller && <span className="badge badge-bestseller">Best Seller</span>}
              {product.isNew && <span className="badge badge-new">New Arrival</span>}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="detail-info">
          <div className="detail-category">
            {product.collection} Luxe Collection
          </div>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating-row">
            <Stars rating={product.ratings?.average || 5} />
            <span className="rating-count">
              ({product.ratings?.count || 0} reviews)
            </span>
          </div>

          <div className="detail-price-row">
            <span className="price detail-price">
              ₹{product.price}
            </span>
          </div>

          <p className="detail-desc">
            {product.description || "Indulge in salon-quality artistry with our handcrafted press-on nails."}
          </p>

          {/* Sizing */}
          <div className="option-group">
            <label className="option-label">
              Select Size: <strong>{selectedSize || "Required"}</strong>
            </label>
            <div className="size-buttons">
              {['XS', 'S', 'M', 'L', 'XL'].map((label) => (
                <button
                  key={label}
                  className={`size-btn ${selectedSize === label ? "active" : ""}`}
                  onClick={() => setSelectedSize(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <div className="qty-control detail-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
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
            >
              {wished ? "♥" : "♡"}
            </button>
          </div>

          <div className="detail-trust">
            <div className="trust-badge"><span>🚚</span> <span>Free delivery on luxury sets</span></div>
            <div className="trust-badge"><span>✨</span> <span>Handcrafted Artistry</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="detail-tabs-section">
        <div className="container">
          <div className="tabs-nav">
            {["details", "inclusions", "application"].map((t) => (
              <button
                key={t}
                className={`tab-btn ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {tab === "details" && (
              <div className="tab-panel">
                <h3>Product Specifications</h3>
                <div className="detail-specs">
                  <div className="spec-row"><span>Collection</span> <span className="spec-val">{product.collection}</span></div>
                  <div className="spec-row"><span>Category</span> <span className="spec-val">{product.category}</span></div>
                  <div className="spec-row"><span>Reusable</span> <span className="spec-val">Yes, with proper care</span></div>
                </div>
              </div>
            )}
            {tab === "inclusions" && (
              <div className="tab-panel">
                <h3>What's Inside Your Luxe Box</h3>
                <ul className="inclusions-list">
                  <li><span>✓</span> 10 Handcrafted Nails</li>
                  <li><span>✓</span> Professional Nail Glue</li>
                  <li><span>✓</span> Adhesive Tabs</li>
                  <li><span>✓</span> Preparation Kit</li>
                </ul>
              </div>
            )}
            {tab === "application" && (
              <div className="tab-panel">
                <h3>How to Apply</h3>
                <p>1. Prep your natural nails by lightly buffing the surface.</p>
                <p>2. Apply glue or an adhesive tab.</p>
                <p>3. Press and hold for 30 seconds.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ NEW REVIEW SECTION: Positioned at the bottom for social proof */}
      <div className="container product-appraisals">
        <hr className="luxe-divider" />
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetail;