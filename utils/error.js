
class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);
        // super is like constructor of parent 


        this.statusCode = statusCode
    }

}
export default ErrorHandler;