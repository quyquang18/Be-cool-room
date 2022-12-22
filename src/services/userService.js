import db from '../models/index'
import bcrypt from 'bcryptjs'
const crypto = require("crypto");
import setTZ from 'set-tz';

const { Sequelize, Op } = require("sequelize");
import emailService from './emailService'
const salt = bcrypt.genSaltSync(10);
setTZ('Asia/Bangkok')
let handleUserLogin =(email,password)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let userData ={};
            let isExist = await checkUserEmail(email);
            if(isExist){
                let user =await db.User.findOne({
                    attributes :['email','username','roleID','password','verifed','firstname'],
                    where:{email:email},
                    raw :true,
                });
                if(user){
                   let checkPass = await bcrypt.compareSync(password,user.password)
                   if(checkPass){
                    console.log(user)
                    if(!user.verifed){
                        userData.errCode=4;
                        userData.message='Your account has not been verified. Please verify your account to continue'
                    }else {
                        userData.errCode=0;
                        userData.message='Ok';
                        delete user.password;
                        delete user.verifed;
                        userData.user =user;
                    }
                   }
                   else {
                    userData.errCode=3;
                    userData.message='Wrong password'
                   }
                } else
                {
                    userData.errCode =2;
                    userData.message =`User's not found~`
                }

            }else {
                userData.errCode =1;
                userData.message = `Your's Email isn't exist in your system. Plz try other Email!`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}
let hashUserPassword =(password)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let hashPassword = await bcrypt.hashSync(password,salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error)
        }
    })
}
let checkUserEmail = (userEmail)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user =await db.User.findOne({
                where:{email:userEmail}
            })
            if(user) {
                resolve(true)
            }else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllUsers =(userId) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let users ='';
            if (userId==='ALL'){
                users =await db.User.findAll({
                    attributes: {
                        exclude:['password']
                    }
                })
            }
            if(userId && userId !=='ALL') {
                users =await db.User.findOne({
                    where:{id:userId},
                    attributes: {
                        exclude:['password']
                    }
                })
            }
            resolve(users)

        } catch (error) {
            reject(error)
        }
    })
}
let sendEmail =(data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            console.log(data)
            await emailService.sendSimpleEmail({
                firstname:"quang",
                receiverEmail:data.email,
                username:"quangquy",
                url:data.url,
            });
            resolve({
                errCode:1,
                message:'oke'
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let createNewUser =(data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let checkEmail = await checkUserEmail(data.email);
            if(checkEmail){
                resolve({
                    errCode:1,
                    message:'User email already exists please enter a new email address'
                })
            }else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                let user = await db.User.create({
                    lastname:data.lastname,
                    firstname:data.firstname,
                    email:data.email,
                    username:data.username,
                    password:hashPasswordFromBcrypt,
                    phonenumber:data.phonenumber,
                    verifed:false,
                    roleID:'R3'
                })
                let token = await db.Token.create({
                    token: crypto.randomBytes(32).toString("hex"),
                    userId: user.id,
                });
                
                const url = `${process.env.BASE_URL}cool-room/client/verify-email.html?iduser=${user.id}&&token=${token.token}`;
                console.log(url)
                await emailService.sendSimpleEmail({
                    firstname:data.firstname,
                    receiverEmail:data.email,
                    username:data.username,
                    url:url,
                });
                resolve({
                    errCode:0,
                    message:'Successful registration.An email has been sent to your account, please verify'
                })
            }
            
        } catch (error) {
            reject(error)
        }
    })
}
let deleteUser =(userId) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await db.User.findOne({
                where:{id:userId}
            })
            if(!user){
                resolve({
                    errCode:2,
                    message:`The User isn't exist`
                })
            }
            await db.User.destroy({
                where:{id:userId}
            });
            resolve({
                errCode:0,
                message:`The user is deleted`
            })
        } catch (error) {
            reject(error)
        }
    })
}
let updateUser =(data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await db.User.findOne({
                where:{id:data.id},
                raw:false
            })
            if(user){
                user.username = data.username;
                await user.save();
                resolve({
                    errCode:0,
                    message:`Update the user succeeds`
                })
            }else {
                resolve({
                    errCode:1,
                    message:`User's not found!`
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let verifyEmail =(inputId,inputToken) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await db.User.findOne({
                where:{id:inputId},
                raw:false
            })
		if (!user) {
            resolve({
                status :400,
                errCode:1,
                message:`Invalid link`
            })
        }
		let token = await db.Token.findOne({
			where:{
                userId: user.id,
			    token: inputToken,
            },
            raw:false
		});
		if (!token) {
            resolve({
                status :400,
                errCode:1,
                message:`Invalid link`
            })
        }
        user.verifed =true
        await user.save();
		await db.Token.destroy({
            where:{userId:user.id}
        });
        resolve({
            status :200,
            errCode:0,
            message:`Email verified successfully`
        })
        } catch (error) {
            reject(error)
        }
    })
}

let getValueSensor =(type,value)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let values =''
            if(type ==='day'){
                values =await db.valueSensor.findAll({
                    where:{date:value},
                })
                console.log(values.date)
            }
            if(type==='month'){
                values = await db.valueSensor.findAll({
                    where: Sequelize.fn('EXTRACT(MONTH from "date") =', value)
                 });
            }
            resolve({
                errCode:0,
                value:values
            })

        } catch (error) {
            reject(error)
        }
    })
}
let createNewValueSensor =(data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
        
            let date_ob = new Date()
            console.log(date_ob)
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let currentDate = year + "-" + month + "-" + day;
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let time = hours + ":" + minutes + ":" + seconds;
            let valueSensor = await db.valueSensor.create({
                temperature:data.temperature,
                humidity:data.humidity,
                date:currentDate,
                time:time,
                locationID:1,
                userID:1,
            })
                console.log(valueSensor)
  
                resolve({
                    errCode:0,
                    message:'ok'
                })
            
            
        } catch (error) {
            reject(error)
        }
    })
}
let sendEmailWarning = async(data)=>{
        await emailService.sendEmailWarning({
            firstname:data.firstname,
            receiverEmail:data.email,
            type:data.type,
            date:data.date,
            time:data.time,
            value:data.value,
        });
     return {
        errCode:0,
        message:'Ok'
     }
}
module.exports ={
    handleUserLogin:handleUserLogin,
    getAllUsers:getAllUsers,
    createNewUser:createNewUser,
    deleteUser:deleteUser,
    updateUser:updateUser,
    verifyEmail:verifyEmail,
    getValueSensor:getValueSensor,
    createNewValueSensor:createNewValueSensor,
    sendEmailWarning:sendEmailWarning,
    sendEmail:sendEmail
}