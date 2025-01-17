import z from 'zod'


const RegisterSchema = z.object({
    email: z.string().email(),
    username: z.string().min(4),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
}).refine((val)=> val.password === val.confirmPassword ,{
    message:"confirm Password doesn't match"
})

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

const forgotPasswordSchema = z.object({
    email:z.string().email()
})

const resetPasswordSchema = z.object({
    newPassword:z.string().min(6),
    confirmPassword:z.string().min(6)
}).refine((val)=> val.newPassword === val.confirmPassword ,{
    message:"confirm Password doesn't match"
})

const updateProfileSchema = z.object({
    email:z.string().email().optional(),
    username:z.string().min(6).optional()
})

const updateUserRoleSchema = z.object({
    role:z.enum(['user','admin']),
})

export {
    RegisterSchema,
    forgotPasswordSchema,
    updateUserRoleSchema,
    LoginSchema,
    updateProfileSchema,
    resetPasswordSchema
}