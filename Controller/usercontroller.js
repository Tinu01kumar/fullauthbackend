import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../model/user.js"
import Token from '../model/token.js';
import Otp from '../model/otp.js';

import sendEmail from '../Utils/sendEmail.js';
import Verifiytoken from '../model/verification.js';
dotenv.config();


export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if(user.status===true)
      {

      
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);

        const newToken = new Token({ token: refreshToken });
        await newToken.save();
           

        
            // res.cookie("jwttoken" ,accessToken , refreshToken , {
            //   expiresIn:'30min' , httpOnly:true
            // } ).status(200).json({message:"lOGGED IN SUCCESSFULLLY", accessToken: accessToken,
            // refreshToken: refreshToken,
            // email: user.email,
            // name: user.name,});
            if(email===process.env.ADMINEMAIL)
            {
              res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                email: user.email,
                name: user.name,
                message:"successful login",
                role:"admin"
              });
            }
            else{

              res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                email: user.email,
                name: user.name,
                message:"successful login",
                role:"not authorise"
              });
            }
      } else {
        res.status(401).json({ message: "Password didn't match" });
      }
    }else{
      res.json({message:"email is not verified"})
    } 
    
  }else {
      res.status(404).json({ message: "User not registered" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const logoutuser=async(req, res)=>{
     const token=req.body.token;
     await Token.deletOne({token:token});
     res.status(204).json({msg:'logout successfull'});     
}






export const signupuser=async(req,res)=>{
   try {
      const { name, email, password  } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.status===true) {
        // res.status(409).json({ message: "User already registered" });
          res.json({message:"user already registered"})
      } else {
        

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          status:false
        });
        await newUser.save();


   


        const verificationtoken = jwt.sign({ email }, process.env.VERIFICATIONTOKEN, { expiresIn: '10m' });

        const emailverify = new Verifiytoken({
          email: email,
          token: verificationtoken,
      
          expireIn: new Date().getTime() + 600 * 1000,
        });


        console.log(emailverify);

        await emailverify.save()
        .catch((error) => {
          console.error("Error while saving email verification token:", error);
          res.status(500).json({ error: "Internal server error" });
        });
      

        const subject='your verification link';

        const text=`Please verify your email by clicking on the following link:https://localhost:3000/verify/${verificationtoken}`;
            console.log(email , subject , text)
            
        if(sendEmail(email , subject , text))
        {
          res.json({message:" verification Email sent to your mail"})
        }
        else {
          res.json({message:"Email not sent"})
        }
        

      
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}



export const verifytokenbyuser = async (req, res) => {
  const { token } = req.params;
  console.log("Received token:", token);
  jwt.verify(token, process.env.VERIFICATIONTOKEN, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.send("Email verification link has expired");
      } else {
        console.error("Error in token verification:", err);
        res.send("Email verification failed error in verification link");
      }
    } else {
      try {
        const savedToken = await Verifiytoken.findOne({ email: decoded.email }).sort({ expireIn: -1 });
        if (savedToken.token === token) {
          console.log("Decoded data:", decoded);
          const statuscheck = await User.findOne({ email: decoded.email });
          if (statuscheck.status === false) {
            statuscheck.status = true;
            await statuscheck.save();
            res.send("Email verified successfully");
          } else {
            res.send("Email is already verified");
          }
        } else {
          console.log("Decoded data:", decoded);
          res.send("Not verified");
        }
      } catch (error) {
        console.error("Error in fetching saved token:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};


















export const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      let otpcode = Math.floor(Math.random() * 10000) + 1;
      let otpData = new Otp({
        email: req.body.email,
        code: otpcode,
        expireIn: new Date().getTime() + 300 * 1000,
      });
      await otpData.save();

      // Find the latest OTP data for the provided email
      const latestOtpData = await Otp.findOne({ email }).sort({ expireIn: -1 });

      if (!latestOtpData) {
        return res.json({ message: "No OTP data found for the provided email" });
      }

      res.json({ message: "Email is present", id: latestOtpData._id });
      const subject="Your OTP Code";
      const text=`Your OTP Code is: ${otpcode}`;
          sendEmail(email , subject , text );
    } else {
      res.json({ message: "Email is not present" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const Otpverification = async (req, res) => {
  const frontendCode = req.body.code;
  const otpid = req.body.id;
  console.log(otpid);
  console.log(frontendCode)

  try {
    // Assuming 'code' is the correct field name to fetch the OTP code from the database
    const databasetotpcode=await Otp.findOne({_id: otpid});
      
    if(databasetotpcode)
    {

      console.log( databasetotpcode.code);
    
    }
    if (databasetotpcode.code===frontendCode) {
      const user_id_email=databasetotpcode.email
      const userid=await User.findOne({email: user_id_email})
      console.log(userid._id)
      res.json({ message: "Code is correct"  ,
        id:userid._id });
    } 
    else {
      res.json({ message: "Code is not correct" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error while OTP checking", error });
  }
};











export const Changepassword=async(req, res)=>{
  const userid=req.body.id;
  const password=req.body.password;
  console.log(userid , password)

   const user=await User.findOne({_id:userid})
   try{

   
  if(user)
  {
        const hashedPassword=bcrypt.hashSync(password, 10);
        user.password=hashedPassword;
        await user.save();
        res.json({message:"success"})
  }
  else{
    res.json({message:"user id is not correct"})
  }
}catch(error)
{
  res.status(500).json({error:"error while password change", error});
}

  
}










