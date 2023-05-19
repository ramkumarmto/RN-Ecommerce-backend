import { asyncError } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import { Category } from "../models/category.js";

//! GET ALL PRODUCTS
export const getAllProducts = asyncError(async (req, res, next) => {
  //! SEARCH AND FILTER
  const { keyword, category } = req.query;
  const products = await Product.find({
    name : {
      $regex : keyword ? keyword : "",
      $options : 'i', // case insensitive
    },
    category : category ? category : undefined,
  });

  // const products = await Product.find({
   
  // });

  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductDetails = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) return next(new ErrorHandler("Product not Found!", 400));

  res.status(200).json({
    success: true,
    product,
  });
});

//! create new product

export const createProduct = asyncError(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;

  if (!req.file) return next(new ErrorHandler(" Please add Image", 400));

  const file = getDataUri(req.file);

  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await Product.create({
    name,
    description,
    category,
    price,
    stock,
    images: [image],
  });

  res.status(200).json({
    success: true,
    message: "Product Created Successfully",
  });
});
//! update product later only admin can update product

export const updateProduct = asyncError(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not Found!", 400));

  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully!",
  });
});

//! ADD PRODUCT IMAGES
export const addProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not Found!", 400));

  if (!req.file) return next(new ErrorHandler(" Please add Image", 400));

  const file = getDataUri(req.file);

  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  product.images.push(image);
  await product.save();

  res.status(200).json({
    success: true,
    message: "Image Added Successfully!",
  });
});

//! DELETE PRODUCT IMAGES
export const deleteProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not Found!", 400));

  const id = req.query.id;
  if (!id) return next(new ErrorHandler("Invalid Image Id", 400));

  // console.log("id", id);
  // console.log(product.images)

  let isExist = -1;
  // why -1 becoz indexes of arr starts form 0
  // console.log("id",id.toString())
  product.images.forEach((item, index) => {
    // console.log(item._id.toString())
    if (item._id.toString() === id.toString()) isExist = index;
  });

  if (isExist < 0) return next(new ErrorHandler("Image does not exist!", 400));

  console.log(isExist);

  await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

  product.images.splice(isExist, 1);

  await product.save();

  res.status(200).json({
    success: true,
    message: "Image Deleted Successfully!",
  });
});

//! DELETE PRODUCT
export const deleteProduct = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not Found!", 400));

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await Product.deleteOne(product);

  res.status(200).json({
    success: true,
    message: "product Deleted Successfully!",
  });
});

//! CATEGORIES

export const addCategory = asyncError(async (req, res, next) => {
  const { category } = req.body;
  await Category.create({
    category,
  });

  res.status(201).json({
    success: true,
    message: "Category Created Successfully!",
  });
});
export const getAllCategories = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    categories,
  });
});
export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ErrorHandler("Category not found!", 404));

  //!

  const products = await Product.find({ category: category._id });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    product.category = undefined;
    await product.save();
  }

  console.log(`${category} deleted successfully!`);

  await Category.deleteOne(category);

  res.status(200).json({
    success: true,
    message: " Category deleted Successfully",
  });
});

//! Get Admin Products

export const getAdminProducts = asyncError(async (req, res, next) => {
  const products = await Product.find({}).populate("category");

  //populate("category") what does this mean ? => right now only id of category is populating in the product but with that line the object containing that id will populate

  // like findById

  const outOfStock = products.filter((i) => i.stock === 0)

  res.status(200).json({
    success: true,
    products,
    outOfStock : outOfStock.length,
    inStock : products.length - outOfStock.length
  });
});
