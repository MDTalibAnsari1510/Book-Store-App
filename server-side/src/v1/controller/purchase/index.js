import { Router } from 'express';
const router = Router();
import { purchaseValidation } from "./purchase.validation.js";
import { bookPurchase } from './purchase.controller.js';
//API Endpoints
router.post('/book', purchaseValidation, bookPurchase);


export default router;