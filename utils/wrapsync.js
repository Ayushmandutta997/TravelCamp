module.exports= func =>{
    return (req,res,next)=>{

        //  catch any errors that occur during the execution
        //  of the asynchronous function and pass them to the 
        // Express next function for error handling.
        func(req,res,next).catch(next)
    }
} 