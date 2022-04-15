import user from '../models/User.js';

const register = async (req, res) => {
    try{
        if(!req.body.fullName){
            throw { code: 428, message: "Fullname is Required " }
        }
        if(!req.body.email){
            throw { code: 428, message: "Email is Required " }
        }
        if(!req.body.password){
            throw { code: 428, message: "Password is Required " }
        }

        const newUser = new user({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        });
        const User = await newUser.save();

        if(!User) { throw { code : 500, message: "USER_REGISTER_FAILED" } }

        return res.status(200).json({
            status: true,
            message: USER_REGISTER_SUCCESS,
            User
        });
    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

export { register };