const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const name = 'Exercise';

const exerciseSchema = new Schema({
    description: {
        type: String, 
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Exercise = model(name, exerciseSchema);

module.exports = [Exercise, exerciseSchema];  
