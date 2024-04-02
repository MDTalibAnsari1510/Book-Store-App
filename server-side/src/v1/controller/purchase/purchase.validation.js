import { body } from 'express-validator';

const purchaseValidation = [

    body('bookId')
        .notEmpty().withMessage('bookId is required.')
        .isString().withMessage('bookId must be contain of mongoId.')
        .isMongoId().withMessage('Invalid mongoId.'),

    body('price')
        .notEmpty().withMessage('price is required')
        .isInt({ min: 100, max: 1000 }).withMessage('Price must be between 100 and 1000'),

    body('quantity')
        .notEmpty().withMessage('quantity is required')
        .isInt().withMessage('quantity must be number'),
]
export { purchaseValidation };