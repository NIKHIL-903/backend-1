const asyncHandler= (requestHandler)=>{
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

// asyncHnadler is a HOF, taking a controller function as an input and returning another function 

/*
2️⃣ Returned middleware function
(req, res, next) => { ... }
This is:
A valid Express middleware
req → request
res → response
next → pass control or errors
*/


export {asyncHandler}


//const asyncHnadler= ()= {}
//const asyncHnadler= (func)=> ()=> {}
//const asyncHnadler= (func)=> async ()=> {}

//refer above
// const asyncHandler= (fn)=> async(req,res,next)=> {
//     try{
//         await fn(req,res,next)
//     }catch(error) {
//         res.status(err.code || 5000).json({
//             success: false,
//             message: err.message
//         })
//     }
