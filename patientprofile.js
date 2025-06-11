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

//ANCHOR - Patient user logged in
// Patient can choose to view or update personal details or view medical info
function handlePatient() {
  console.log(`\nWelcome patient`)
  console.log('\n1. View and update personal details')
  console.log('2. View medical details')
  console.log('0. Return to main menu')

  
rl.question('\nChoose an option: ', (choice) => {  //prompting user to select an option
  switch (choice.trim()) {  //the start of a switch statement that evaluates what the option the user selects
    case '1': return updatePatientdetails()  //go to update and/or view personal information
    case '2': return displayMedicalDetails()  //go to view their medical details
    case '0': return showMenu()  //return to the main menu
    //default is designed to validate user input. If 1, 2 or 3 are not selected or input is invalid.
    default:  console.log('Invalid option. Try again.'); handlePatient()  //default
  }
})
}

// function to display personal information, also the interface for updating their information
function displayPersonalInformation(){
   const p = profile.personalDetails // storing the current patients details into a variable

//    logging patient details to CLI
  console.log(`\nWelcome, ${p.fullName}`)
  console.log('\n--- Your Current Details ---')
  console.log(`1. Full Name: ${p.fullName}`)
  console.log(`2. Date of Birth: ${p.dateOfBirth}`)
  console.log(`3. Gender: ${p.gender}`)
  console.log(`4. Address: ${p.address}`)
  console.log(`5. Phone: ${p.contact.phone}`)
  console.log(`6. Email: ${p.contact.email}`)
  console.log(`7. Emergency Contact Name: ${p.emergencyContact.name}`)
  console.log(`8. Emergency Contact Relationship: ${p.emergencyContact.relationship}`)
  console.log(`9. Emergency Contact Phone: ${p.emergencyContact.phone}`)
  console.log('0. Return to Main Menu')
}

// fuction display patients medical details (display only)
function displayMedicalDetails() {
    const m = profile.medicalDetails // storing the medical details into a variable

    // logging medical details to CLI
  console.log('\n--- Your Medical Details ---')
  console.log('Diagnoses:', m.diagnoses.join(', '))
  console.log('Allergies:', m.allergies.join(', '))
  console.log('Medications:', m.medications.join(', '))
  console.log('\nUpcoming Appointments:')
  m.upcomingAppointments.forEach((a, i) => {  //looping through upcoming appointments to display them in a list
  console.log(` ${i + 1}. ${a.date} - ${a.type}`)
  })

  // prompting the user to press enter to return to the main menu
  rl.question('\nPress Enter to return to the main menu.', () => {
    showMenu()
  })
}

// function that allows users to update personal details
function updatePatientdetails() {
   const p = profile.personalDetails // storing the current patients details into a variable
  displayPersonalInformation()  //calling function to display personal information

//   prompting user to select through the options 1-9
  rl.question('\nEnter the number of the field you want to update (or 0 to return): ', choice => {
    switch (choice.trim()) {  //the start of a switch statement that evaluates what the option the user selects
      case '1':  //if 1 is selected do:
        // changing full name
        //prompt user to enter new value that will change the value in the fullName cell
        rl.question('Enter new full name: ', value => {  
          p.fullName = value.trim()  //changing the previous value to new one
          saveProfile()  //calling the save fucntion to save changes
          console.log('Full name updated!')  //letting the user know the change was successful
          updatePatientdetails()  //calling the fucntion to continue view and/or updating personal details
        })
        break  //moving to next possible option
      case '2':  //if 2 is selected do:
        // changing date of birth
        rl.question('Enter new date of birth (YYYY-MM-DD): ', value => {  
          p.dateOfBirth = value.trim()
          saveProfile()
          console.log('Date of birth updated!')
          updatePatientdetails()
        })
        break
      case '3':  //if 3 is selected do:
        // changing gender
        rl.question('Enter new gender: ', value => {  
          p.gender = value.trim()
          saveProfile()
          console.log('Gender updated!')
          updatePatientdetails()
        })
        break
      case '4':  //if 4 is selected do:
        // changing address
        rl.question('Enter new address: ', value => {
          p.address = value.trim()
          saveProfile()
          console.log('Address updated!')
          updatePatientdetails()
        })
        break
      case '5':  //if 5 is selected do:
        // changing contact number
        rl.question('Enter new phone number: ', value => {
          p.contact.phone = value.trim()
          saveProfile()
          console.log('Phone updated!')
          updatePatientdetails()
        })
        break
      case '6':  //if 6 is selected do:
        // changing email address
        rl.question('Enter new email: ', value => {
          p.contact.email = value.trim()
          saveProfile()
          console.log('Email updated!')
          updatePatientdetails()
        })
        break 
      case '7':  //if 7 is selected do:
        // changing emergency contact name
        rl.question('Enter new emergency contact name: ', value => {
          p.emergencyContact.name = value.trim()
          saveProfile()
          console.log('Emergency contact name updated!')
          updatePatientdetails()
        })
        break
      case '8':  //if 8 is selected do:
        // changing emergency contact relationship
        rl.question('Enter new emergency contact relationship: ', value => {
          p.emergencyContact.relationship = value.trim()
          saveProfile()
          console.log('Emergency contact relationship updated!')
         updatePatientdetails()
        })
        break
      case '9':  //if 9 is selected do:
        // changing emergency contacts contact number
        rl.question('Enter new emergency contact phone: ', value => {
          p.emergencyContact.phone = value.trim()
          saveProfile()
          console.log('Emergency contact phone updated!')
          updatePatientdetails()
        })
        break
      case '0':  //if 0 is selected do:
        handlePatient() // calling function to go back to main menu
        break
      default: //default is designed to validate user input. If not within 1-9 range or input is invalid.
        console.log('Invalid option. Try again.')  //letting user know that the iput was invalid
        updatePatientdetails()  //return to continue viewing and/or updating details
    }
  })
}

