const fs = require("fs");
const Papa = require("papaparse");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
  // firebase config goes here
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
// change the collection to the one you want to export
const ref = db.collection("results");

const getData = async () => {
  const data = [];
  await ref.get().then((snapshot) => {
    snapshot.forEach((item) => data.push(item.data()));
    // update the file name here
    storeDataToCSV(data, "Filename");
  });
};

getData();

const storeDataToCSV = (data, filename) => {
  const date = new Date().toISOString().substring(0, 10);
  const csv = Papa.unparse(data, {
    quotes: false, //or array of booleans
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\r\n",
    skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
    columns: null, //or array of strings
  });

  try {
    fs.writeFileSync(`./out/${filename}-${date}.csv`, csv);
  } catch (err) {
    console.error(err);
  }
};
