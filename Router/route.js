import  express  from "express";
import { signupuser , verifytokenbyuser, loginuser , forgotpassword ,Otpverification , Changepassword} from "../Controller/usercontroller.js";




const router=express.Router();




router.post('/register' , signupuser)

router.post('/login',  loginuser)
router.post('/forgotpassword' , forgotpassword)


router.post('/otpverification' , Otpverification)

router.post('/changepassword' , Changepassword)

router.put('/verify/:token' , verifytokenbyuser )
export default router;