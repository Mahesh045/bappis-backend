const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const matchSchema = new Schema({
    matchID: {
        type: Number
    },
    p_winner: {
        type: Number
    },
    p_tied : {
        type : Number
    },
    p_motm: {
        type: String
    },
    p_runs: {
        type: String
    },
    p_wickets: {
        type: String
    },
    p_score_a: {
        type: String
    },
    p_id_a: {
        type: Number
    },
    p_score_b: {
        type: String
    },
    p_id_b: {
        type: Number
    },
    a_winner: {
        type: Number
    },
    a_motm: {
        type: String
    },
    a_runs: {
        type: String
    },
    a_wickets: {
        type: String
    },
    a_score_a: {
        type: Number
    },
    a_score_b: {
        type: Number
    },
    a_tied : {
        type : Number
    },
    score: {
        type: Number
    }
},{
    timestamps : true
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    totalScore: {
        type: Number,
        default : 0
    },
    predictions: [matchSchema]
},{
    timestamps : true
});

var Users = mongoose.model('User', userSchema);

module.exports = Users;