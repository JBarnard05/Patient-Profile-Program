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

// Display the main menu where user selects who is loging in
function showMenu() {
  console.log('\n--- Patient Health Record System ---')
  console.log('1. Log in as Patient')
  console.log('2. Log in as Healthcare Professional')
  console.log('3. Exit')


  rl.question('\nChoose an option: ', (choice) => {  //prompting the user to select their role
    switch (choice.trim()) {  //the start of a switch statement that evaluates what the option the user selects
      case '1': return loginUser('patient')  //patient login selected
      case '2': return loginUser('professional')  //healthcare professional login selected
      case '3': rl.close(); return console.log('Goodbye!')  //exits the program selected, displays goodbye message and close CLI
      //default is designed to validate user input. If not within 1-3 range or invalid.
      default:  console.log('Invalid option. Try again.'); showMenu()  //default
    }
  })
}

//ANCHOR - Program login
// Login prompt for patient or professional
//function requires a parameter "role" to know where to get the username and password from in the ".json" file
function loginUser(role) {  
  const creds = profile.login[role]  //variable storing the values brought from the ".json" file

  rl.question(`\nEnter username for ${role}: `, (username) => {  //prompting user to enter their username
    rl.question('Enter password: ', (password) => {  //prompting user to enter their password
        //validating if username and password matches the ones brought from the ".json" file
      if (username === creds.username && password === creds.password) {  
        console.log(`\nLogin successful as ${role}!`)  //diplay if matches
        role === 'patient' ? handlePatient() : handleProfessional()  //navigate to next page based on role
      } else {
        console.log('\nInvalid credentials. Try again.')  //send back to main menu if invalid credentials
        showMenu() // Send them back to main menu
      }
    })
  })
}
