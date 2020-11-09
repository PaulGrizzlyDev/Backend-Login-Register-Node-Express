const bcrypt = require('bcrypt');
const createUser = async (req, res) =>{
     try {
         console.log("req.body", req.body);
        const hash = await bcrypt.hash(req.body.password, 15);
        console.log("Hash: " + hash);
        res.send({status: "OK", message: "user created"});
    } catch(error){
        res.status(500).send({ status: "error", message: error.message})
    }
};
const deleteUser = (req, res) =>{};
const getUser = (req, res) =>{};
const updateUser = (req, res) =>{};

module.exports = {
    createUser, 
    deleteUser, 
    getUser, 
    updateUser};