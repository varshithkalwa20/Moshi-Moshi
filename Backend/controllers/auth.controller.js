import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js"
export const signup= async(req,res)=>{
    try{
        //res.send("heyy")
        const {fullName,userName,password,ConfirmPassword,gender}=req.body
        if(password!==ConfirmPassword){
            return res.status(400).json({error: "same same but diffelentt...no match no signup"})
        }
        const user = await User.findOne({userName})

        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        //hash passwd here
        const salt =await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const boyProfilePic='https://avatar.iran.liara.run/public/boy?username=${userName}'
        const girlProfilePic='https://avatar.iran.liara.run/public/girld?username=${userName}'

        const newUser= new User({
            fullName,
            userName,
            password:hashedPassword,
            gender,
            profilePic: gender==="male"? boyProfilePic : girlProfilePic

        })

        if(newUser){

            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();
        res.status(201).json({
           _id: newUser._id, 
           fullName:newUser.fullName,
           userName:newUser.userName,
           profilePic:newUser.profilePic
        })

        }
        else{
            res.status(400).json({error:"Invalid user data"})
        }

    }
    catch(error){
        console.log("Error in signup controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const login= async(req,res)=>{
    try{

        const {userName,password}= req.body
        const user= await User.findOne({userName})
        const isPasswodCorrect = await bcrypt.compare(password, user?.password|| "")

        if(!user || !isPasswodCorrect){
            return res.status(400).json({error:"Invalid Username or Password"})
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id:      user._id, 
           fullName:  user.fullName,
           userName:  user.userName,
           profilePic:user.profilePic
        })
    }catch(error){
        console.log("Error in login controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const logout=(req,res)=>{
    try{
        res.cookie("jwt","", {maxAge:0})
        res.status(200).json({message:"Logged out successfully(Dhobbey)"})

    }catch(error){
        console.log("Error in logout controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
    
}