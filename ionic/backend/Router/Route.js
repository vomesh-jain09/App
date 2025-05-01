const express = require('express');
const User = require('../model/signup'); 
const router = express.Router();
const signupcontroller= require('../Controller/Signcontroller')
const Employecontroler= require('../Controller/Employecontroler')
const ProductController = require('../Controller/ProductController')
const CouponsController=require('../Controller/CouponController')
const AddressController= require('../Controller/AddressController')

router.get('/', (req, res) => {

    res.send("Hello world");     // This will send the response back to the client
});
router.post('/signup',signupcontroller.signup );
router.post('/login',signupcontroller.login)
//   Employee 
router.get('/Employee',Employecontroler.GetEmploye)
router.post('/postEmploye',Employecontroler.postEmploye)
router.put('/updateEmploye/:id',Employecontroler.updateEmployee)
router.delete('/deleteEmploye/:id',Employecontroler.deleteEmployee)
// Export the router

// Add product
router.post('/Product',ProductController.createProduct)
router.get('/Product/get', ProductController.getAllProducts);

// Get single product by id
router.get('/Product/:id', ProductController.getProductById);


router.post('/Coupons',CouponsController.Coupons);
router.get('/Coupons/get',CouponsController.getCoupons);

router.get('/Address/get',AddressController.getAddresses)
router.post('/Address',AddressController.createAddress)

module.exports = router;
