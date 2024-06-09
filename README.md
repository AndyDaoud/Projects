# Projects
Example of work:

FarkleGame
This is a project designed to simulate the dice game Farkle.  It was made using HTML, CSS, and Javascript.  The game can be played with 2 - 4 players.

WeatherForecast
This project is a .Net C# web service designed to take a zip code as input and outputs that area's weather forecast and air quality.  It is packaged as a visual studio solution.
It uses several REST api and a JSON list found online.  The web service itself uses REST protocol.
Enter a zip code into the textbox and click the search button.

Case Assignment

This project is designed to simulate automated case assignment to attorneys.  It utilizes Node.js and PostgreSQL.  In order to test, changes need to be made
to the code.
First, a database is required for the program to pull attorney information from.  
![Initial database](https://github.com/AndyDaoud/Projects/assets/61570504/49fd87c0-38ec-4724-b710-bbff15d18c7c)

The given attorney_list.csv file can be used, although the EMAIL entries must be filled. Once the database is created, fill in the info within the database module code.

![databaseinfo](https://github.com/AndyDaoud/Projects/assets/61570504/4b20b7a0-b556-4e94-ae32-33b72cb52493)

The project requires an email to be used for sending cases.  It is suggested a new email account is made on gmail, as the code is currently set up to use
gmail.  Make sure 2-factor authentication is enabled and create an app password.  Then replace 'APPEMAIL' with the email address and 'APPPASSWORD' with the app password.

![newemail](https://github.com/AndyDaoud/Projects/assets/61570504/486027b6-b39a-48f1-aafa-a969fc7ab6d2)

Finally, the path of the directory to be monitered must be filled in. 

![directorypath](https://github.com/AndyDaoud/Projects/assets/61570504/eae19150-9ff5-460f-ae0e-1a4b9f80b31e)

Once all of this is done, add the given case files into the monitored directory.  The databases will be updated with the new case numbers and an email will be sent to
the assigned attorney.
Initially:

![Initial database](https://github.com/AndyDaoud/Projects/assets/61570504/b236fb6f-0c44-4315-a147-49e6f7e2368b)

After Case Assignment:

![databases after assignment](https://github.com/AndyDaoud/Projects/assets/61570504/7629a286-f8d6-4a53-aa21-eff173ff35e0)

Email Recieved by Attorney:

![Case file sent](https://github.com/AndyDaoud/Projects/assets/61570504/c950a157-3525-42e7-97ab-5730c992c422)
