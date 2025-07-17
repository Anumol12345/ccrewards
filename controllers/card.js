
const { CardList, CreditCard,Cards, UserCards} = require('../model/card');
const tokenData = require('./token');

const crypto = require('crypto');

// AES-256 key must be 32 bytes:
//const ENCRYPTION_KEY = crypto.randomBytes(32);
const ENCRYPTION_KEY = Buffer.from('01234567890123456789012345678901'); // replace with your secure key
const ALGORITHM = 'aes-256-gcm';



compareCards =[];
bankNames = [];

// Get all cards
exports.getAllCards = async (req, res) => {
  try {
  
    const cards = await CardList.find();
  
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllCategory = async (req, res) => {


 if(JSON.parse(req.body.inputObjs)[0]){
  console.log(JSON.parse(req.body.inputObjs)[0]);
   const sendData =JSON.parse(req.body.inputObjs)[0];
  let typeId  = sendData.typeId;
  try {
  
    const cards = await CreditCard.find({ typeId: typeId });
   
   
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 }
 else{
  try {
  
    const cards = await Cards.find();
   
   
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 }
 
};
exports.getCategoryById = async (req, res) => {

var id = req.params.id;
  
  try {
  
    const cards = await Cards.find({ cardId: id });
   
   
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 

 
};

exports.getCategory = async (req, res) => {


 if(JSON.parse(req.body.inputObjs)[0]){
  console.log(JSON.parse(req.body.inputObjs));
   const sendData =JSON.parse(req.body.inputObjs)[0];
   console.log(sendData.selectedOff);
   
   
   let query = {};
     
     const conditions = [];

   if(sendData.selectedOff){
    let selectedOff = sendData.selectedOff
    
     if (selectedOff.includes(1)) {
       conditions.push({ offer: { $gt: 0 } });
     }

     if (selectedOff.includes(2)) {
       conditions.push({ offer: { $gt: 40 } });
     }

   
  
   }
   if(sendData.selectedBen){
  let selectedBen = sendData.selectedBen
    
     if (selectedBen.includes(1)) {
       conditions.push({ cashBack: { $gt: 0 } });
     }

     if (selectedBen.includes(2)) {
       conditions.push({typeId : 2 });
     }
   }
  
    if(sendData.selectedFea){
  let selectedFea = sendData.selectedFea
    console.log(selectedFea);
    
     if (selectedFea.includes(1)) {
       conditions.push({ annualFee:0 , joiningFee:0 });
     }

     if (selectedFea.includes(3)) {
       conditions.push({interest : { $lt: 20 } });
     }
     console.log(conditions);
     
   }
  
    if(sendData.selectedNet){

  if (sendData.selectedNet.length > 0) {
    conditions.push({ networkId: { $in: sendData.selectedNet } });
  }
  
   }
  
    if(sendData.selectedPro.length>0){
  let selectedPro = sendData.selectedPro
    
  const selectedNames = selectedPro.map(item => item.name);

  conditions.push({ bankName: { $in: selectedNames } });
     
  }
    if (conditions.length === 1) {
      query = conditions[0];
     } else if (conditions.length > 1) {
      query = { $and: conditions };
     }

     console.log(query);
     
   try {
  
    const cards = await Cards.find(query);
   
   
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 }

};
 
exports.getCompare = async (req, res) => {


 if(JSON.parse(req.body.inputObjs)[0]){
  
  
   let compare = JSON.parse(req.body.inputObjs)[0];
    const cardsData = await Cards.find({ cardId: { $in: compare } });
   res.status(200).json(cardsData);
 }

};

// exports.getCompareCards = async (req, res) => {

//   res.status(200).json(this.compareCards);

// };


////after login
exports.getBanks = async (req, res) => {
  try {
 
    const token =req.body.sessionKey;

     if (!token) {
		return res.status(401).end()
	  }

    const decoded = tokenData.verifyToken(token);
    console.log(decoded);

    const email = decoded.email;
    if (!email) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const bankNames = await Cards.distinct('bankName');

    const banksWithIds = bankNames.map((name, index) => ({
      id: index + 1,  
      bankName: name
    }));
    this.bankNames = banksWithIds;
    res.status(200).json(banksWithIds);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCardsByBankId = async (req, res) => {
 try {
  const token =req.body.sessionKey;

     if (!token) {
		return res.status(401).end()
	  }

    const decoded = tokenData.verifyToken(token);
    console.log(decoded);

    const email = decoded.email;
    if (!email) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const id = Number(req.params.id);
   console.log(this.bankNames);
   
   const bank = this.bankNames.find(b => b.id === id);

    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    const cards = await Cards.find({ bankName: bank.bankName });

    

    res.status(200).json(cards);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.saveProfile = async (req, res) => {
  try {
    const token =req.body.sessionKey;
     if (!token) {
		return res.status(401).end()
	  }

    const decoded = tokenData.verifyToken(token);
    console.log(decoded);

    if (!decoded.email) {
      return res.status(400).json({ message: "Invalid token" });
    }

     const sendData = JSON.parse(req.body.inputObjs)[0];
    const { userName, email, cards,limit } = sendData;


    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
console.log(cards);

 const encryptedUserName = encrypt(userName);
const encryptedEmail = encrypt(email);


var encryptedLimit = "";
if(limit){
 encryptedLimit = encrypt(limit);
}
var encryptedCards = "";
if(cards.length > 0){
encryptedCards = encrypt(JSON.stringify(cards));
}

console.log(encryptedCards);

 const emailHash = hashEmail(email);
 const existingUser = await UserCards.findOne({ emailHash });
//const existingUser = await UserCards.findOne({ email: encryptedEmail });

let savedUser;

if (existingUser) {
  existingUser.userName = encryptedUserName;
  existingUser.limit = encryptedLimit;
  existingUser.cards = encryptedCards;
  savedUser = await existingUser.save();
} else {
  const newUser = new UserCards({
    userName: encryptedUserName,
    email: encryptedEmail,
    limit: encryptedLimit,
    emailHash: emailHash,
    cards: encryptedCards
  });
  savedUser = await newUser.save();
    }
   console.log(savedUser);
   
   if(savedUser.limit){

   }

    const decryptedUser = {
  userName: decrypt(savedUser.userName),
  email: decrypt(savedUser.email),
  limit: savedUser.limit ? decrypt(savedUser.limit) : "",
  cards: savedUser.cards ? JSON.parse(decrypt(savedUser.cards)) : []
};

    res.status(201).json(decryptedUser);

  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getProfile = async (req, res) => {

 try {
  const token =req.body.sessionKey;
  const email =req.body.userid

     if (!token) {
		return res.status(401).end()
	  }

    const decoded = tokenData.verifyToken(token);
    console.log(decoded);

    if (!decoded.email) {
      return res.status(400).json({ message: "Invalid token" });
    }

      if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailHash = hashEmail(email);
    const user = await UserCards.findOne({ emailHash });
    console.log(user);
    

   if (!user) {
      // ✅ Return empty array if no user found
      return res.status(200).json([]);
    }

    const decryptedUser = {
      userName: decrypt(user.userName),
      email: decrypt(user.email),
      limit: user.limit ? decrypt(user.limit) : "",
      cards: user.cards ? JSON.parse(decrypt(user.cards)) : []
    };
   console.log(decryptedUser);
    res.status(200).json(decryptedUser);


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

};


function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

function encrypt(text) {
  const iv = crypto.randomBytes(16); // initialization vector
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  //return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
