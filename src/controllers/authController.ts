
const User = require('../models/user'); // Import the User model
const createHTTPError = require('http-errors'); // Import http-errors for creating HTTP errors
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const config = require('../config/config');

const register = async (req: any, res: any, next: any) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return next(createHTTPError(400, "All fields are required!"));
        }

        const isUserPresent = await User.findOne({ email });
        if (isUserPresent) {
            return next(createHTTPError(400, "User already exists!"));
        }
        const newUser = new User({ name, email, phone, password });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: newUser,
        });
    } catch (error) {
        return next(error);
    }
};


const login = async (req: any, res: any, next: any) => {
    // Logic for user login
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = createHTTPError(400, 'All fields are required!');
            return next(error);
        }
        const isUserPresent = await User.findOne({ email });
        console.log("isUserPresent", isUserPresent);

        if (!isUserPresent) {
            const error = createHTTPError(401, 'Invalid Credentials!');
            return next(error);
        }
        const isPassWordMatched = await bcrypt.compare(password, isUserPresent.password);
        console.log("isPassWordMatched", isPassWordMatched);
        if (!isPassWordMatched) {
            const error = createHTTPError(401, 'Invalid Credentials!');
            return next(error);
        }
        const token = jwt.sign({ id: isUserPresent._id }, config.accessTokenSecret, { expiresIn: '1d' });
        // In development, `secure` cookies can't be set on http://localhost. Use secure only in production
        const cookieOpts = {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        };
        res.cookie('access_token', token, cookieOpts); // Set the token as a cookie
        res.status(200).json({ success: true, message: 'User logged in successfully!', data: isUserPresent });
    } catch (error) {
        return next(error); // Pass the error to the global error handler
    }
}

const getUser = async (req: any, res: any, next: any) => {
    // Logic for getting user details
    try {
        const user = await User.findById(req.user._id); // Find the user by ID
        if (!user) {
            const error = createHTTPError(404, 'User not found!');
            return next(error);
        }
        res.status(200).json({ success: true, message: 'User details fetched successfully!', data: user });
    } catch (error) {
        return next(error); // Pass the error to the global error handler
    }
}

const updateUser = async (req: any, res: any, next: any) => {
    try {
        const { name, phone, password, role, company } = req.body;

        const updates: any = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (role) updates.role = role;
        if (company) updates.company = company;

        if (password) {
            updates.password = password;
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true, // ✅ enforce schema validation
        });

        if (!user) {
            const error = createHTTPError(404, "User not found!");
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: user,
        });
    } catch (error) {
        return next(error);
    }
};


const logout = async (req: any, res: any, next: any) => {
    // Logic for user logout
    try {
        // Use the same attributes when clearing cookie for reliability
        const cookieOpts = { httpOnly: true, secure: config.nodeEnv === 'production', sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax', };
        res.clearCookie('access_token', cookieOpts); // Clear the access token cookie
        res.status(200).json({ success: true, message: 'User logged out successfully!' });
    } catch (error) {
        return next(error); // Pass the error to the global error handler
    }
}

module.exports = {
    register,
    login,
    getUser,
    updateUser,
    logout
};