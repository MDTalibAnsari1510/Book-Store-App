import { Router } from 'express';
const router = Router();
import { adminAccess, adminOrAuthorAcess } from '../../../../config/jwt.verify.js';
import { creationValidation, updationValidation, publishValidation, deletionValidation, getByValidation } from './book.validation.js'
import { create, update, fetch, fetchBySlug, deleteBook, bookPublish } from './book.controller.js'

//API Endpoints
router.post('/create', adminOrAuthorAcess, creationValidation, create);
router.put('/:slug', adminOrAuthorAcess, updationValidation, update);
router.put('/make/publish', adminOrAuthorAcess, publishValidation, bookPublish);
router.get('/fetch', fetch);
router.get('/fetch/:slug', getByValidation, fetchBySlug);
router.delete('/:slug', adminAccess, deletionValidation, deleteBook);


export default router;