const Address=require('../model/Address');
// Create a new address
exports.createAddress = async (req, res) => {
    try {
      const { fullName, phone, house, street, city, state, pincode } = req.body;
  
      const newAddress = new Address({
        fullName,
        phone,
        house,
        street,
        city,
        state,
        pincode,
      });
  
      await newAddress.save(); // Save the new address to the database
      res.status(201).json({ message: 'Address created successfully', newAddress });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error });
    }
  };
  
  // Get all addresses
  exports.getAddresses = async (req, res) => {
    try {
      const addresses = await Address.find(); // Fetch all addresses
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error });
    }
  };