import { Router } from 'express';
const router = Router();
import userRoute from './controller/user/index.js';
import bookRoute from './controller/book/index.js';
import purchaseRoute from './controller/purchase/index.js';
import { verifyToken } from '../../config/jwt.verify.js';

//API_routes
router.use('/user', userRoute);
router.use('/book', verifyToken, bookRoute);
router.use('/purchase', verifyToken, purchaseRoute);


export default router