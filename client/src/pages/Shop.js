import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "./Shop.css";

export const MOCK = [
  {
    _id: "1",
    name: "Rosé Dreams",
    slug: "rose-dreams",
    price: 800,
    category: "almond",
    collection: 'Everyday Glam',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/24/15/b0/2415b05294173f924453df503dc8fd7f.jpg",
        isPrimary: true,
      },
    ],
    isBestSeller: true,
    ratings: { average: 4.8, count: 124 },
    isNew: false,
  },
  {
    _id: "2",
    name: "Midnight Velvet",
    slug: "midnight-velvet",
    price: 750,
    category: "almond",
    collection: 'Special Occasion',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/77/61/1c/77611cd6c3bf2812cd02da22896f33ab.jpg",
        isPrimary: true,
      },
    ],
    isNew: true,
    ratings: { average: 4.9, count: 87 },
  },
  {
    _id: "3",
    name: "Cherry Blossom",
    slug: "cherry-blossom",
    price: 900,
    category: "almond",
    collection: 'Special Occasion',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/1a/d7/8a/1ad78aa1960137d6772aeeb7c6ced99d.jpg",
        isPrimary: true,
      },
    ],
    ratings: { average: 4.7, count: 203 },
  },
  {
    _id: "4",
    name: "Golden Hour",
    slug: "golden-hour",
    price: 600,
    category: "almond",
    collection: 'Seasonal',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/cc/79/be/cc79bebf9eae91f6ff60ed1bf189e4cf.jpg",
        isPrimary: true,
      },
    ],
    isFeatured: true,
    ratings: { average: 5.0, count: 56 },
  },
  {
    _id: "5",
    name: "Lavender Haze",
    slug: "lavender-haze",
    price: 1000,
    category: "oval",
    collection: 'Special Occasion',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/f0/76/e8/f076e8aacb0f9d3cca919b56e05b29bf.jpg",
        isPrimary: true,
      },
    ],
    isNew: true,
    ratings: { average: 4.6, count: 34 },
  },
  {
    _id: "6",
    name: "Crystal Kiss",
    slug: "crystal-kiss",
    price: 850,
    category: "almond",
    collection: 'Minimalist',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/7c/b4/e8/7cb4e85613242f12c0f2c35f23f28d8a.jpg",
        isPrimary: true,
      },
    ],
    ratings: { average: 4.9, count: 91 },
  },
  {
    _id: "7",
    name: "Nude Luxe",
    slug: "nude-luxe",
    price: 800,
    category: "almond",
    collection: 'Everyday Glam',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/95/87/83/958783df2d085a4be7eb466e3a226a0f.jpg",
        isPrimary: true,
      },
    ],
    isBestSeller: true,
    ratings: { average: 4.8, count: 178 },
  },
  {
    _id: "8",
    name: "Berry Glam",
    slug: "berry-glam",
    price: 900,
    category: "almond",
    collection: 'Seasonal',
     sizes: [   // ✅ ADD THIS
    { label: "XS" },
    { label: "S" },
    { label: "M" },
    { label: "L" },
    { label: "XL" }
  ],

    images: [
      {
        url: "https://i.pinimg.com/1200x/ab/f3/78/abf378f7f70e00fce852ee007d4c04db.jpg",
        isPrimary: true,
      },
    ],
    ratings: { average: 4.5, count: 62 },
  },
];


const CATEGORIES = [
  "all",
  "coffin",
  "almond",
  "square",
  "stiletto",
  "round",
  "oval",
  "ballerina",
  "custom",
];

const Shop = () => {
  const [selectedCollection, setSelectedCollection] = useState('');
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(MOCK);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(MOCK.length);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeCategory = category || searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    p.delete("page");
    setSearchParams(p);
  };

  useEffect(() => {
    setLoading(true);
    const params = { sort, page, limit: 12 };
    if (activeCategory !== "all") params.category = activeCategory;
    if (search) params.search = search;
    if (priceRange[0]) params.minPrice = priceRange[0];
    if (priceRange[1] < 5000) params.maxPrice = priceRange[1];
    axios
      .get("/api/products", { params })
      .then((res) => {
        if (res.data.products?.length) {
          setProducts(res.data.products);
          setTotal(res.data.total);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, sort, search, page, priceRange]);

  // const filtered = MOCK.filter(
  //   (p) =>
  //     (activeCategory === "all" || p.category === activeCategory) &&
  //     (!search || p.name.toLowerCase().includes(search.toLowerCase())),
  // );
    const filtered = MOCK.filter(p =>
  (activeCategory === 'all' || p.category === activeCategory) &&
  (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
  (p.price >= priceRange[0] && p.price <= priceRange[1]) &&
  (!selectedCollection || p.collection === selectedCollection)

);
  // const displayProducts = products.length !== MOCK.length ? products : filtered;
  const displayProducts = filtered;

  return (
    <div className="shop-page page-wrapper">
      {/* Breadcrumb */}
      <div className="shop-breadcrumb">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/shop">Shop</Link>
          {activeCategory !== "all" && (
            <>
              <span>/</span>
              <span className="breadcrumb-current">{activeCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Shop Header */}
      <div className="shop-header">
        <div className="container">
          <h1 className="shop-title">
            {search
              ? `Search: "${search}"`
              : activeCategory === "all"
                ? "All Collections"
                : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Nails`}
          </h1>
          <p className="shop-subtitle">{total} styles to love</p>
        </div>
      </div>

      <div className="container shop-layout">
        {/* Sidebar */}
        <aside className={`shop-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>Filter</h3>
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Price range */}
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-range">
              <input
                type="range"
                min="500"
                max="5000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="range-slider"
              />
              <div className="range-labels">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Collection filter */}
          {/* <div className="filter-group">
            <h4>Collection</h4>
            {[
              "Everyday Glam",
              "Special Occasion",
              "Seasonal",
              "Minimalist",
            ].map((c) => (
              <label key={c} className="filter-check">
                <input type="checkbox" /> <span>{c}</span>
              </label>
            ))}
          </div> */}
          <div className="filter-group">
  <h4>Collection</h4>
  {['Everyday Glam', 'Special Occasion', 'Seasonal', 'Minimalist'].map(c => (
    <label key={c} className="filter-check">
      <input
        type="checkbox"
        checked={selectedCollection === c}
        onChange={() => setSelectedCollection(c)}
      />
      <span>{c}</span>
    </label>
  ))}
</div>
        </aside>

        <div className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <button
              className="filter-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="10" y1="18" x2="14" y2="18" />
              </svg>
              Filters
            </button>
            <span className="results-count">
              {displayProducts.length} results
            </span>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Products */}
          {loading ? (
            <div className="products-grid">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="product-skeleton">
                    <div
                      className="skeleton"
                      style={{ height: "300px", marginBottom: "12px" }}
                    />
                    <div
                      className="skeleton"
                      style={{
                        height: "20px",
                        marginBottom: "8px",
                        width: "70%",
                      }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: "16px", width: "40%" }}
                    />
                  </div>
                ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-emoji">💅</div>
              <h3>No styles found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button
                className="btn-secondary"
                onClick={() => setSearchParams({})}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {displayProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 12 && (
            <div className="pagination">
              {Array(Math.ceil(total / 12))
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${page === i + 1 ? "active" : ""}`}
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.set("page", i + 1);
                      setSearchParams(p);
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
