/**
 * Create handler for sidemenu navigation system
 */
var nav = document.querySelector('.sidenav');

M.Sidenav.init( nav, { });

nav.querySelectorAll('.sidenav a').forEach(function( ele ){

	ele.addEventListener('click', function(){
		nav.M_Sidenav.close();
	});

});

var pictureSource, destinationType;

document.addEventListener('deviceready', function(){

	pictureSource = navigator.camera.pictureSourceType.CAMERA;
	destinationType = navigator.camera.DestinationType.DATA_URL;
	//destinationType = navigator.camera.DestinationType.FILE_URI;

}, false);
