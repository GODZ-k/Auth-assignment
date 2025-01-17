import app from "./src/app.js";
import connectDB from "./src/config/db.config.js";
import getEnv from "./src/config/envConfig.js";




connectDB().then(()=>{
    app.listen(getEnv.PORT,()=>{
        console.log('Server is running on port',getEnv.PORT);
    });
});