const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const cryptoRandomString = require('crypto-random-string');

const Users = require('../mongo/models/users');
const LostPassword = require('../mongo/models/lostpassword');
const expiresIn = 60*60*24*50*365;


const login = async (req, res)=>{
    try {
        const {email, password} = req.body; 
        const user = await Users.findOne({email});
        if(user){
            const isOk = await bcrypt.compare(password, user.password);
            if(isOk){
                
                const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET,{expiresIn});
                res.send({status: "OK", data:{
                 token,
                 expiresIn

                }});
            }else{
                res.status(403).send({status: "INVALID_PASSWORD", message: "user exist"});
            }
          
        }else{
            res.status(401).send({status: "USER_NOT_FOUNT", message: ''});
        }
    } catch (error) {
        res.status(500).send({status: 'ERROR', message: error.message});
    }
}

const createUser = async (req, res) =>{
     try {

        const {username, password, email} = req.body;
        const hash = await bcrypt.hash(password, 15);
        
        await Users.create({
            username, 
            password: hash,
            email
        });
        res.send({status: "OK", message: "user created"});
    } catch(error){
        if(error.code && error.code === 11000){
            res.status(500).send({ status: "DUPLICATED_VALUES", message: error.keyValue})
            return
        }
        
    }
};


const deleteUser = async(req, res) =>{
    try {

        const {username, password, email, userId} = req.body;
        const hash = await bcrypt.hash(password, 15);
        
        await Users.findByIdAndDelete(userId, {
            username, 
            password: hash,
            email
        });
        res.send({status: "OK", message: "user deleted"});
    } catch(error){
        if(error.code && error.code === 11000){
            res.status(500).send({ status: "ERROR", message: error.message})
            return
        }
        
    }
};
const getUser = (req, res) =>{};


const lostPassword = async(req, res) =>{
    let transporter = nodemailer.createTransport({
      host: process.env.HOST_SMTP,
      port: process.env.PORT_MAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
      },
    });
  
    try {
        const {email} = req.body;
        const token = cryptoRandomString({length: 30, type: 'base64'});
        const user = await Users.findOne({email});
        if(user){
            
            await LostPassword.create({
                email, 
                data: token
            });
            let info = await transporter.sendMail({
                from: `"${process.env.NAME_MAIL}" <${process.env.USER_MAIL}>`, // sender address
                to: `${email}, ${email}`, // list of receivers
                subject: "Reset Your Password", // Subject line
                text: "Reset Your Password, click in link to regenetare link", // plain text body
                html: "<b>Reset Your Password, click in link to regenetare link " + token + "</b>", // html body
              });
             
             
            res.send({status: "OK", message: "MAIL SENT"});
          
        }else{
            res.status(401).send({status: "USER_NOT_FOUNT", message: ''});
        }
    } catch(error){
            res.status(500).send({ status: "ERROR_MAIL", message: error.message})
            return   
    }
};

const resetPassword = async (req, res)=> {
const token_get = req.query.token;
const {email, password} = req.body;
if(token_get || email || password){
    try {
        const user = await LostPassword.find({email, data: token_get});
        if(user){
            const hash = await bcrypt.hash(password, 15);
            await Users.findOneAndUpdate({email: email},{password: hash} );
            await LostPassword.deleteMany({email: email});
            res.send({status: "OK", message: "PASSWORD UPDATED"});
            return
        } else {
            res.status(403).send({ status: "ERROR", message: "USER NOT RESET PASS"})
            return
        }
    } catch (error) {
        res.status(403).send({ status: "ERROR", message: error.message})
    }
} else {
    res.status(403).send({ status: "ERROR", message: "MISSING DATA"})
}
}
const updateUser =  async (req, res) =>{
    try {

        const {username, password, email, userId} = req.body;
        const hash = await bcrypt.hash(password, 15);
        
        await Users.findByIdAndUpdate(userId, {
            username, 
            password: hash,
            email
        });
        res.send({status: "OK", message: "user updated"});
    } catch(error){
        if(error.code && error.code === 11000){
            res.status(500).send({ status: "DUPLICATED_VALUES", message: error.keyValue})
            return
        }
    }
};

module.exports = {
    createUser, 
    deleteUser, 
    getUser, 
    updateUser,
    login,
    lostPassword,
    resetPassword};