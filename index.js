const inquirer = require('inquirer');
const Manager = require('./lib/Manager.js');
const Engineer = require('./lib/Engineer.js');
const Intern = require('./lib/Intern.js');
const Employee = require('./lib/Employee.js');
const fs = require('fs');
const pageTemplate = require('./dist/pageTemplate');

var employees = [];

const managerProfile = function () {
    // prompts for manager
   return inquirer.prompt([
        {
            type: 'text',
            name: 'name',
            message: "What is the team manager's name?",
            validate: name => {
                if (name) {
                    return true;
                } else {
                    console.log('You need to enter a name!');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'id',
            message: 'What is the employee ID?',
            validate: id => {
                if (id) {
                    return true;
                } else {
                    console.log('You need to enter an id!');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'email',
            message: 'What is the email address of the employee?',
            validate: email => {
                if (email) {
                    return true;
                } else {
                    console.log('You need to enter an email!');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'office',
            message: 'What is the office number of the employee?',
            validate: office => {
                if (office) {
                    return true;
                } else {
                    console.log('You need to enter an office number!');
                    return false;
                }
            }
        },
    ])
    //asynchronously takes data to generate profile and then goes to menu
    .then(managerData => {
        const { name, id, email, officeNumber } = managerData;
        const manager = new Manager(name, id, email, officeNumber);
        employees.push(manager);
       
      
    })
};


const menu = function () {
    //select engineer, intern, or finish team
  return  inquirer.prompt([
        {
        type: 'list',
        message: 'What employee would you like to add?',
        name: 'role',
        choices: ['Engineer', 'Intern']
        },
        {
            type: 'text',
            name: 'name',
            message: 'What is the name of the employee?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('You need to enter a name!');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'id',
            message: 'What is the employee number?',
            validate: idInput => {
                if (idInput) {
                    return true;
                } else {
                    console.log('You need to enter a number');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'email',
            message: 'What is their email?',
            validate: emailInput => {
                if (emailInput) {
                    return true;
                } else {
                    console.log('You need to enter an email');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'github',
            message: 'What is their GitHub account?',
            when: (input) => input.role === 'Engineer',
            validate: github => {
                if (github) {
                    return true;
                } else {
                    console.log('You need to enter a github username');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'school',
            message: 'What school does the intern go to?',
            when: (input) => input.role === 'Intern',
            validate: school => {
                if (school) {
                    return true;
                } else {
                    console.log('You need to enter a school');
                    return false;
                }
            }
        },
     
    ])
    .then(employeesData => {
        let { name , id, email, role, github, school, confirmAddEmployee} = employeesData;
        let employee;

        if(role === 'Engineer') {
            employee = new Engineer(name, id, email, github);
            console.log(employee);
        } else if (role === "Intern") {
            employee = new Intern(name, id, email, school);
            console.log(employee);
        }
        employees.push(employee);

        if(confirmAddEmployee) {
            return menu(employees)
        } else {
            // console.log(employees);
            return employees;
            
        }
    })
    
};



managerProfile()
.then(menu)
.then(data => {
    const pageHTML = pageTemplate(data)

    fs.writeFile('./index.html', pageHTML, err => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Page created! Check out index.html")
        }
    })
});
