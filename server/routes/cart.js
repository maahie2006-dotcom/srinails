import express from 'express';
const cartRouter = express.Router();
const wishlistRouter = express.Router();
// Cart is handled client-side (localStorage) for guest + synced on login
// These endpoints serve as backup sync
cartRouter.get('/', (req, res) => res.json({ message: 'Cart is managed client-side' }));
wishlistRouter.get('/', (req, res) => res.json({ message: 'Wishlist endpoint ready' }));
export { cartRouter as default };
export { wishlistRouter };
