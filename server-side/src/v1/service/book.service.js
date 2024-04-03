import mongoose from 'mongoose';
import Book from '../../model/book.model.js';

const createBook = async (data) => {
    const created = await Book.create(data);
    return created;
}

const updateBook = async (filter, updateData) => {
    return await Book.findOneAndUpdate(filter, updateData, { new: true });
}

const fetchBooks = async (searchKey, page = 1, size = 10, isSlub) => {
    page = parseInt(page);
    size = parseInt(size);
    const pipeline = [
        {
            $unwind: "$authors"
        },
        {
            $lookup: {
                from: "users",
                localField: "authors",
                foreignField: "_id",
                as: "authorInfo"
            }
        },
        {
            $unwind: "$authorInfo"
        },
        {
            $group: {
                _id: "$_id",
                title: { $first: "$title" },
                description: { $first: "$description" },
                price: { $first: "$price" },
                authorInfo: { $push: "$authorInfo" }
            }
        },
        {
            $project: {
                _id: 0,
                bookId: "$_id",
                title: 1,
                description: 1,
                price: 1,
                authore: "$authorInfo.userName"
            }
        }
    ];

    if (isSlub) {
        pipeline.push({
            $match: {
                title: searchKey
            }
        });
    } else {
        if (searchKey && searchKey.trim() !== "") {
            pipeline.push({
                $match: {
                    title: {
                        $regex: searchKey,
                        $options: "i"
                    }
                }
            });
        }
    }
    pipeline.push(
        {
            $skip: (page - 1) * size
        },
        {
            $limit: size
        }
    );

    const fetchedData = await Book.aggregate(pipeline);
    return fetchedData;
}

const deleteBookByTitle = async (filter) => {
    const deleted = await Book.deleteOne(filter);
    return deleted;
}

const isBookPublish = async (filter) => {
    const fetched = await Book.findOne(filter).lean();
    return fetched;
}

const increaseSellCount = async (filter, quantity) => {
    const updateSellCount = await Book.findOneAndUpdate(
        filter,
        { $inc: { sellCount: quantity } },
        { new: true }
    );
    return updateSellCount;
}

const fetchAuthorMail = async (id) => {
    const fetchAuthersData = await Book.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $unwind: "$authors"
        },
        {
            $lookup: {
                from: "users",
                localField: "authors",
                foreignField: "_id",
                as: "authorInfo"
            }
        },
        {
            $unwind: "$authorInfo"
        },
        {
            $group: {
                _id: "$_id",
                authorInfo: { $push: "$authorInfo" }

            }
        },
        {
            $project: {
                _id: 0,
                users: "$authorInfo",
            }
        }
    ]);
    return fetchAuthersData;
}

const publishBookToggle = async (filter, updateData) => {
    return await Book.findOneAndUpdate(filter, updateData, { new: true });
}

export { createBook, updateBook, fetchBooks, deleteBookByTitle, isBookPublish, increaseSellCount, fetchAuthorMail, publishBookToggle }