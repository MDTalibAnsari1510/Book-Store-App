import { fetchUser, fetchUserById, fetchUsers, createUser, updateUser } from '../../service/user.service.js';
import { validationResult } from 'express-validator';
import { TOKENEXPIRETIME, SECRET, SALT } from '../../../../config/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// User sign-up.
const signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { userName, password, email, userType } = req.body;
        if (userType == 'admin' && req?.userInfo?.userType !== 'admin') {
            return res.status(400)
                .json({
                    result: {},
                    success: false,
                    message: 'You are not authorized to create an admin user. Please contact an administrator for assistance or request appropriate permissions.',
                    errors: null
                });
        }
        const postData = {
            userName,
            email,
            password: bcrypt.hashSync(password, SALT),
            userType
        }
        const created = await createUser(postData);
        if (created) {
            const response = {
                user: created.userName,
                email: created.email,
                userStatus: created.status
            }
            return res.status(200)
                .json({
                    result: response,
                    success: true,
                    message: 'User register successfully.',
                    errors: null
                });
        } else {
            return res.status(400)
                .json({
                    result: {},
                    success: false,
                    message: 'User is not register.',
                    errors: null
                });
        }
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please choose a different username.',
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

//User Login
const logIn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const user = await fetchUser(req.body.userName);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            let token = jwt.sign({ userId: user._id, userName: user.userName, userType: user.userType }, SECRET, { expiresIn: TOKENEXPIRETIME });

            return res.status(200).json({
                result: { user: user.userName, token },
                success: true,
                message: 'Login successfully',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Please enter the correct password"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}

//User password change
const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { password, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(404).json({
                success: false,
                message: 'New password and confirm password do not match.',
            });
        } else {
            const { userName, userId } = req.userInfo
            const user = await fetchUser(userName);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    const hashPassword = bcrypt.hashSync(newPassword, SALT);
                    const updateObj = {
                        password: hashPassword
                    }
                    const updatedUser = await updateUser(userId, updateObj)
                    if (updatedUser) {
                        return res.status(200).json({
                            result: updatedUser,
                            success: true,
                            message: 'Password changed successfully',
                            errors: null
                        });
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: 'Unable to update user password.',
                            userName: user.userName,
                            token,
                        });
                    }
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Please enter the correct password"
                    });
                }
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}

const profile = async (req, res) => {
    try {
        const { userName, userId } = req.userInfo;
        const user = await fetchUser(userName)
        if (user) {
            const data = {
                user: user.userName,
                email: user.email,
                status: user.status
            }
            return res.status(200).json({
                result: data,
                success: true,
                message: "Get User profile successfully.",
                error: null
            });
        } else {
            return res.status(404).json({
                result: {},
                success: false,
                message: "User profile not found.",
                error: null
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}

const profileUpdate = async (req, res) => {
    try {
        const { email } = req.body;
        const { userName, userId } = req.userInfo;
        const updateObj = {
            email: email
        }
        const user = await updateUser(userId, updateObj)
        if (user) {
            return res.status(200).json({
                result: user,
                success: true,
                message: "User profile updated successfully.",
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: "User not found.",
                error: null
            });
        }
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please choose a different username.',
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

const users = async (req, res) => {
    try {

        const user = await fetchUsers()
        if (user) {
            return res.status(200).json({
                result: user,
                success: true,
                message: "User fetched successfully.",
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: "User not found.",
                error: null
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}

const fetchSingleUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const user = await fetchUserById(req.params.id)
        if (user) {
            return res.status(200).json({
                result: user,
                success: true,
                message: "User fetched successfully.",
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: "User not found.",
                error: null
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}

const updateSingleUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const updateObj = {
            email: req.body?.email,
            userType: req.body?.userType,
            status: req.body?.status
        }
        const user = await updateUser(req.params.id, updateObj)
        if (user) {
            return res.status(200).json({
                result: user,
                success: true,
                message: "User updated successfully.",
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: "User not found.",
                error: null
            });
        }
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please choose a different username.',
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

const deleteUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const updateObj = {
            status: 'In Active'
        }
        const user = await updateUser(req.params.id, updateObj)
        if (user) {
            return res.status(200).json({
                result: {},
                success: true,
                message: "User soft deleted successfully.",
                error: null
            });
        } else {
            return res.status(400).json({
                result: {},
                success: false,
                message: "User not found.",
                error: null
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}

// Creation of Default User.
const createDefaultUser = async (userName, password, email) => {
    try {
        const existUser = await fetchUser(userName);
        if (!existUser) {
            const userObj = {
                userName,
                password: bcrypt.hashSync(password, SALT),
                email,
                userType: 'admin'
            }
            const created = createUser(userObj);
            if (created) {
                console.log('Default user created')
            }
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: JSON.stringify(err)
        });
    }
}

export { createDefaultUser, signUp, logIn, changePassword, profile, profileUpdate, users, fetchSingleUser, updateSingleUser, deleteUser }