//ANCHOR - Healthcare professional user logged in 
// function for professional to choose what to view and/or update
function handleProfessional() {

    //logging options to the CLI
  console.log('\n--- Healthcare Professional Access ---')
  console.log('1. View and update patient personal details')
  console.log('2. View and update medical details')
  console.log('0. Return to main menu')

 
// prompting the user to select an option
  rl.question('\nChoose an option: ', (choice) => {
  switch (choice.trim()) { //the start of a switch statement that evaluates what the option the user selects
    case '1': return updatePatientdetails()  //selected to update/view patient details
    case '2': return updateMedicalDetails()  //selected to update/view patients medical details
    case '0': return showMenu()  //selected to return to main menu 
    //default is designed to validate user input. If not 1, 2 or 0 or input is invalid.
    default:  console.log('Invalid option. Try again.'); handleProfessional()  //default 
  }
})

}

// function to display medical details for the healthcare professional that allows them select if they want to update as well
function displayMDForProfessional() {  //MD = medical details | abbreviated to shorten the name of the function
  const m = profile.medicalDetails  // storing the medical details into a variable

  //logging medical details onto the CLI
  console.log('\n--- Medical Details ---')
  console.log(`1. Diagnoses: ${m.diagnoses.join(', ')}`)
  console.log(`2. Allergies: ${m.allergies.join(', ')}`)
  console.log(`3. Medications: ${m.medications.join(', ')}`)
  console.log(`4. Immunisations: ${m.immunisations.join(', ')}`)
  console.log(`5. Test Results: ${m.testResults.map(t => `${t.date} - ${t.type}: ${t.result}`).join(' | ')}`)
  console.log(`6. Upcoming Appointments: ${m.upcomingAppointments.map(a => `${a.date} - ${a.type}`).join(' | ')}`)
  console.log(`7. Notes: ${m.notes}`)
  console.log('0. Return to previous menu')
}

// function to update medical details
function updateMedicalDetails() {
    const m = profile.medicalDetails // storing the medical details into a variable
    displayMDForProfessional()  //calling function to display the medical details for the proffesional

    // prompting the user to select what info they want to change
    rl.question('\nEnter number to update (or 0 to go back): ', choice => {
    switch (choice.trim()) {  //start of the switch statement
      case '1':  //if 1 is selected do:
        //promting the user enter the new value to change the value in the diagnoses cell
        // updating diagnoses
        rl.question('Enter new diagnoses (comma-separated): ', value => {
          m.diagnoses = value.split(',').map(v => v.trim())  // seperating data at the commas, updating and storing it
          saveProfile()  //calling fucntion to save the changes
          console.log('Diagnoses updated!')  //letting user know it was successful
          updateMedicalDetails()  //calling function to return to medical details interface
        })
        break
      case '2': //if 2 is selected do:
        //updating allergies
        rl.question('Enter new allergies (comma-separated): ', value => {
          m.allergies = value.split(',').map(v => v.trim())
          saveProfile()
          console.log('Allergies updated!')
          updateMedicalDetails()
        })
        break
      case '3': //if 3 is selected do:
        // updating medications
        rl.question('Enter new medications (comma-separated): ', value => {
          m.medications = value.split(',').map(v => v.trim())
          saveProfile()
          console.log('Medications updated!')
          updateMedicalDetails()
        })
        break
      case '4': //if 4 is selected do:
        // updating immunisations
        rl.question('Enter new immunisations (comma-separated): ', value => {
          m.immunisations = value.split(',').map(v => v.trim())
          saveProfile()
          console.log('Immunisations updated!')
          updateMedicalDetails()
        })
        break
      case '5':  //if 5 is selected do:
        //three different values to be enterred for test reults
        //updating test results
        rl.question('Enter test results as date,type,result (e.g., 2025-06-01,Blood Pressure,Normal): ', value => { 
          const [date, type, result] = value.split(',').map(v => v.trim())
          if (date && type && result) {
            m.testResults.push({ date, type, result })  //adding new results
            saveProfile()
            console.log('Test result added!')
          } else {
            console.log('Invalid input format.')
          }
          updateMedicalDetails()
        })
        break
      case '6':  //if 6 is selected do:
        //Two different values to be enterred for creating a new appointment
        //updating future appointments
        rl.question('Enter appointment as date,type (e.g., 2025-07-01,Checkup): ', value => {
          const [date, type] = value.split(',').map(v => v.trim())
        //   validating the input
          if (date && type) {
            m.upcomingAppointments.push({ date, type })  //adding new appointment
            saveProfile()
            console.log('Appointment added!')
          } else {
            console.log('Invalid input format.')
          }
          updateMedicalDetails()
        })
        break
      case '7':  //if 7 is selected do:
        //adding mediacl notes
        rl.question('Enter updated notes: ', value => {
          m.notes = value.trim()
          saveProfile()
          console.log('Notes updated!')
          updateMedicalDetails()
        })
        break
      case '0':  //if 0 is selected do:
        //return to previous interface
        handleProfessional()
        break
      default:
        console.log('Invalid choice. Try again.')
        updateMedicalDetails()
    }
  })
}

//ANCHOR - Starting the program
// Start the patient profile program in the CLI
showMenu()