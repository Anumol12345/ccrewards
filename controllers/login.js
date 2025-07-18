
 const tokenData = require('./token');
 const { User, Session } = require('../model/login');
const qs = require('qs');
 const axios = require('axios');
const fs = require('fs');
const path = require('path');

  const CLIENT_ID = "559968047699-o0nqrre40smfuvqe2056kk4331al2a9k.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://ccrewardstech12.netlify.app/home"


exports.auth = (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&access_type=offline` +
    `&prompt=consent`;

res.send({url:authUrl});
};

exports.callback = async (req, res) => {
  const sendData =JSON.parse(req.body.inputObjs)[0];
  const  code  = sendData.Code;

  try {
   
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token',
      qs.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token } = tokenResponse.data;

    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    var { name, email, picture } = userInfo.data;
    const hostedUrl = await downloadAndSaveGoogleImage(picture,email);

    let isNewUser = false;
    let user = await User.findOne({ email });
    if (!user) {
      picture = hostedUrl
      user = new User({ name, email, picture });
      await user.save();
      isNewUser = true;
    }
    else {
    user.name = name;
    user.picture = hostedUrl;
    await user.save();
    }

    const token =tokenData.createToken(email);
    
    let session = await Session.findOne({ userId: email });

    const newSessionId = token;

    if (session) {
     
      session.sessionId = newSessionId;
      session.createdAt = new Date();
      session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await session.save();
    } else {
    
      session = await new Session({
        sessionId: newSessionId,
        userId: email,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }).save();
    }
     

          const resultobj={
                          sessionkey :newSessionId,
                          userid :email,
                          name:name,
                          profileImage : picture,
                          isNew :isNewUser
                       }
      
          
        res.send(resultobj) ;

  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    res.status(500).send('Google login failed');
  }
};

exports.logoutUser = async (req, res) => {
  console.log(req.body.sessionKey);
  
  const  sessionId  = req.body.sessionKey;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    const result = await Session.findOneAndDelete({ sessionId });

    if (result) {
      res.json({ message: 'Logout successful' });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


async function downloadAndSaveGoogleImage(googleImageUrl,email){
  const response = await axios.get(googleImageUrl, { responseType: 'arraybuffer' });

  const buffer = Buffer.from(response.data, 'binary');

  const safeName = email.split('@')[0]; 
  const fileName = `${safeName}-acc.png`;

 const uploadDir = path.join(__dirname, '../public/uploads');

  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);


  return `https://CCRewardsTech.onrender.com/uploads/${fileName}`;

}
