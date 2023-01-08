const User = require('../models/User')
const AppError = require('../utils/AppError')
exports.setRole=function(role){
    return (req,res,next)=>{
        req.body.roles=role
        next()
    }

    
}
const filterObj = (obj)=>{
    
    const newObj={}
    const notAllowed=['email','roles']
    Object.keys(obj).forEach((el)=>{
        if(!notAllowed.includes(el)){
            newObj[el]=obj[el]
        }

    })

    return newObj;
}

exports.allow = (...roles)=>{
    
    return (req,res,next)=>{
        req.user={}
        req.user.role="admin"
        if(roles.includes(req.user.role)){
           next() 
        }
        else{
            next(new AppError('Admin only access',401))
        }
    }
}

exports.createTeacher = async (req,res,next)=>{
    try{
        
        const user = {
            email:req.body.email,
            name:req.body.name,
            department:req.body.department,
            subject:req.body.subject,
            age:req.body.age,
            roles:req.body.roles,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm
    
        }
        console.log(user)
        const newUser = await User.create(user)
        return res.status(200).json({
            status:"SUCCESS",
            data:{
                newUser
            }
        })

        
    }catch(err){
        console.log(err)
        res.status(500).json({
            status:"Fail",
            message:"Cannot create a new user"
        })
    }
    
}

exports.getAllTeachers = async (req,res,next)=>{
    try{
        const users = await User.find()
        res.status(200).json({
            status:"SUCCESS",
            data:{
                users
            }
        })
    }
    catch(err){
        res.status(500).json({
            status:"FAIL",
            error:err
        })
    }
    

}

exports.getTeacher = async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json({
            status:"SUCCESS",
            data:{
                user
            }
        })
    }
    catch(err){
        res.status(500).json({
            status:"FAIL",
            error:err
        })
    }
}

exports.updateTeacher = async (req,res,next)=>{
    try{

       
        const updateObj=filterObj(req.body)
        const user = await User.findByIdAndUpdate(req.params.id,updateObj,{new:true})
        res.status(200).json({
            status:"SUCCESS",
            data:{
                user
            }

        })
    }
    catch(err){
        res.status(500).json({
            status:"FAIL",
            error:err
        })
    }
}

exports.deleteTeacher = async (req,res,next)=>{

    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status:"SUCCESS",
            message:"User deleted"
        })
    }catch(err){
        res.status(500).json({
            status:"FAIL",
            message:"delete operation failed"
        })
    }
    


}




