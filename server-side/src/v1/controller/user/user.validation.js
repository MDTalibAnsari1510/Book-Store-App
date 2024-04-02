import { body, param } from 'express-validator';

const signUpValidation = [
    body('userName').notEmpty().withMessage('userName is required.')
        .isLength({ min: 3 }).withMessage('userName must be at least 3 characters long.')
        .isString().withMessage('userName must be contain string'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{5,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),

    body('userType').optional(),
]

const logInValidation = [
    body('userName').notEmpty().withMessage('userName is required.')
        .isLength({ min: 3 }).withMessage('userName must be at least 3 characters long.')
        .isString().withMessage('userName must be contain string'),

    body('password').notEmpty().withMessage('password is required.')
]

const changePasswordValidation = [
    body('password').notEmpty().withMessage('password is required.'),
    body('newPassword').notEmpty().withMessage('changePassword is required.'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword is required.')
]

const updateProfileValidate = [
    body('email')
        .isEmail().optional()
        .withMessage('Please provide a valid email address')
];

const fetchValidation = [
    param('id').isMongoId().withMessage('Invalid id'),
];

const updateValidate = [
    param('id').isMongoId().withMessage('Invalid id'),

    body('email')
        .isEmail().optional()
        .withMessage('Please provide a valid email address')
];

export { signUpValidation, logInValidation, changePasswordValidation, updateProfileValidate, fetchValidation, updateValidate };