

class CustomError extends Error{
    constructor(errors,code){
        super()
        this.status=false
        this.errors=errors
        this.statusCode=code
    }
}

module.exports=CustomError