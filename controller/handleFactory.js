const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No booking found for this  id", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: false, //if false then model validator not use if we true then use
    });
    if (!doc) {
      return next(new AppError("No found for this id", 404));
    }
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: newDoc,
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);

    const doc = await query;
    // const doc=await Model.findById(req.params.id)
    // .populate({path:'guides',select:'-__v -passwordChangedAt'})
    // .populate({path:'reviews'});  // populate thi user collection nui id no reference che aeno object print karave
    // //tour.findOne({_id:req.params.id})
    if (!doc) {
      return next(new AppError("No Document found for this id", 404));
    }
    res.status(200).json({
      status: "success",
      result: doc.length,
      data: doc,
    });
  });

exports.getAll = (Model,populateOptions) =>
  catchAsync(async (req, res, next) => {
    //to allow for nested Get reviews on tour
    let filter = {};
    // if (req.params.ID) filter = { tour: req.params.ID };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();

      if (populateOptions) {
        features.query = features.query.populate(populateOptions);
      }


    const doc = await features.query;
    res.status(200).json({
      status: "success",
      result: doc.length,
      data: doc,
    });
  });
