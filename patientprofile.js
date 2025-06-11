//ANCHOR - Importing all necessary modules for program
const readline = require('readline')  //handles a command line input and output
const fs = require('fs')  //file system module allows me to operate with files

// defining file name for storing patients data in JSON format
const FILE = 'patient.json'

// initialize the patient data object ; load the data from the file if it exists
let profile = {}
if (fs.existsSync(FILE)) {
  try {
    profile = JSON.parse(fs.readFileSync(FILE, 'utf8')) // read and parse the files contents
  } catch {
    profile = {} // if error, start with an empty array
  }
}

// creates a readline interface for user input and output
const rl = readline.createInterface({
  input: process.stdin,  //input
  output: process.stdout  //output
})

// function to save the changes made to the ".json" file
function saveProfile() {
  fs.writeFileSync(FILE, JSON.stringify(profile, null, 2))  //Printed with 2-space indentaion
}