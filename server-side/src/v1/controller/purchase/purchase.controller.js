import { validationResult } from 'express-validator';
import { createBookPurchase, addRevenue, fetchRevenue } from '../../service/purchase.service.js';
import { increaseSellCount, fetchAuthorMail } from '../../service/book.service.js';
import { sendMessageToQueue } from '../../../../config/message.queue.js';
import mongoose from 'mongoose';

// Creation of Book.
const bookPurchase = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        console.log(Date.now().valueOf())
        const { bookId, price, quantity } = req.body;
        const userId = req.userInfo.userId;

        const saveToDB = {
            bookId,
            price,
            quantity,
            userId,
            purchaseId: Date.now().valueOf()
        }
        const updateSellCountFilter = {
            _id: bookId
        }
        const userEmail = [];
        const authorsUserId = [];
        const [purchaseData, updateSellCount, fetchAuthersMail] = await Promise.all([createBookPurchase(saveToDB), increaseSellCount(updateSellCountFilter, quantity), fetchAuthorMail(bookId)]);
        const generateRevenue = [];
        fetchAuthersMail.forEach(ele => {
            ele.users.forEach(elm => {
                userEmail.push({
                    email: elm.email,
                    userId: elm._id
                })
                authorsUserId.push(elm._id)
                generateRevenue.push({
                    userId: elm._id,
                    amount: price * quantity,
                    date: Date.now()

                });
            });
        });
        const revenueAdded = await addRevenue(generateRevenue);
        const getRevenue = await fetchRevenue(authorsUserId);
        getRevenue?.forEach(revenueInfo => {
            const revenue = {
                currentMonth: revenueInfo.currentMonthRevenue,
                currentYear: revenueInfo.currentYearRevenue,
                total: revenueInfo.totalAmount
            }
            sendMessageToQueue(JSON.stringify({ email: revenueInfo?.email[0], subject: 'Revenue Generate', revenue }));
        })
        if (purchaseData && updateSellCount) {
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({
                success: true,
                message: 'Book purchased successfully.',
                error: null
            });
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                result: {},
                success: false,
                message: 'Something went wrong while creating a Book',
                error: null
            });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            error: JSON.stringify(error)
        });
    }
}

export { bookPurchase }