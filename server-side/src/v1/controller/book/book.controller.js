import { validationResult } from 'express-validator';
import { createBook, updateBook, fetchBooks, deleteBookByTitle, isBookPublish, publishBookToggle } from '../../service/book.service.js';
import { fetchAllRetailerUsers } from "../../service/user.service.js";
import { sendRevenueEmail } from '../../../../config/mailer.js';

// Creation of Book.
const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { title, description, authors, price } = req.body;

        const bookData = await createBook({ title, description, authors, price });
        if (bookData) {
            const returnObj = {
                title: bookData.title,
                description: bookData?.description,
                price: bookData.price
            }
            return res.status(200).json({
                result: returnObj,
                success: true,
                message: 'Book created successfully.',
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: 'Something went wrong while creating a Book',
                error: null
            });
        }
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'This book title already exists. Please choose a different book title.',
                error: error
            });
        } else {
            console.error('Error creating user:', error);
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
                error: JSON.stringify(error)
            });
        }
    }
}

// Updation of Book.
const update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const matchObj = {
            title: req.params.slug
        }
        const updatedData = await updateBook(matchObj, req.body)
        if (updatedData) {
            const returnObj = {
                title: updatedData.title,
                description: updatedData?.description,
                price: updatedData.price
            }
            return res.status(200).json({
                result: returnObj,
                success: true,
                message: 'Book updated successfully.',
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: 'Something went wrong while updating a Book',
                error: null
            });
        }
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'This book title already exists. Please choose a different book title.',
                error: error
            });
        } else {
            console.error('Error creating user:', error);
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
                error: JSON.stringify(error)
            });
        }
    }
}

// Fetch of Books.
const fetch = async (req, res) => {
    try {
        const searchKey = req.query.title || '';
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const fetchedData = await fetchBooks(searchKey, page, limit);
        if (fetchedData) {
            return res.status(200).json({
                result: fetchedData,
                success: true,
                message: 'Book fetched successfully.',
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: 'Something went wrong while updating a Book',
                error: null
            });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            error: JSON.stringify(error)
        });
    }
}

// Deletion of Book.
const deleteBook = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const matchObj = {
            title: req.params.slug
        }
        const deletedData = await deleteBookByTitle(matchObj);
        if (deletedData?.deletedCount) {
            return res.status(200).json({
                result: deletedData,
                success: true,
                message: 'Book deleted successfully.',
                error: null
            });
        } else if (deletedData?.deletedCount === 0) {
            return res.status(400).json({
                result: {},
                success: false,
                message: 'The book cannot be deleted because it is not available or the book title provided is incorrect.',
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: 'The book cannot be deleted as it is not available.',
                error: null
            });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            error: JSON.stringify(error)
        });
    }
}

// Fetch of Books.
const bookPublish = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const matchQuery = {
            title: req.body?.title
        }
        const updateQuery = {
            $set: {
                isPublished: req.body?.publish
            }
        }
        const fetchedData = await isBookPublish(matchQuery);
        if (req.body?.publish) {
            if (fetchedData.isPublished) {
                return res.status(200).json({
                    success: true,
                    message: 'Book Already Publish.',
                    error: null
                });
            } else {
                const [bookStatusUpdate, fetchRetailer] = await Promise.all([publishBookToggle(matchQuery, updateQuery), fetchAllRetailerUsers()]);
                fetchRetailer?.forEach(data => {
                    sendRevenueEmail({
                        email: data.email,
                        subject: 'Release New Books',
                        bookName: bookStatusUpdate.title,
                        price: bookStatusUpdate.price
                    });
                });
                if (bookStatusUpdate) {
                    return res.status(200).json({
                        success: true,
                        message: 'Book Already Publish.',
                        error: null
                    });
                } else {
                    return res.status(400).json({
                        success: true,
                        message: 'Something went wrong while publishing the book.',
                        error: null
                    });
                }
            }
        } else {
            if (fetchedData.isPublished) {
                await publishBookToggle(matchQuery, updateQuery);
                return res.status(200).json({
                    success: true,
                    message: 'Book Unpublish successfully.',
                    error: null
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Book Already Unpublish.',
                    error: null
                });
            }

        }
        return false
        if (fetchedData) {

            return res.status(200).json({
                result: fetchedData,
                success: true,
                message: 'Book fetched successfully.',
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: 'Something went wrong while updating a Book',
                error: null
            });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            error: JSON.stringify(error)
        });
    }
}

export { create, update, fetch, deleteBook, bookPublish }