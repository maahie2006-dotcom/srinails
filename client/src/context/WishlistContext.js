import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

const WishlistContext = createContext();    

const wishlistReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WISHLIST':
            return { ...state, items: action.payload, loading: false };
        case 'ADD_TO_WISHLIST':
            
            const exists = state.items.find(item => 
                (item.productId?._id || item.productId) === (action.payload.productId?._id || action.payload.productId)
            );
            if (exists) return state;
            return { ...state, items: [action.payload, ...state.items] };
        case 'REMOVE_FROM_WISHLIST':
            return { 
                ...state, 
                items: state.items.filter(item => 
                    item._id !== action.payload && 
                    item.productId?._id !== action.payload &&
                    item.productId !== action.payload
                ) 
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'CLEAR_WISHLIST':
            return { items: [], loading: false };
        default:
            return state;
    }
};

export const WishlistProvider = ({ children }) => {
    const [state, dispatch] = useReducer(wishlistReducer, { items: [], loading: true });
    const { user } = useAuth(); 

    
    const wishlistCount = state.items.length;

   
    const isWishlisted = (productId) => {
        return state.items.some(item => (item.productId?._id || item.productId) === productId);
    };

   
    const fetchWishlist = async () => {
        if (!user || !user._id) {
            dispatch({ type: 'CLEAR_WISHLIST' });
            return;
        }
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const { data } = await axios.get(`http://localhost:5000/api/wishlist/${user._id}`);
            dispatch({ type: 'SET_WISHLIST', payload: data });
        } catch (err) {
            console.error("Error fetching wishlist", err);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]); 

    
    const toggleWishlist = async (product) => {
        if (!user) {
            alert("Please login to save your favorite nails!");
            return;
        }

        if (!product || !product._id) {
            console.error("Wishlist Error: No product data provided");
            return;
        }

        const productId = product._id;
        
        if (isWishlisted(productId)) {
            
            try {
                const itemToDelete = state.items.find(item => (item.productId?._id || item.productId) === productId);
                if (itemToDelete) {
                    await axios.delete(`http://localhost:5000/api/wishlist/remove/${itemToDelete._id}`);
                    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemToDelete._id });
                }
            } catch (err) {
                console.error("Error removing from wishlist", err);
            }
        } else {
            // ADD LOGIC
            try {
                const response = await axios.post('http://localhost:5000/api/wishlist/add', { 
                    userId: user._id, 
                    productId: productId 
                });

               
                const newItem = {
                    ...response.data,
                    productId: product 
                };

                dispatch({ type: 'ADD_TO_WISHLIST', payload: newItem });
            } catch (err) {
                console.error("Error adding to wishlist", err);
            }
        }
    };

    return (
        <WishlistContext.Provider value={{ 
            state, 
            wishlist: state.items, 
            wishlistCount, 
            loading: state.loading, 
            isWishlisted, 
            toggleWishlist, 
            fetchWishlist 
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};