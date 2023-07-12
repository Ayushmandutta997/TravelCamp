class ExpressError extends Error{
    constructor(message,statusCode){
        super(); // Call the parent class (Error) constructor
        this.message=message; // Set the error message
        this.statusCode=statusCode; // Set the status code associated with the error
    }
}
module.exports=ExpressError;