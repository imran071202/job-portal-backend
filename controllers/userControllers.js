
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { json } from "express";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

// REGISTER
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        // console.log(fullname, email, phoneNumber, password, role);


        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: 'Something missing',
                success: false
            });
        }
        const file=req.file
    const fileUrl=getDataUri(file)
    const cloudresponse=await cloudinary.uploader.upload(fileUrl.content)

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already has an account',
                success: false
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashPassword,
           role: role.toLowerCase(),
            profile:{
                profilePhoto:cloudresponse.secure_url
            }
        });

        return res.status(201).json({
            message: 'User registered successfully',
            success: true
        });


    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            success: false
        });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Something missing',
                success: false
            });
        }

        let foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(400).json({
                message: 'Incorrect email or password',
                success: false
            });
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Incorrect email or password',
                success: false
            });
        }

       if (role.toLowerCase() !== foundUser.role) {
    return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false
    });
}


        const tokenData = { userID: foundUser._id };

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });

        foundUser = {
            _id: foundUser._id,
            fullname: foundUser.fullname,
            email: foundUser.email,
            phoneNumber: foundUser.phoneNumber,
            role: foundUser.role,
            profile: foundUser.profile
        };

        // return res.status(200)
        //     .cookie('token', token, {
        //         maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        //         httpOnly: true,
        //         sameSite: 'strict'
        //     })
        //     .json({
        //         message: `Welcome ${foundUser.fullname}`,
        //         foundUser,
        //         success: true
        //     });
        return res.status(200)
  .cookie('token', token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: true,       // ✅ required for HTTPS
      sameSite: "none"    // ✅ allow cross-domain cookies
  })
  .json({
      message: `Welcome ${foundUser.fullname}`,
      foundUser,
      success: true
  });



    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            success: false
        });
    }
};

//Logout

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '', { maxAge: 0 }).json({
            message: 'Logout successfully',
            success: true
        })

    } catch (error) {

    }
}

// update profile

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file=req.file
    const fileUrl=getDataUri(file)
    const cloudresponse=await cloudinary.uploader.upload(fileUrl.content)
    
    let skillArray;
    if (skills) {
      skillArray = skills.split(",").map(s => s.trim());
    }

    const userId = req._id; // ensure your auth middleware sets req.userId
    let updateUser = await User.findById(userId);

    if (!updateUser) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    if (fullname) updateUser.fullname = fullname;
    if (email) updateUser.email = email;
    if (phoneNumber) updateUser.phoneNumber = phoneNumber;
    if (bio) updateUser.profile.bio = bio;
    if (skills) updateUser.profile.skills = skillArray;
    if(cloudresponse){
        updateUser.profile.resume= cloudresponse.secure_url
        updateUser.profile.resumeOrginalName=file.originalname
    }

    await updateUser.save();

    return res.status(200).json({
      message: 'User updated successfully',
      user: updateUser,
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong try after some time later',
      success: false
    });
  }
};


// export const updateProfile = async (req, res) => {

//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body
        
//         let skillArray
//         if (skills) {
//             skillArray = skills.split(",")
//         }
//         const userId = req._id // middleware 
//         let updateUser = await User.findById(userId)
//         if (!updateUser) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false
//             });
//         }

//         // update data
//         if (fullname) updateUser.fullname = fullname
//         if (email) updateUser.email = email
//         if (phoneNumber) updateUser.phoneNumber = phoneNumber
//         if (bio) updateUser.bio = bio
//         if (skills) updateUser.skills = skillArray;


//         await updateUser.save()

//         updateUser = {
//             _id: updateUser._id,
//             fullname: updateUser.fullname,
//             email: updateUser.email,
//             phoneNumber: updateUser.phoneNumber,
//             role: updateUser.role,
//             profile: updateUser.profile
//         };
//         return res.status(200).json({
//             message: 'user update succesfully',
//             updateUser,
//             success: true

//         })

//     } catch (error) {
//         console.log(error);


//     }
// }
