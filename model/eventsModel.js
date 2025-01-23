const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({

},
{
    timestamps:true
}
);

const Event = mongoose.model("Events",eventSchema);

module.exports = Event;