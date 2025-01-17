/**
 * A middleware function that wraps a controller function and
 * calls it with the next() function as its third argument.
 * If the controller function throws an error, it will be caught
 * and passed to the next() function.
 */
export const asyncHandler = (controller) =>
     async(req,res,next)=>{
    try {
        await controller(req,res,next)
    } catch (error) {
        next(error)
    }
}

