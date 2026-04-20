import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // ✅ Import your professional component
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedCols, setSelectedCols] = useState([]);
  const [loading, setLoading] = useState(true);

  const collections = ['Everyday Glam', 'Special Occasion', 'Seasonal', 'Minimalist'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products');
      const data = res.data.products || res.data || [];
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = products.filter(p => Number(p.price) <= priceRange);

    if (selectedCols.length > 0) {
      result = result.filter(p => 
        selectedCols.some(col => p.collection === col)
      );
    }
    setFiltered(result);
  }, [priceRange, selectedCols, products]);

  const handleToggle = (col) => {
    setSelectedCols(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="shop-page">
      <div className="shop-container">
        
        {/* SIDEBAR FILTERS */}
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h3>FILTER</h3>
            <h4>PRICE RANGE</h4>
            <input 
              type="range" 
              min="500" 
              max="5000" 
              value={priceRange} 
              className="range-slider" 
              onChange={(e) => setPriceRange(Number(e.target.value))} 
            />
            <div className="range-labels">
              <span>₹500</span>
              <span>₹{priceRange}</span>
            </div>
          </div>

          <div className="filter-group">
            <h3>COLLECTION</h3>
            <div className="collection-list">
              {collections.map(col => (
                <label key={col} className="filter-check">
                  <input 
                    type="checkbox" 
                    checked={selectedCols.includes(col)} 
                    onChange={() => handleToggle(col)} 
                  />
                  <span>{col}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID AREA */}
        <main className="product-area">
          {loading ? (
            <div className="luxe-loader">Opening Boutique... ✨</div>
          ) : filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map(product => (
                /* ✅ Use the professional component here */
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
               <span className="empty-icon">💅</span>
               <h3>No sets found</h3>
               <p>Try a different collection or price range.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;