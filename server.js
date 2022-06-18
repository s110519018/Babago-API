var { google } = require("googleapis");
const express = require("express");
const cors = require("cors");
var MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
var SCOPES = [MESSAGING_SCOPE];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const key = require("./babago.json");
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}



app.get("/", (req, res) => {
  getAccessToken().then(function (accessToken) {
    res.send(accessToken);
  });
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
