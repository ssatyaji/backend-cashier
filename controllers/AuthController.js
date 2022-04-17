import user from '../models/User.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import e from 'express';
const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_ACCESS_TOKEN_SCRET,
        { expiresIn: env.JWT_ACCESS_TOKEN_LIFE }
    );
}

const generateRefreshToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_REFRESH_TOKEN_SCRET,
        { expiresIn: env.JWT_REFRESH_TOKEN_LIFE }
    );
}

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

        //check if password match
        if(req.body.password !== req.body.retype_password) {
            throw { code: 409, message: "PASSWORD_MUST_MATCH"}
        }
        
        //check if email exist
        const email = await user.findOne({ email: req.body.email })
        if(email) {
            throw { code: 428, message: "EMAIL_EXIST"}
        }

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);

        const newUser = new user({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hash,
            role: req.body.role,
        });
        const User = await newUser.save();

        if(!User) { throw { code : 500, message: "USER_REGISTER_FAILED" } }

        return res.status(200).json({
            status: true,
            message: 'USER_REGISTER_SUCCESS',
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

const login = async (req, res) => {
    try{
        if(!req.body.email){
            throw { code: 428, message: "Email is Required " }
        }
        if(!req.body.password){
            throw { code: 428, message: "Password is Required " }
        }
        
        //check if email exist
        const User = await user.findOne({ email: req.body.email })
        if(!User) { throw { code: 404, message: "EMAIL_NOT_FOUND"}}

        //check is password match
        const isMatch = await bcrypt.compareSync(req.body.password, User.password);
        if(!isMatch) { throw { code: 428, message: "PASSWORD_WRONG" }}

        //generate token
        const payload = { id: User._id, role: User.role };
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return res.status(200).json({
            status: true,
            message: 'LOGIN_SUCCESS',
            accessToken,
            refreshToken
        });
    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const refreshToken = async (req, res) => {
    try{
        if(!req.body.refreshToken){
            throw { code: 428, message: "Refresh Token is Required " }
        }

        //verify token
        const verify = await jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SCRET);
        if(!verify) { throw { code: 401, message: "REFRESH_TOKEN_INVALID" }}

        //generate token
        let payload = { _id: verify._id, role: verify.role };
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return res.status(200).json({
            status: true,
            message: 'REFRESH_TOKEN_SUCCESS',
            accessToken,
            refreshToken
        });
    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

export { register, login, refreshToken };