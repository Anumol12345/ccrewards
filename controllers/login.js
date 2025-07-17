// const ModelData = require('../model/login');
 const tokenData = require('./token');
 const { User, Session } = require('../model/login');
const qs = require('qs');
 const axios = require('axios');
const fs = require('fs');
const path = require('path');

  const CLIENT_ID = "559968047699-o0nqrre40smfuvqe2056kk4331al2a9k.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:4200/home"

//const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;

//const FRONTEND_URL = 'http://localhost:4200/home';


// exports.auth = async(req, res, next) => {
   
//     if (!authed) {
//       // Generate an OAuth URL and redirect there
//       const url = oAuth2Client.generateAuthUrl({
//           access_type: 'offline',
//           prompt: 'consent',
//           scope: ['https://www.googleapis.com/auth/gmail.readonly',
//               'https://www.googleapis.com/auth/userinfo.profile',
//               'https://www.googleapis.com/auth/userinfo.email']
//         });
//       console.log(url)
//       res.send({url:url});
//      } else {
//       const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
//       gmail.users.labels.list({
//           userId: 'me',
//       }, (err, res) => {
//           if (err) return console.log('The API returned an error: ' + err);
//           const labels = res.data.labels;
//           if (labels.length) {
//               console.log('Labels:');
//               labels.forEach((label) => {
//                   console.log(`- ${label.name}`);
//               });
//           } else {
//               console.log('No labels found.');
//           }
//       });
//       res.send('Logged in')
//   }
// };;

// exports.callback = async(req, res, next) => {
//     //const sendData =JSON.parse(req.body.inputObjs)[0];
//     //  console.log(sendData);
//     // console.log(req.query.code);
//     // const code = sendData.Code
//      const code = req.query.code;
//      console.log(code);
//     if (code) {
  
//         // Get an access token based on our OAuth code
//         oAuth2Client.getToken(code, function (err, tokens) {
//             if (err) {
//                 console.log('Error authenticating')
//                 console.log(err);
//             } else {
//                 console.log('Successfully authenticated');
//                 oAuth2Client.setCredentials(tokens);
//                 authed = true;
                
//                 axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
//                   {
//                     headers: {
//                       Authorization: `Bearer ${tokens.id_token}`,
//                     },
//                   }
//                 )
//                 .then(async function(result) {
//                     console.log(result.data);
//                     const email = result.data.email;
//                     //const loginModel = new ModelData(null ,email,null);
//                     //const usersign =await loginModel.SelectUser();

//                     // if(usersign[0]){
//                     //   const token =tokenData.createToken(email);
//                     //     console.log(token);  
                     
                     
//                     //     const prof_data = await new ModelData().SelectProfile(email);
//                     //     var name ='';
//                     //     if(prof_data[0]){
//                     //        name = prof_data[0].name;
//                     //        await new ModelData().UpdateUser(name,email);
                 
//                     //     }
//                     //     else{
//                     //      name =usersign[0].name;
//                     //     }
//                     //     var session = req.session;
//                     //     session.sessionkey  = token;
//                     //     session.userid  = usersign[0].email;
//                     //     session.name  = name;
//                     //     if(prof_data[0]){
//                     //       if(prof_data[0].image){
//                     //       session.userimg = prof_data[0].image
//                     //       }
//                     //      }
                       
//                     //     console.log(session);
                       
                       
//                     //     await new ModelData().SaveSession(session.userid ,session.sessionkey );
                 
//                     //     const resultobj={
//                     //       sessionkey :session.sessionkey,
//                     //       userid :session.userid,
//                     //       name:session.name,
//                     //       profileImage : session.userimg
//                     //    }
                      
//                     //     console.log(resultobj);
//                     //     res.send(resultobj) ;
//                     // }
//                   //  else{
//                     //   const name = result.data.name;
//                     //   const email = result.data.email;
//                     //   const RegModel = new ModelData(name ,email,null);
//                     //   console.log(result.data);
//                     //  // const result1 =await RegModel.SaveUser(); 
//                       //if(result1){

//                         const token =tokenData.createToken(email);
//                         console.log(token);
                
//                         var session = req.session;
//                         session.sessionkey  = token;
//                         session.userid  = email;
//                        // session.name  = name;
//                         console.log(session);
//                         //await new ModelData().SaveSession(session.userid ,session.sessionkey )
                       
//                           req.session.user = { email };

    
//                             res.redirect(`http://localhost:4200/home`);
//                       //  const resultobj={
//                       //      sessionkey :session.sessionkey,
//                       //      userid :session.userid,
//                       //      //name:session.name,
                           
//                       //   }
//                       //   console.log(resultobj);
//                       //   res.send(resultobj) ;
//                      //}
//                     //  if(!result1){
//                     //     res.send({error : "Something wrong"})
//                     //  }
//                     //}

//                 })
//                 .catch(error => {
//                   throw new Error(error.message);
//                 });
               
                
//             }
//         });
//     }
// };;

exports.auth = (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&access_type=offline` +
    `&prompt=consent`;

res.send({url:authUrl});
  //res.redirect(authUrl);
};

exports.callback = async (req, res) => {
  const sendData =JSON.parse(req.body.inputObjs)[0];
console.log(sendData);
  const  code  = sendData.Code;

  try {
    // Exchange code for access token
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

    // Get user info
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
      console.log(token);

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
                      
          console.log(resultobj);
          
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

  const filePath = path.join(__dirname, '../public/uploads', fileName);
  fs.writeFileSync(filePath, buffer);

  return `http://localhost:3000/uploads/${fileName}`;
}
