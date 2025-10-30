const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: {
            type: String,

            default: "https://images.unsplash.com/photo-1754835143820-bcf20e2e1a35?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
            set: (v) => v
                == ""
                ? "https://images.unsplash.com/photo-1754835143820-bcf20e2e1a35?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8"
                : v,
        }

    },
    price:{
        type: Number,
       default: 0,
    } ,
    location: String,
    country: String,
    reviews: [
        
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
        
    ],

});

listingSchema.post("findOneAndDelete", async (listing)=> {
 if(listing){
await Review.deleteMany({_id: {$in: listing.reviews}});  }  
});       
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;