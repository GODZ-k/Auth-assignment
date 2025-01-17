import aj from '../config/arkjet.config.js'
import {asyncHandler} from './asyncHandler.middleware.js'

const rateLimitter = asyncHandler(async (req, res, next) => {
    const decision = await aj.protect(req, { requested: 5 }); 
  
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
       return res.status(429).json({
        success: false,
        msg: "Rate limit exceeded"
       })
      } 
    } else {
        next()
    }
})

export default rateLimitter