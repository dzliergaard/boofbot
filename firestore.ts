import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import admin = require('firebase-admin');
import serviceAccount = require('./sps-bot-key.json');
import { XMLHttpRequest } from 'xmlhttprequest-ts';
import fs = require('fs');
import assert = require("assert");
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

export function random<T>(from: Array<T>): T {
  return from[Math.floor(Math.random() * from.length)];
}

export class ModelInfo {
  name: string;
  imageFiles: string[];
  keywords: string[];

  constructor(json: object) {
    this.name = json['name'];
    this.imageFiles = json['imageFiles'] ?? json['fileNames']['frontJPGs'].slice();
    this.keywords = json['keywords'];
  }

  randomImage(): string {
    if (this.imageFiles.length > 0) {
      return random(this.imageFiles);
    }
    return "";
  }
}

class ModelsInfo {
  models = new Map<string, ModelInfo>();
  shipCharacters = new Array<string>();
  keywords = new Array<string>();

  parseFromJson(json: Map<string, string>) {
    assert(json['shipCharacters'] instanceof Array, `shipCharacters must be of type string[], but was ${typeof json['shipCharacters']}`);
    assert(json['keywords'] instanceof Array, `keywords must be of type string[], but was ${typeof json['keywords']}`);
    this.shipCharacters = json['shipCharacters'];
    Object.values(json['models']).forEach((model: object) => {
      this.models[model['name']] = new ModelInfo(model);
    });
    this.keywords = json['keywords'];
  }

  getUniqueCharacters(count = 1, ship = false): ModelInfo[] {
    const results = new Array<ModelInfo>();
    var options = Object.values(this.models);
    if (ship) {
      options = [];
      this.shipCharacters.forEach((characterName: string) => {
        options.push(this.models[characterName]);
      });
    }
    count = Math.min(count, 10, options.length);
    while (results.length < count) {
      var newModel = random(options);
      if (results.indexOf(newModel) < 0) {
        results.push(newModel);
      }
    }
    return results;
  }
}

export const modelsInfo = new ModelsInfo();

const allowedEnforcers = [
  "Angelica Durand",
  "The Beast Within",
  "Ferdinand Vogel",
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

function initializeOptions() {
  if (Object.keys(modelsInfo.shipCharacters).length > 0) {
    return;
  }
  if (fs.existsSync('modelList.json')) {
    try {
      const modelData = fs.readFileSync('modelList.json', { encoding: "utf8" });
      const modelDataJson = JSON.parse(modelData);
      modelsInfo.parseFromJson(modelDataJson);
      logger.info('Successfully parsed modelList.json');
      return;
    } catch (exception) {
      logger.error(`Exception parsing modelList.json, redownloading: ${exception}`);
      fs.rmSync('modelList.json');
    }
  }
  const allModelsRef = ref(storage, 'gs://m3e-crew-builder-22534.appspot.com/allmodels-app-titles.json');
  var allModelsJson = {};
  const xhr = new XMLHttpRequest();
  getDownloadURL(allModelsRef).then(async (url) => {
    logger.info(`Download url for allmodels: ${url}`);
    xhr.onload = async () => {
      const blob = xhr.responseText;
      allModelsJson = JSON.parse(blob);
      var promises = [];
      Object.keys(allModelsJson['units']).forEach((name) => {
        var json = allModelsJson['units'][name];
        var modelInfo = new ModelInfo(json);
        modelsInfo.models[name] = modelInfo;
        if (modelInfo.keywords) {
          modelInfo.keywords.forEach((keyword: string) => {
            if (modelsInfo.keywords.indexOf(keyword) < 0) {
              modelsInfo.keywords.push(keyword);
            }
          });
        }

        modelInfo.imageFiles.splice(0, modelInfo.imageFiles.length);
        json['fileNames']['frontJPGs'].forEach((fileName: string) => {
          var fullFileName = `gs://m3e-crew-builder-22534.appspot.com/${fileName}`;
          promises.push(getDownloadURL(ref(storage, fullFileName)).then((url) => {
            modelInfo.imageFiles.push(url);
          }));
        });

        switch (json['station']) {
          case 'Minion':
            return;
          case 'Enforcer':
            if (allowedEnforcers.indexOf(name) < 0) {
              return;
            }
          case 'Henchman':
          case 'Master':
            modelsInfo.shipCharacters.push(modelInfo.name);
        }
      });
      await Promise.all(promises);
      // Write data to modelList.json so it can be read later.
      logger.info('Writing modelList.json');
      fs.writeFileSync("modelList.json", JSON.stringify(modelsInfo, null, 2));
    };
    xhr.open('GET', url);
    xhr.send();
  });
}

initializeOptions();
