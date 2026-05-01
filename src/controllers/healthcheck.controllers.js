import {apiResponse} from '../utils/api-response.js'; 
import asyncHandler from "../utils/async-handler.js";


/**


const healthCheck = async (req, res, next) => {
    try{
        const user = await getUserfromDB(); // This is just a placeholder for any async operation you might want to perform during the health check

        res
        .status(200)
        .json(new APIResponse(new APIResponse(200, {message: 'Server is healthy'}))
        )
    }
    catch(error){
        next(err); // Pass the error to the error handling middleware
    }
}
*/
const healthCheck = asyncHandler(async (req, res) => {
    res
    .status(200)
    .json(new apiResponse(200, {message: 'Server is Running '}));
})
 
export{healthCheck};
