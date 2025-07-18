const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: String,
  image: String,
  name: String,
  type: String,
  joiningFee: String,
  rewardsRate: String,
  description: String,
  rating: Number 
});
const creditCardSchema = new mongoose.Schema({
  image: String,
  name: String,
  bankName: String,
  joiningFee: Number,
  annualFee: Number,
  typeId: Number,
  bestFor: [String]
});

const CardsSchema = new mongoose.Schema({
  image: String,
  cardId :Number,
  name: String,
  bankName: String,
  joiningFee: Number,
  annualFee: Number,
  typeId: Number,
  bestFor: [String],
   offer:Number,
  cashBack:Number,
  interest:Number,
  network:String,
  networkId:Number,
});

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  limit: { type: String },   
  email: { type: String, required: true }, 
  emailHash: { type: String, required: true, unique: true }, 
  cards: { type: String } 
});


const UserCards = mongoose.model('UserCards', UserSchema, 'UserCards');
const CardList = mongoose.model('CardList', cardSchema, 'CardList');
const CreditCard = mongoose.model('CreditCard', creditCardSchema, 'CreditCard');
const Cards = mongoose.model('Cards', CardsSchema, 'Cards');

module.exports = { CardList, CreditCard,Cards,UserCards };