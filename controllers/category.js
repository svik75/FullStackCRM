const Category = require('../models/Category')
const errorHandler = require('../utils/errorHandler')
const Position = require('../models/Position')
//----------------------------------------------
module.exports.getAll = async function (req, res) {
  try {
    const categories = await Category.find({
      user: req.user.id
    })
    res.status(200).json(categories)
  } catch (error) {
    errorHandler(res, error)
  } 
}
//---------------------------------------------
module.exports.getById = async function (req, res) {
  try {
    const category = await Category.findById(req.params.id)
    
     res.status(200).json(category) 
    
    
  } catch (error) {
    errorHandler(res, error)
  }
}
//---------------------------------------
module.exports.remove = async function (req, res) {
  try {
    await Category.remove({ _id: req.params.id })
    await Position.remove({ category: req.params.id })
    res.status(200).json({ message: 'category has been deleted' })
  } catch (error) {
    errorHandler(res, error)
  }
}
//-------------------------------------
module.exports.create = async function (req, res) {
  const category = new Category({
    name: req.body.name,
    user: req.user.id,
    imageSrc: req.file ? req.file.path : ''
  })
  
  try {
    await category.save()
    res.status(201).json(category)
  } catch (error) {
    errorHandler(res, error)
  }
}
//-------------------------------------
module.exports.update = async function (req, res) {
  const updated  = {
    name: req.body.name
  }
  if (req.file) {
    updated.imageSrc = req.file.path
  } 
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      {new: true}
    )
    res.status(200).json(category)
  } catch (error) {
    errorHandler(res, error)
  }
}   
