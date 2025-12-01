import uploadCloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {description, name} = req.body;

    let photoUrl

    if(req.file){
      photoUrl = await uploadCloudinary(req.file.path); 
    }

    const user = await User.findByIdAndUpdate(userId, {
      description,photoUrl
    });

    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json({message: "Profile updated successfully"})
}
catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: `Internal server error ${error}` },);
  } 
}
