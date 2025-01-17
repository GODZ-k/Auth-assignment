import { Router } from "express";
import AuthController from "../controller/auth.controller.js";
import { isAdmin, requireAuth } from "../middleware/auth.moddleware.js";
import rateLimitter from "../middleware/rateLimit.middleware.js";

const router = Router();


// User routes


router.post('/register', AuthController.Register)  // register user
router.post('/login', rateLimitter, AuthController.login) // login user
router.post('/logout', requireAuth , AuthController.logout) // logout user
router.get('/profile', requireAuth , AuthController.profile) // get loggedin user profile
router.put('/update', requireAuth, AuthController.updateUser) // update user

router.post('/forgot/password', AuthController.forgotPassword) // forgot password
router.put('/reset/password', AuthController.resetPassword) // reset password


// Admin routes
router.get('/users', requireAuth , isAdmin , AuthController.AllUsers) // get all registered user
router.put('/update-user/role/:id', requireAuth , isAdmin , AuthController.changeRole  ) // change user role
router.get('/user/:id',requireAuth,isAdmin, AuthController.getUser) // get user by id
router.delete('/user/:id', requireAuth , isAdmin ,AuthController.deleteUser) // delete user by id


export default router