/**
 * GPS Functions
 */

function gpsSuccess( position )
{

	alert('ready');

  /*
	$('[name="review[user_long]"]').val( position.coords.longitude );
	$('[name="review[user_lat]"]').val( position.coords.latitude );
  */
	/*
	alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
	*/
}

function gpsFailure( error )
{

	alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');

}

function getPosition()
{
	navigator.geolocation.getCurrentPosition(gpsSuccess, gpsFailure);
}

function vibrate( type )
{

	var type = type || "default";

	switch( type ){
		case 'default':
			navigator.vibrate([9]);
			break;
		case 'error':
			navigator.vibrate([385,60,125]);
			break;
		case 'success':
			navigator.vibrate([150,60,150,60,150]);
			break;
	}

}
