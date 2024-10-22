const mongoose = require("mongoose")
const AccSchema = mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"accounts"},
        myname:{type:String},
        phoneno:{type:String},
        email:{type:String},
        description:{type:String},
        profile:{type:String}
    }
)
var AccModel = mongoose.model("accounts",AccSchema)
module.exports = AccModel