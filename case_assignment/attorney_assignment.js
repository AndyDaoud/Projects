/*
 *This program is designed to simulate new case assignment to attorneys.
 *It is designed to moniter a directory for new case files.  When a new
 *case file is added, the program will add the case to an attorney, email
 *that attorney the case file, and increase the queue number.  
*/

//global variables and module include/initializations
const fs = require("fs");
const chokidar = require('chokidar');
var queue = 1;
var case_num = 0;
var attorney_email;
var path = require('path');

//Postgres database module
const {Client} = require('pg')
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "PASSWORD",
    database: "DATABASE NAME"
});
client.connect();

//Nodemailer module
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'APPEMAIL',
        pass: 'APPPASSWORD'
    },
});

//When called, updates the database to add case to attorney's list of cases
function update_db(casenum){
    client.query('UPDATE attorney_list SET cases = ARRAY_APPEND (cases, '+ String(casenum) + ') WHERE id = ' + String(queue), (err, res)=>{
        if(err){
            console.error(err);
            return;
        }
    });
}

//When called, emails attorney their assigned case file.
async function send_email(num, file, attorneyemail){

    var mailOptions = {
        from: 'APP EMAIL',
        to: attorneyemail,
        subject: 'Case Assignment',
        text: 'You have been assigned a new case.  Attached is the file for case# ' + num,
        attachments: [{
            path: path.basename(file)
        }]
    };
    let mail = await transporter.sendMail(mailOptions, function(err, res){
        if(err){
            console.log(err);
        }else{
            console.log('Email sent: ' + res.response);
        }
        
    })
}

/*
 *Chokidar moniters a given directory for changes.  When it detects a newly added file,
 *it takes the file's name and case number, selects the next attorney in the queue, updates
 *the database with the new case number, emails the case file to that attorney, then advances
 *the queue so that the next case file is assigned to the following attorney in the queue.
*/
chokidar.watch('PATH OF DIRECTORY TO BE MONITERED', {ignoreInitial: true}).on('add', fileName => {
    var lines;
    var casefile = fs.readFileSync(fileName, {encoding: 'utf8', flag: 'r'});
    lines = casefile.split('\n');   
    case_num = parseInt(lines[3]);  

    //Query to update database with new case number
    client.query('UPDATE attorney_list SET cases = ARRAY_APPEND (cases, '+ String(case_num) + ') WHERE id = ' + String(queue), async (err, res)=>{
        if(err){
            console.error(err);
            return;
        }
        return;
    })

    //Query to obtain email of attorney at front of queue and call send_email function
    client.query('SELECT email FROM attorney_list WHERE id = ' + String(queue), async (err, res)=>{
        if(err){
            console.error(err);
            return;
        }else{
        attorney_email = await (res.rows[0]["email"]); 
        send_email(case_num, fileName, attorney_email);  
        }
    });

    //advances queue
    if(queue == 4){
        queue = 1;
    }else{
        queue += 1;
    }
    
    //Closes Postgres client when process closed
    process.on('SIGINT', function () { 
        console.log('Bye');
        client.end();
        process.exit();
    });
    
});
