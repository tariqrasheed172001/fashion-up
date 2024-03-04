const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

// api for creating orders
router.post("/orders", async (req, res) => {
  try {
    // creating razorpay instance
    const instance = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "USD",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
      } else {
        res.status(200).json({ data: order });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// api for verifying payment
router.post("/verify", async (req, res) => {
  try {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // decrypting the signature
    const expectedSign = crypto
        .createHmac("sha256", process.env.RZP_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    // verifying signature
    if(expectedSign === razorpay_signature){
        return res.status(200).json({message: "Payment verified successfully"});
    }else{
        return res.status(400).json({message:"Invalid signature sent!"});
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
