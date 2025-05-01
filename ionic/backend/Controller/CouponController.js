const Coupons=require('../model/Coupons');
const Counter=require('../model/Counter');

exports.Coupons=async(req,res)=>{
    try{
        const counter=await Counter.findOneAndUpdate(
            {id:'coupon_id'},
            { $inc: { seq: 1 } },
            { new: true, upsert: true }  
        );
        const newCoupon= new Coupons({
            id:counter.seq,
            code:req.body.code,
            saved:req.body.saved,
            isPercentage:req.body.isPercentage,
            minAmount:req.body.minAmount

        })
        await newCoupon.save();
        res.status(201).json({message:"Coupon added",newCoupon});
    }catch(error){
            res.status(500).json({message:'something went wrong'})
    }
};

exports.getCoupons = async (req, res) => {
    try {
        // Fetch all coupons from the database
        const coupons = await Coupons.find();

        // Return the coupons as a response
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};