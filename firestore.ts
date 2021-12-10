import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import admin = require('firebase-admin');
import serviceAccount = require('./sps-bot-key.json');
import { XMLHttpRequest } from 'xmlhttprequest-ts';
import fs = require('fs');
var logger = require('winston');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmmf-PY9JFAbbcoRlxCEQP6kABFzkYY-U",
  authDomain: "sps-bot-deb06.firebaseapp.com",
  projectId: "sps-bot-deb06",
  storageBucket: "sps-bot-deb06.appspot.com",
  messagingSenderId: "399202606967",
  appId: "1:399202606967:web:76054e4c27186742940b72",
  credentials: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key
  }),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
  })
});
const db = admin.firestore();
const questionsDoc = db.doc("questions/questions");

export const storage = getStorage(app);
export const unansweredCollection = questionsDoc.collection("unanswered");
export const answeredCollection = questionsDoc.collection("answered");
export const shipCharacters = {};

const exceptions = [
  "Angelica Durand",
  "The Beast Within",
  "Ferdinand Vogel",
  "Cojo",
  "Deacon Hillcrest",
  "Elijah Borgmann",
  "Howard Langston",
  "Mouse",
  "Neil Henry",
  "Paul Crockett",
  "Willie",
  "Sparks LeBlanc",
  "Apprentice Wesley",
  "Beau Fishbocker",
  "Burt Jebsen",
  "Cooper Jones",
  "Earl Burns",
  "Fluffernutter",
  "Georgy and Olaf",
  "Merris LaCroix",
  "Old Cranky",
  "Olivia Bernard",
  "Pere Ravage",
  "Rami LaCroix",
  "Raphael LaCroix",
  "Ruffles",
  "Archivist",
  "Austera and Twigge",
  "Bellhop Porter",
  "Cavatica",
  "Dr. Beebe",
  "Eva Havenhand",
  "Harata Ngaatoro",
  "Jin Baccara",
  "Orville Agassiz",
  "Pearl Musgrove",
  "Tannenbaum",
  "Vernon and Welles",
  "Abuela Ortega",
  "Auguste Harte",
  "Bernadette Basse",
  "The Dispatcher",
  "Guild Steward",
  "The Lone Marshal",
  "Nino Ortega",
  "Nurse Heartsbane",
  "Papa Loco",
  "Santiago Ortega",
  "The Scribe",
  "Sly \"Six Shots\"",
  "Undercover Reporter",
  "Coppelius",
  "Doppleganger",
  "Dorian Crowe",
  "Hildegard",
  "Maurice",
  "Serena Bowman",
  "Tuco Ortega",
  "Big Jake",
  "Bishop",
  "Catalan Brawler",
  "Doc Mitchell",
  "Hans",
  "Johan Creedy",
  "Karina",
  "Lady Ligeia",
  "Lazarus",
  "Metallurgist",
  "The Midnight Stalker",
  "Sue",
  "Talos",
  "Thirty-Three",
  "Vanessa Chambers",
  "Archie",
  "Bete Noire",
  "Copycat Killer",
  "The Forgotten Marshal",
  "Jaakuna Ubume",
  "Lost Love",
  "Rafkin",
  "White Rabbit Co.",
  "Chiyo Hamasaki",
  "Kenshiro",
  "Lady Yume",
  "The Lone Swordsman",
  "Mr. Graves",
  "Mr. Tannen",
  "Shōjō",
  "Sun Quiang"
];

// if (fs.existsSync('modelList.json')) {
//   fs.unlinkSync('modelList.json');
// }

function initializeOptions() {
  if (Object.keys(shipCharacters).length > 0) {
    return;
  }
  if (fs.existsSync('modelList.json')) {
    var modelData = fs.readFileSync('modelList.json', { encoding: "utf8" });
    var modelDataJson = JSON.parse(modelData);
    Object.keys(modelDataJson).forEach((key) => {
      shipCharacters[key] = modelDataJson[key];
    });
    return;
  }
  const allModelsRef = ref(storage, 'gs://m3e-crew-builder-22534.appspot.com/allmodels-app-titles.json');
  var allModelsJson = {};
  const xhr = new XMLHttpRequest();
  getDownloadURL(allModelsRef).then(async (url) => {
    logger.info(`Download url for allmodels: ${url}`);
    // xhr.responseType = 'blob';
    xhr.onload = async () => {
      const blob = xhr.responseText;
      allModelsJson = JSON.parse(blob);
      var promises = [];
      Object.keys(allModelsJson['units']).forEach((name) => {
        var character = allModelsJson['units'][name];
        if (character['station'] == 'Minion' || character['station'] == 'Enforcer') {
          if (exceptions.indexOf(name) < 0) {
            return;
          }
        }
        var fileName = character['fileNames']['frontJPGs'][0];

        var fullFileName = `gs://m3e-crew-builder-22534.appspot.com/${fileName}`;
        promises.push(getDownloadURL(ref(storage, fullFileName)).then((url) => {
          shipCharacters[name] = url;
        }));
      });
      await Promise.all(promises);
      // Write data to modelList.json so it can be read later.
      logger.info('Writing modelList.json');
      fs.writeFileSync("modelList.json", JSON.stringify(shipCharacters));
    };
    xhr.open('GET', url);
    xhr.send();
  });
}

initializeOptions();

/// Initialize the options of characters to ship or FMK.
export async function initializeOptionsAsync() {
  if (Object.keys(shipCharacters).length > 0) {
    return;
  }
  // Read from modelList.json if it exists, otherwise get data from models file.
  if (fs.existsSync('modelList.json')) {
    var modelData = fs.readFileSync('modelList.json', { encoding: "utf8" });
    var modelDataJson = JSON.parse(modelData);
    Object.keys(modelDataJson).forEach((key) => {
      shipCharacters[key] = modelDataJson[key];
    });
    return;
  }
}

module.exports = {
  answeredCollection: answeredCollection,
  unansweredCollection: unansweredCollection,
  initializeOptionsAsync: initializeOptionsAsync,
  shipCharacters: shipCharacters,
};
