const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./models/userModel');
const bodyParser = require('body-parser')
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

let api1 = express.Router();

api1.use(bodyParser.urlencoded({ extended: false }));
api1.use(bodyParser.json());



api1.post("/createUser", function(req, res){
  let item = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.Email,
    historyEasy: req.body.state.history.easy,
    historyNormal: req.body.state.history.normal,
    historyTrivaNormal: req.body.state.history.TrivaNormal,
    historyMinisterial: req.body.state.history.Ministerial,
    highScoreEasy: req.body.state.highScores.easy,
    highScoreNormal: req.body.state.highScores.normal,
    highScoreTrivaNormal: req.body.state.highScores.TrivaNormal,
    highScoreMinisterial: req.body.state.highScores.Ministerial,
    totalPointsEasy: req.body.state.totalPoints.easy,
    totalPointsNormal: req.body.state.totalPoints.normal,
    totalPointsTrivaNormal: req.body.state.totalPoints.TrivaNormal,
    totalPointsMinisterial: req.body.state.totalPoints.Ministerial,
  };

  console.log(item)

  let data = new User(item);
  User.findOne({username: item.username},(err, doc) => {
    if(err){
      console.log(err);
    }
    if(doc){
      res.send("The username already exists")
    }else{
      data.save();
      res.send("Created")
    }
  });
});

api1.post("/updateUser", function(req, res){
  let username = req.body.username;
  let historyEasy = req.body.state.historyEasy;
  let historyNormal = req.body.state.historyNormal;
  let historyTrivaNormal = req.body.state.historyTrivaNormal;
  let historyMinisterial = req.body.state.historyMinisterial;
  let highScoreEasy = req.body.state.highScoresEasy;
  let highScoreTrivaNormal = req.body.state.highScoresTrivaNormal;
  let highScoreNormal = req.body.state.highScoresNormal;
  let highScoreMinisterial = req.body.state.highScoresMinisterial;
  let totalPointsEasy = req.body.state.totalPointsEasy;
  let totalPointsTrivaNormal = req.body.state.totalPointsTrivaNormal;
  let totalPointsNormal = req.body.state.totalPointsNormal;
  let totalPointsMinisterial = req.body.state.totalPointsMinisterial;

  User.findOneAndUpdate({username: username}, {historyEasy: historyEasy, historyNormal: historyNormal, historyTrivaNormal: historyTrivaNormal, historyMinisterial: historyMinisterial, highScoreEasy: highScoreEasy, highScoreNormal: highScoreNormal, highScoreTrivaNormal: highScoreTrivaNormal, highScoreMinisterial: highScoreMinisterial, totalPointsEasy: totalPointsEasy, totalPointsNormal: totalPointsNormal, totalPointsTrivaNormal:totalPointsTrivaNormal, totalPointsMinisterial: totalPointsMinisterial}, function(error, doc){
    if(error){
      throw error
    }
    else{
      res.send("Updated")
    }
  });
});

api1.post("/sendUserData", function(req, res){
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username}, async (err, doc) => {
    if(err){
      console.error(err);
    }
    if(doc){
        let hashedPassword = doc.password;
        const match = await bcrypt.compare(password, hashedPassword);
        console.log(match)
        if(match){
          res.send(JSON.stringify(doc));
        }else{
          res.send("Username incorrect");
        }
    }else{
      res.send('User not found')
    }
  })
});

api1.post("/getLeaders", function(req, res){
  let myObject = {
    highScoreEasy: {},
    highScoreNormal: {},
    highScoreTrivaNormal: {},
    highScoreMinisterial: {},
    totalPointsEasy: {},
    totalPointsNormal: {},
    totalPointsTrivaNormal: {},
    totalPointsMinisterial: {},
  };
  User.find()
   .sort("-highScoreEasy")
   .limit(3)
   .exec((error,data) =>{
     for(let i = 0; i < data.length; i++){
       myObject.highScoreEasy[data[i].username] = data[i].highScoreEasy;
     }
     User.find()
      .sort("-highScoreNormal")
      .limit(3)
      .exec((error,data) =>{
        for(let i = 0; i < data.length; i++){
          myObject.highScoreNormal[data[i].username] = data[i].highScoreNormal;
        }
        User.find()
         .sort("-highScoreTrivaNormal")
         .limit(3)
         .exec((error,data) =>{
           for(let i = 0; i < data.length; i++){
             myObject.highScoreTrivaNormal[data[i].username] = data[i].highScoreTrivaNormal;
           }
           User.find()
            .sort("-highScoreMinisterial")
            .limit(3)
            .exec((error,data) =>{
              for(let i = 0; i < data.length; i++){
                myObject.highScoreMinisterial[data[i].username] = data[i].highScoreMinisterial;
              }
              User.find()
               .sort("-totalPointsEasy")
               .limit(3)
               .exec((error,data) =>{
                 for(let i = 0; i < data.length; i++){
                   myObject.totalPointsEasy[data[i].username] = data[i].totalPointsEasy;
                 }
                 User.find()
                  .sort("-totalPointsNormal")
                  .limit(3)
                  .exec((error,data) =>{
                    for(let i = 0; i < data.length; i++){
                      myObject.totalPointsNormal[data[i].username] = data[i].totalPointsNormal;
                    }
                    User.find()
                     .sort("-totalPointsTrivaNormal")
                     .limit(3)
                     .exec((error,data) =>{
                       for(let i = 0; i < data.length; i++){
                         myObject.totalPointsTrivaNormal[data[i].username] = data[i].totalPointsTrivaNormal;
                       }
                       User.find()
                        .sort("-totalPointsMinisterial")
                        .limit(3)
                        .exec((error,data) =>{
                          for(let i = 0; i < data.length; i++){
                            myObject.totalPointsMinisterial[data[i].username] = data[i].totalPointsMinisterial;
                          }
                          console.log(myObject)
                          res.send(JSON.stringify(myObject))
                        });
                     });
                  });
               });
            });
         });
      });
   });
});

