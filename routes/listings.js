const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController=require("../constrollers/listings.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({storage}); 

router.route("/")
.get( wrapAsync(listingController.index))
  .post(isloggedIn,
    validateListing,
    upload.single("listing[image]"),
  wrapAsync(listingController.createlisting)
  );

// ).post( upload.single("listing[image]"), (req, res, next)=>{
//   res.send(req.file);
// });
  
//new route
router.get("/new", isloggedIn,listingController.renderNewForm);


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
  
  isloggedIn,
  isOwner, 
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isloggedIn,
  isOwner,
  wrapAsync(listingController.destroylisting)
);




  

// Edit Route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);



module.exports = router;
