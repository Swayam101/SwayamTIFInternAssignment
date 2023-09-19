class Response{
    constructor(status,data=null,meta=null){
        this.status=status
        this.content={}
        this.content.data=data
        if(meta) this.content.meta=meta
    
    }
}

module.exports=Response;