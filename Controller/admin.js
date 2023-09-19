import user from "../model/user.js"

export const fetchallemail =async(req,res)=>{
  try{
    const email=await user.find({}, 'email')
    console.log(email)
    res.json(email)
  }catch(err){
  console.error(err);
  res.status(500).json({error:'an error occured while fetching email fro admin'})
  }
}


export const deletemail = async (req, res) => {
  try {
    const { email } = req.body;
    
   
    const deletedUser = await user.findOneAndDelete({ email });

    if (deletedUser) {
      res.json("User deleted successfully");
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the user" });
  }
};
  
