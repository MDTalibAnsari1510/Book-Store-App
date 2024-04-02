import Purchase from '../../model/purchase.histroy.model.js';
import Revenue from '../../model/revenue.model.js';
import mongoose from 'mongoose';
const createBookPurchase = async (data) => {
    const created = await Purchase.create(data);
    return created;
}

const addRevenue = async (data) => {
    const created = await Revenue.insertMany(data);
    return created;
}

const fetchRevenue = async (authorsId = []) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const pipeline = [];
    if (authorsId.length > 0) {
        pipeline.push({
            $match: {
                userId: { $in: authorsId }
            }
        });
    }
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "authorInfo"
        }
    }, {
        $group: {
            _id: '$userId',
            currentMonthRevenue: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: [{ $month: '$date' }, currentMonth] },
                                { $eq: [{ $year: '$date' }, currentYear] }
                            ]
                        },
                        '$amount',
                        0
                    ]
                }
            },
            currentYearRevenue: { $sum: { $cond: [{ $eq: [{ $year: '$date' }, currentYear] }, '$amount', 0] } },
            totalAmount: { $sum: '$amount' },
            email: { $first: "$authorInfo.email" }
        }
    });
    const fetchedData = await Revenue.aggregate(pipeline);
    return fetchedData;
}

export { createBookPurchase, addRevenue, fetchRevenue }