import User from '../../model/user.model.js';

const fetchUser = async (userName) => {
    const fetchedUser = await User.findOne({ userName }).lean();
    return fetchedUser;
}

const createUser = async (data) => {
    const created = await User.create(data);
    return created
}

const updateUser = async (id, data) => {
    const updated = await User.updateOne(
        { _id: id },
        { $set: data }
    );
    return updated;
}

const fetchUserById = async (id) => {
    const fetchedUser = await User.findById(id).lean();
    return fetchedUser;
}

const fetchUsers = async () => {
    const fetchedUser = await User.find({}).lean();
    return fetchedUser;
}

const fetchAllRetailerUsers = async () => {
    const fetchedUser = await User.aggregate([
        {
            $match: {
                userType: 'retail'
            }
        },
        {
            $project: {
                _id: 0,
                userName: 1,
                email: 1
            }
        }
    ]);
    return fetchedUser;
}

export { fetchUser, createUser, updateUser, fetchUserById, fetchUsers, fetchAllRetailerUsers }