api1.post("/forgotPassword", function(req, res){

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aaronjwilliams.mobiledev@gmail.com',
        pass: 'Airjwil1998'
      }
    });

    let username = req.body.username;
    let newPassword = '';

    for(let i = 0; i < 6; i++){
      let myDigit = Math.floor(Math.random() * 10);
      newPassword += myDigit.toString();
    }


    User.findOne({username: username}, async (err, doc) => {
      if(err){
        console.error(err);
      }
      if(doc){
        let email = doc.email;
        doc.password = newPassword;
        doc.save();

        let mailOptions = {
          from: 'aaronjwilliams.mobiledev@gmail.com',
          to: email,
          subject: 'Temporary password',
          text: newPassword
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.send('Seems like you did not set use a valid email address...')
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

      }else{
        res.send('User not found')
      }
    })
  });

api1.post("/changePassword", function(req, res){
  let username = req.body.username;
  let currentPassword = req.body.currentPassword;
  let newPassword = req.body.newPassword;

  User.findOne({username: username}, async (err, doc) => {
    if(err){
      console.error(err);
    }
    if(doc){
        let hashedPassword = doc.password;
        const match = await bcrypt.compare(currentPassword, hashedPassword);
        if(match){
          doc.password = newPassword;
          doc.save();
          res.send("Password Updated")
        }else{
          res.send("Current password incorrect");
        }
    }else{
      res.send('User not found')
    }
  })
});

