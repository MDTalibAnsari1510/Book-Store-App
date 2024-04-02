import { Router } from 'express';
const router = Router();
import {
    signUpValidation,
    logInValidation,
    changePasswordValidation,
    updateProfileValidate,
    fetchValidation,
    updateValidate
} from './user.validation.js';
import {
    signUp,
    logIn,
    changePassword,
    profile,
    profileUpdate,
    users,
    fetchSingleUser,
    updateSingleUser,
    deleteUser
} from './user.controller.js';
import { verifyToken, adminAccess } from '../../../../config/jwt.verify.js';

//API Endpoints
router.post('/signup', signUpValidation, signUp);
router.post('/login', logInValidation, logIn);
router.put('/change-password', verifyToken, changePasswordValidation, changePassword);
router.get('/profile', verifyToken, profile);
router.put('/profile/update', verifyToken, updateProfileValidate, profileUpdate);

// for Admin
router.post('/create', verifyToken, adminAccess, signUpValidation, signUp);
router.get('/all', verifyToken, adminAccess, users);
router.get('/:id', verifyToken, adminAccess, fetchValidation, fetchSingleUser);
router.put('/update/:id', verifyToken, adminAccess, updateValidate, updateSingleUser);
router.delete('/:id', verifyToken, adminAccess, fetchValidation, deleteUser);

export default router;