const Product = require('../model/Product');
const Counter = require('../model/Counter');

exports.createProduct = async (req, res) => {
  try {
    // Step 1: Counter se nayi ID le lo
    const counter = await Counter.findOneAndUpdate(
      { id: 'product_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }  // upsert: true means agar nahi mila to create kar do
    );

    // Step 2: Naye product ke sath ID use karo
    const newProduct = new Product({
      id: counter.seq,  // yahan se auto id mil gaya
      name: req.body.name,
      price: req.body.price,
      status: req.body.status,
      rating: req.body.rating,
      cover: req.body.cover,
      description: req.body.description
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
                                                                                                           
    res.status(500).json({ message: 'Something went wrong' });
  }
};
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();  // Saare products fetch kar lo
      res.status(200).json(products);         // Response mein bhej do
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params; // URL se id nikal lo
      const product = await Product.findOne({ id: id }); // id ke basis par product search karo
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(product);  // Product mil gaya
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  