import { body, check, param } from 'express-validator';

const creationValidation = [

    body('title')
        .notEmpty().withMessage('title is required.')
        .isLength({ min: 3 }).withMessage('title must be at least 3 characters long.')
        .isString().withMessage('title must be contain string'),

    body('authors')
        .notEmpty().withMessage('authors is required.')
        .isArray({ min: 1 }).withMessage('authors must be contain array of mongoId.')
        .isMongoId().withMessage('Invalid mongoId.'),

    body('price')
        .notEmpty().withMessage('price is required')
        .isInt({ min: 100, max: 1000 }).withMessage('Price must be between 100 and 1000'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
]

const updationValidation = [
    param('slug')
        .notEmpty().withMessage('Title parameter is required in params')
        .isString().withMessage('title must be contain string'),

    body('title')
        .optional()
        .isLength({ min: 3 }).withMessage('title must be at least 3 characters long.')
        .isString().withMessage('title must be contain string'),

    body('authors')
        .optional()
        .isArray({ min: 1 }).withMessage('authors must be contain array of mongoId.')
        .isMongoId().withMessage('Invalid mongoId.'),

    body('price')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 100, max: 1000 }).withMessage('Price must be between 100 and 1000'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
]

const deletionValidation = [
    param('slug')
        .notEmpty().withMessage('Title parameter is required in params')
]
const publishValidation = [
    body('publish')
        .notEmpty().withMessage('Publish parameter is required')
        .isBoolean().withMessage('Publish parameter must be a boolean'),

    body('title')
        .notEmpty().withMessage('title parameter is required')
        .isString().withMessage('title parameter must be a string')
]
const getByValidation = [
    param('slug')
        .notEmpty().withMessage('Title parameter is required in params')
]

export { creationValidation, updationValidation, deletionValidation, publishValidation, getByValidation };