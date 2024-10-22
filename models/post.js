const mongoose = require("mongoose")
const PostSchema = mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
        username:{type:String},
        name:{type:String},
        size:{type:String},
        price:{type:String},
        image:{type:String}
    }
)

var PostModel = mongoose.model("posts",PostSchema)
module.exports=PostModel