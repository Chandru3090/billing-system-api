const config = require("../config/config");
const createHTTPError = require('http-errors'); // Import http-errors for creating HTTP errors
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const User = require('../models/user'); // Import the User model

const isVerifiedUser = async (req: any, res: any, next: any) => {
    try {
        const { access_token } = req.cookies; // Get the access token from cookies
        if (!access_token) {
            const error = createHTTPError(401, 'Access token is missing!');
            return next(error); // Pass the error to the global error handler
        }
        const decoded = jwt.verify(access_token, config.accessTokenSecret); // Verify the access token

        if (!decoded) {
            const error = createHTTPError(401, 'Invalid access token!');
            return next(error); // Pass the error to the global error handler
        }
        const user = await User.findById(decoded.id); // Find the user by ID
        if (!user) {
            const error = createHTTPError(404, 'User not found!');
            return next(error); // Pass the error to the global error handler
        }
        req.user = user; // Attach the user to the request object
        return next(); // Call the next middleware
    } catch (error) {
        const err = createHTTPError(401, 'Invalid access token!');
        return next(err);
    }
}

module.exports = isVerifiedUser; // Export the middleware function