const mongoose = require('mongoose');

const referralsSchema = mongoose.Schema({
    referrerId:{
        type: mongoose.Schema.ObjectId,  // User who shared the code
        ref:'User'
    },
    refereeId:{
        type: mongoose.Schema.ObjectId, // New user who signed up using the code
        ref:'User'
    },

    referralCode:{
        type: String, // Code used during signup
        required:[true,"referralCode is required."]
    },
    rewardGranted:{
        type:Boolean
    }
},
{
    timestamps:true
}
); 