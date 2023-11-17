import  express  from "express";
import { signupuser , verifytokenbyuser, loginuser , forgotpassword ,Otpverification , Changepassword , logoutuser , uploadimage,getImagesByEmail, deleteImage} from "../Controller/usercontroller.js";
import { fetchallemail  , deletemail} from "../Controller/admin.js";
<<<<<<< HEAD
import { upload } from "../Controller/usercontroller.js";
const isAdminAPIAuthorized = (req, res, next) => {
    // Assuming you have user information stored in req.user after authentication.
    if (req.user && req.user.role === 'admin' && req.user.permissions.includes('access_admin_api')) {
      // User has the necessary role and permission.
      next(); // Allow access to /admin/api.
    } else {
      // User doesn't have the required access.
      res.status(403).json({ error: 'Access Denied' });
    }
  };
=======


>>>>>>> parent of ebdbfb4 (first commit)


const router=express.Router();




router.post('/register' , signupuser)

router.post('/login',  loginuser)
router.post('/logout', logoutuser);
router.post('/forgotpassword' , forgotpassword)


router.post('/otpverification' , Otpverification)

router.post('/changepassword' , Changepassword)
router.post('/imageupload', upload.single('file') , uploadimage);
router.put('/verify/:token' , verifytokenbyuser )
router.get('/admin/api' , fetchallemail)
router.post('/admin/email/delete' ,deletemail)
router.get('/getimages/:email', getImagesByEmail);
router.delete('/deleteimage/:email/:image', deleteImage);
export default router;