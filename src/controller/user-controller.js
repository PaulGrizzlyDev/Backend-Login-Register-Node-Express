const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../mongo/models/users');
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


const deleteUser = (req, res) =>{};
const getUser = (req, res) =>{};
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
    login};