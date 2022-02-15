const firebase = require("firebase-admin")
firebase.initializeApp({ credential: firebase.credential.applicationDefault() });

exports.FCM = ({ title, body }, token) => {
  return firebase.messaging().send({ notification: { title, body }, token })
}
