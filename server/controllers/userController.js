const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');


exports.registerUser = asyncHandler(async function(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password ) {
        res.status(400);
        throw new Error('Please provide a username and password')
    }

    const userAlreadyExists = await User.findOne({username});

    if (userAlreadyExists) {
        res.status(400);
        throw new Error('User already exists')
    }

    // Hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        password: hashedPw
    })

    if (user) {
        const token = generateToken(user._id);
        res.status(201).send(`Register successful. token: ${ token }`)
    }   else {
        res.status(400)
        throw new Error('Invalid user data')
    }
});

exports.loginUser = asyncHandler(async function(req, res, next) {
    const { username, password } = req.body;

    const userDetails = await User.findOne({ username });

    if (userDetails && (await bcrypt.compare(password, userDetails.password))) {
        const token = generateToken(userDetails._id);
        res.send(`Login successful. token: ${ token }`);
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

exports.getUserData = asyncHandler(async function(req, res, next) {
    res.json(req.user);
    const { _id, username } = await User.findById(req.user._id);

    res.status(200).send(`${ _id }, ${ username }`);
});

// Generate web token

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET)
}
