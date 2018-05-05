# CIS 2460 Final

## Project

This is an android app, written with Cordova. The title is called LottaNotes and the purpose general purpose is to create a simple CRUD structure that invokes device specific functions. See below for more details.

### Project Requirements

* Must require user input of some form other than menu/link clicking.
> The application takes in data in the form of a user profile and it allows for entry of notes into system in forms.

* Must require a user account system of some sort to differentiate different users using the app on different devices.
> Application has a registration and login process.

* Must be multiple pages, Minimum of 5 pages required.
> Application has 8 total routed pages routed using AngularJS.

* Must be Menu Driven. Style the menu to be attractive. No default styles for whatever CSS/JS framework you are using.
> Styled used [MaterializeCSS](https://materializecss.com/) customized the colors and layouts to extend beyond the default Materialize.

* Must use a MySQL database and be able to store data to, and pull data from it.
> Uses a MySQL database with PHP as the intermediary.

* App must take in and store data from the user in one form or another.
  * Data must be reloadable when a user reloads the app
  * Data must be editable or parts of it must be editable
  * Option to Delete part of the data or all of the data
> As above there are forms in the application that follow the full CRUD cycle.

* Must use both user provided images, as well as images you have created to make the app visually appealing.
> App uses default profile images and allows for the addition of images using the camera

* Must utilize Cordova’s Camera and GPS functions in one way or another.
> The location of where a user was when a note was recorded is built into the app and the ability to take a photo for your user profile is present

* An additional Cordova plug-in not taught in this semester must be added to the app. For help go to the following address and pick an item to add.
  * [https://www.tutorialspoint.com/cordova/index.htm](https://www.tutorialspoint.com/cordova/index.htm "Tutorials Point")
> The additional plug-in I chose is the vibration plugin. I created a default touch vibration, an error vibrations, and a success vibration so that the user can differentiate without the need for alerts.
