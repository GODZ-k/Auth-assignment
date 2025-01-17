import { Router } from "express";
import AuthController from "../controller/auth.controller.js";
import { isAdmin, requireAuth } from "../middleware/auth.moddleware.js";
import rateLimitter from "../middleware/rateLimit.middleware.js";

const router = Router();


// User routes
router.post('/register', AuthController.Register)
router.post('/login', rateLimitter, AuthController.login)
router.post('/logout', requireAuth , AuthController.logout)
router.get('/profile', requireAuth , AuthController.profile)
router.put('/update', requireAuth, AuthController.updateUser)

router.post('/forgot/password', AuthController.forgotPassword)
router.put('/reset/password', AuthController.resetPassword)


// Admin routes
router.get('/users', requireAuth , isAdmin , AuthController.AllUsers)
router.put('/update-user/role/:id', requireAuth , isAdmin , AuthController.changeRole  )
router.get('/user/:id',requireAuth,isAdmin, AuthController.getUser)
router.delete('/user/:id', requireAuth , isAdmin ,AuthController.deleteUser)


export default router