api1.post("/AddFriend", function(req, res){
  let username = req.body.username;
  let friendsUsername = req.body.friendsUsername;
  //this is currently storing the objects id for the friend's field
  User.findOne({username: friendsUsername}, (err, doc1)=>{
    if(err){
      console.error(err);
    }
    if(doc){
      User.findOneAndUpdate({username: username}, {'$push': {'friends': doc}}, function(error, doc2){
        if(error){
          throw error
        }
        else{
          doc1.friends.push(doc2);
          res.send("Updated")
        }
      });
    }else{
      res.send('not found')
    }
  });

api1.post("/displayFriendsName", function(req, res){
  let username = req.body.username;

  User.findOne({username: username}, (err, doc)=>{
    if(err){
      console.error(err);
    }
    if(doc){
      let allFriends = [];
      for(let i = 0; i <= doc.friends.length; i++){
        User.findOne({_id: doc.friends[i]}, (err, doc2)=>{
          if(err){
            console.error(err);
          }
          if(doc2){
            let username = doc2.username;
            allFriends.push(username);
          }
          if(i === doc.friends.length){
            res.send(JSON.stringify(allFriends))
          }
        })
      }
    }
  })
});

api1.post("/showFriends", function(req, res){
  let username = req.body.username;

  User.findOne({username: username}, (err, doc1)=>{
    if(err){
      console.error(err);
    }
    if(doc1){
      let myObject = {
        highScoreEasy: [],
        highScoreNormal: [],
        highScoreTrivaNormal: [],
        highScoreMinisterial: [],
        totalPointsEasy: [],
        totalPointsNormal: [],
        totalPointsTrivaNormal: [],
        totalPointsMinisterial: [],
      };

      let highScoreEasy = [];
      let highScoreNormal = [];
      let highScoreTrivaNormal = [];
      let highScoreMinisterial = [];
      let totalPointsEasy = [];
      let totalPointsNormal = [];
      let totalPointsTrivaNormal = [];
      let totalPointsMinisterial = [];

      let username0 = doc1.username;
      let highScoresEasy0 = doc1.highScoreEasy;
      let highScoresNormal0 = doc1.highScoreNormal;
      let highScoreTrivaNormal0 = doc1.highScoreTrivaNormal;
      let highScoreMinisterial0 = doc1. highScoreMinisterial;
      let totalPointsEasy0 = doc1.totalPointsEasy;
      let totalPointsNormal0 = doc1.totalPointsNormal;
      let totalPointsTrivaNormal0 = doc1.totalPointsTrivaNormal;
      let totalPointsMinisterial0 = doc1.totalPointsMinisterial;

      highScoreEasy.push(username0, highScoresEasy0);
      highScoreNormal.push(username0, highScoresNormal0);
      highScoreTrivaNormal.push(username0, highScoreTrivaNormal0);
      highScoreMinisterial.push(username0, highScoreMinisterial0);
      totalPointsEasy.push(username0, totalPointsEasy0);
      totalPointsNormal.push(username0, totalPointsNormal0);
      totalPointsTrivaNormal.push(username0, totalPointsTrivaNormal0);
      totalPointsMinisterial.push(username0, totalPointsMinisterial0);

      myObject.highScoreEasy.push(highScoreEasy);
      myObject.highScoreNormal.push(highScoreNormal);
      myObject.highScoreTrivaNormal.push(highScoreTrivaNormal);
      myObject.highScoreMinisterial.push(highScoreMinisterial);
      myObject.totalPointsEasy.push(totalPointsEasy);
      myObject.totalPointsNormal.push(totalPointsNormal);
      myObject.totalPointsTrivaNormal.push(totalPointsTrivaNormal);
      myObject.totalPointsMinisterial.push(totalPointsMinisterial);

      let arrayOfFriendsObjects = doc1.friends;
      for(let i = 0; i < arrayOfFriendsObjects.length; i++){
        let highScoreEasyA = [];
        let highScoreNormalA = [];
        let highScoreTrivaNormalA = [];
        let highScoreMinisterialA = [];
        let totalPointsEasyA = [];
        let totalPointsNormalA = [];
        let totalPointsTrivaNormalA = [];
        let totalPointsMinisterialA = [];
        User.findOne({_id: arrayOfFriendsObjects[i]}, (err, doc2)=>{
          if(err){
            console.error(err)
          }
          if(doc2){
            let username1 = doc2.username;
            let highScoresEasy1 = doc2.highScoreEasy;
            let highScoresNormal1 = doc2.highScoreNormal;
            let highScoreTrivaNormal1 = doc2.highScoreTrivaNormal;
            let highScoreMinisterial1 = doc2. highScoreMinisterial;
            let totalPointsEasy1 = doc2.totalPointsEasy;
            let totalPointsNormal1 = doc2.totalPointsNormal;
            let totalPointsTrivaNormal1 = doc2.totalPointsTrivaNormal;
            let totalPointsMinisterial1 = doc2.totalPointsMinisterial;

            highScoreEasyA.push(username1, highScoresEasy1);
            highScoreNormalA.push(username1, highScoresNormal1);
            highScoreTrivaNormalA.push(username1, highScoreTrivaNormal1);
            highScoreMinisterialA.push(username1, highScoreMinisterial1);
            totalPointsEasyA.push(username1, totalPointsEasy1);
            totalPointsNormalA.push(username1, totalPointsNormal1);
            totalPointsTrivaNormalA.push(username1, totalPointsTrivaNormal1);
            totalPointsMinisterialA.push(username1, totalPointsMinisterial1);

            myObject.highScoreEasy.push(highScoreEasyA);
            myObject.highScoreNormal.push(highScoreNormalA);
            myObject.highScoreTrivaNormal.push(highScoreTrivaNormalA);
            myObject.highScoreMinisterial.push(highScoreMinisterialA);
            myObject.totalPointsEasy.push(totalPointsEasyA);
            myObject.totalPointsNormal.push(totalPointsNormalA);
            myObject.totalPointsTrivaNormal.push(totalPointsTrivaNormalA);
            myObject.totalPointsMinisterial.push(totalPointsMinisterialA);
          }
          myObject.highScoreEasy.sort(function(a,b){return a[1] < b[1]});
          myObject.highScoreNormal.sort(function(a,b){return a[1] < b[1]});
          myObject.highScoreTrivaNormal.sort(function(a,b){return a[1] < b[1]});
          myObject.highScoreMinisterial.sort(function(a,b){return a[1] < b[1]});
          myObject.totalPointsEasy.sort(function(a,b){return a[1] < b[1]});
          myObject.totalPointsNormal.sort(function(a,b){return a[1] < b[1]});
          myObject.totalPointsTrivaNormal.sort(function(a,b){return a[1] < b[1]});
          myObject.totalPointsMinisterial.sort(function(a,b){return a[1] < b[1]});
          res.send(JSON.stringify(myObject));
        })
      }
    }else{
      res.send("method failed")
    }
  });
});

module.exports = api1;
