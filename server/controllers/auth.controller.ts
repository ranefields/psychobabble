import * as passport from 'passport';
import { User } from './../models/User';
import { ValidationToken } from './../models/ValidationToken';
import { Video } from './../models/Video';
// https://www.sitepoint.com/user-authentication-mean-stack/
export class AuthController {
  public static registerClient(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    if (!username || !email || !password) {
      res.status(400);
      res.json({
        message: "One or more required fields were missing"
      });
    }
    else {
      console.log(`Registering ${username} | ${email}...`)
      User.registerClientAsync(username, email, password)
      .then((user) => {
        if (user) {
          let msg = `Registered ${username} with id ${user.id}`;
          console.log(msg);
          res.status(200);
          res.json({
            message: msg,
            token: user.generateJwt()
          });
        }
        else {
          let msg = `Username or email taken`;
          console.log(msg);
          res.status(422);
          res.json({
            message: msg
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
      })
    }
  }

  public static async getBucket(req, res) {
    if(req.jwt.role = "ADMIN") {
      res.status(200);
      res.json({
        videoId: await Video.createVideo(),
        userName: req.jwt.username,
        bucket: process.env.BUCKET_NAME
      });
    } else {
      res.status(401);
      res.json({
        message: "Not Authorized"
      })
    }
  }

  public static async uploadVideo(req, res) {
    if(req.jwt.role = "Admin") {
      let result = await Video.upload(req.body.url, req.body.videoId);
      if(result) {
        res.status(200);
        res.json({
          message: "Video Successfully Uploaded"
        })
      } else {
        res.status(500);
        res.json({
          message: "Something Went Wrong"
        })
      }
    } else {
      res.status(401);
      res.json({
        message: "Not Authorized"
      })
    }
  }

  public static verifyUser(req, res) {
    console.log(req.body)
    if(req.jwt && req.jwt.id) {
      ValidationToken.checkVerify(req.body.code, req.jwt.id).then((user) => {
        res.status(200);
        res.json({
          message: "validated",
          token: user.generateJwt()
        });
      })
    } else {
      res.status(500)
    }
  }

  public static loginLocal(req, res) {
    let loginName = req.body.loginName;
    passport.authenticate('local', (err, user, info) => {
      console.log(`Logging in ${loginName}...`)
      if (err) {
        console.error(err);
        res.status(500).json(err);
        return;
      }
      if (user) {
        let msg = `Successfully logged in ${loginName}`;
        console.log(msg);
        res.status(200);
        res.json({
          message: msg,
          token: user.generateJwt()
        });
      }
      else {
        let msg = `Login failed: ${info.message}`;
        console.log(msg);
        res.status(401).json(info);
      }
    })(req, res);
  }
}
