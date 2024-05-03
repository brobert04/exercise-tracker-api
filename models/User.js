const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { Exercise } = require('./Exercise'); 

const name = 'User';

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    log: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }], 
    count: {
        type: Number,
        default: 0
    }
});

const User = model(name, userSchema);

module.exports = User;
