// const Listing= require("../models/listing.js");


// module.exports.index=async(req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   };
  
//   module.exports.renderNewForm=(req, res) => {
//     res.render("listings/new.ejs");
//   };
//   module.exports.showListing=async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate({path:"reviews",populate:{
//     path:"author",
//   },
//   })
// .populate("owner");
//   if(!listing){
//     req.flash("error","Cannot find that listing");
//     return res.redirect("/listings");
//   }
//   // console.log(listing);
//   res.render("listings/show.ejs", { listing });
// }; 
// module.exports.createlisting=async (req, res, next) => {
//     // if (!req.body.listing) {
//     // //   throw new ExpressError(400, "Send valid data for listing");
//     // }
//     let url=req.file.path;
//     let filename=req.file.filename;
//     const newlisting = new Listing(req.body.listing);
//     newlisting.owner=req.user._id;
//     newlisting.image={url,filename};
//     await newlisting.save();
//     req.flash("success", "Listing created successfully");
//     res.redirect("/listings");
//     };

//     module.exports.renderEditForm=async (req, res) => {
//         let { id } = req.params;
//         const listing = await Listing.findById(id);
//         if(!listing){
//           req.flash("error","Cannot find that listing");
//           return res.redirect("/listings");


//         }
//         let originalImageUrl=listing.image.url;
//  originalImageUrl = originalImageUrl.replace(
//   "/upload",
//   "/upload/h_250,w_250,e_blur:200"
// );


//         res.render("listings/edit.ejs", { listing ,originalImageUrl});
//       };
      
//         // module.exports.updateListing=async (req, res) => {
//         //     let { id } = req.params;
//         //     let listing = await Listing.findById(id);
//         //     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//         //     req.flash("success", "Listing updated successfully");
//         //     res.redirect(`/listings/${id}`);
//         //   };



//         module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;

//   // Find existing listing
//   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });

//   // If a new image file is uploaded, update the image field
//   if(typeof req.file!== "undefined"){
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }

//   req.flash("success", "Listing updated successfully");
//   res.redirect(`/listings/${id}`);
// };

//           module.exports.destroylisting=async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     req.flash("success", "Listing deleted successfully");
//     res.redirect("/listings");

//   };
const Listing = require("../models/listing.js");

// 1️⃣ INDEX ROUTE
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", { allListings });
  } catch (err) {
    return next(err);
  }
};

// 2️⃣ NEW FORM
module.exports.renderNewForm = (req, res) => {
  return res.render("listings/new.ejs");
};

// 3️⃣ SHOW ROUTE
module.exports.showListing = async (req, res, next) => {
  try {
    let { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Cannot find that listing");
      return res.redirect("/listings");
    }

    return res.render("listings/show.ejs", { listing });
  } catch (err) {
    return next(err);
  }
};

// 4️⃣ CREATE LISTING
module.exports.createlisting = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    await newlisting.save();

    req.flash("success", "Listing created successfully");
    return res.redirect("/listings");
  } catch (err) {
    return next(err);
  }
};

// 5️⃣ EDIT FORM
module.exports.renderEditForm = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Cannot find that listing");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url.replace(
      "/upload",
      "/upload/h_250,w_250,e_blur:200"
    );

    return res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (err) {
    return next(err);
  }
};

// 6️⃣ UPDATE LISTING
module.exports.updateListing = async (req, res, next) => {
  try {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing updated successfully");
    return res.redirect(`/listings/${id}`);
  } catch (err) {
    return next(err);
  }
};

// 7️⃣ DELETE LISTING
module.exports.destroylisting = async (req, res, next) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully");
    return res.redirect("/listings");
  } catch (err) {
    return next(err);
  }
};
