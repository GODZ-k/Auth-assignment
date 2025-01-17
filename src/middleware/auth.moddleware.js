import jwt from 'jsonwebtoken'
import getEnv from '../config/envConfig.js';


// authorize user --> middleware
/**
 * Middleware to verify the access token and authorize the user to access the route
 * If the token is valid, the user's details are stored in the request object
 * If the token is invalid or has expired, an appropriate error response is sent
 */
const requireAuth = async (req, res, next) => {
    try {
        let token;
        if (req.cookies) {
            token = req.cookies.accessToken;
        } else {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(422).json({
                msg: "Unauthorized access"
            })
        }

        const user = jwt.verify(token, getEnv.ACCESS_TOKEN_SECRET_KEY)

        if (!user) {
            return res.status(422).json({
                msg: "Unauthorized access",
            });
        }

        req.user = user

        next()

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const options = {
                httpOnly: true,
                path: "/"
            }
            return res
                .clearCookie('accessToken', options)
                .clearCookie('refreshToken', options)
                .status(422).json({
                    msg: "Session timeout please login again"
                })
        }
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
}


/**
 * Middleware to verify if the authenticated user has an admin role.
 * If the user is not an admin, it responds with a 422 status and an error message.
 * If the user is an admin, the request is passed to the next middleware.
 */
const isAdmin = async (req, res, next) => {
    try {
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Middleware to check if the user is an admin
 * If the user is not an admin, a 422 error response is sent
 * If the user is an admin, the request is forwarded to the next middleware
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
/******  1db13be9-29c7-4d16-959c-5ba7a89909af  *******/        const user  = req.user

        if (!user || user.role !== 'admin') {
            return res.status(422).json({
                msg: "you are not admin to do this task",
            });
        }

        req.user = user

        next()

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const options = {
                httpOnly: true,
                path: "/"
            }
            return res
                .clearCookie('accessToken', options)
                .clearCookie('refreshToken', options)
                .status(422).json({
                    msg: "Session timeout please login again"
                })
        }
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
}



export { requireAuth,
    isAdmin
}