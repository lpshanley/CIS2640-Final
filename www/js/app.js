var finalApp = angular.module('finalApp', ['ngRoute','ngRoute.middleware']);

angular.module('myApp', []).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://lsc.battleshack.net/cis2640/**'
  ]);

  $sceDelegateProvider.resourceUrlBlacklist([

  ]);
});

finalApp.config(['$middlewareProvider', function( $middlewareProvider ){
	$middlewareProvider.map({
		'logged-in': function(){

			var token = window.localStorage.getItem('userToken') || false;

			if( token === false )
				this.redirectTo('/account/login');
			else
				this.next();

		}
	});
}]);

finalApp.config(['$routeProvider', function( $routeProvider ){

	$routeProvider

	.when('/',{
		templateUrl: "views/home.html",
		controller: 'homeController',
		middleware: 'logged-in'
	})

	.when('/about',{
		templateUrl: 'views/about.html',
		controller: 'aboutController',
		middleware: ''
	})

	.when('/notes',{
		templateUrl: 'views/notes/home.html',
		controller: 'notesController',
		middleware: 'logged-in'
	})

	.when('/notes/create',{
		templateUrl: 'views/notes/create.html',
		controller: 'notesCreateController',
		middleware: 'logged-in'
	})

  .when('/notes/:note_id',{
		templateUrl: 'views/notes/edit.html',
		controller: 'noteController',
		middleware: 'logged-in'
	})

  .when('/profile',{
    templateUrl: 'views/profile.html',
    controller: 'profileController',
    middleware: 'logged-in'
  })

	.when('/account/login',{
		templateUrl: 'views/account/login.html',
		controller: 'loginController'
	})

	.when('/account/register',{
		templateUrl: 'views/account/register.html',
		controller: 'registerController'
	});

}]);

finalApp.controller('homeController', ['$scope', '$log', function( $scope, $log ){

  $scope.onSuccess = function(){
    vibrate('success');
  }

  $scope.onError = function(){
    vibrate('error');
  }

  $scope.onDefault = function(){
    vibrate('default');
  }

  var canvas = document.querySelector("#logo-canvas");

  if( canvas ) {

  	var context = canvas.getContext("2d");

  	context.fillStyle='#2196f3';

  	context.font = "28pt Tahoma";

  	context.textAlign = "center";

  	var centerX = canvas.width / 2;
  	var centerY = canvas.height - 20;
  	var angle = Math.PI;
  	var radius = 75;

  	logo = "LottaNotes";

  	context.save();
  	context.translate(centerX, centerY);
  	context.rotate(-1 * angle / 2);
  	context.rotate(-1 * (angle / logo.length) / 2);
  	for (var n = 0; n < logo.length; n++) {
  		context.rotate(angle / logo.length);
  		context.save();
  		context.translate(0, -1 * radius);
  		var char = logo[n];
  		context.fillText(char, 0, 0);
  		context.restore();
  	}
  	context.restore();

  }

}]);

finalApp.controller('aboutController', ['$scope','$log', function( $scope, $log ){

}]);

finalApp.controller('profileController', ['$scope','$log', function( $scope, $log ){

  $scope.profile_pic = 'images/none.png';

  $scope.capturePhoto = function() {

    vibrate('default');

    var settings = {
      quality: 20,
  		destinationType: Camera.DestinationType.FILE_URI,
    };

    navigator.camera.getPicture(
      function onCameraSuccess( fileURL ){

        $scope.profile_pic = fileURL;
        $scope.$apply();

        var win = function( res ) {
            $scope.progress = "";
            $scope.$apply();

            vibrate('success');

            //alert("Response = " + res.response);
        }

        var fail = function(error) {
            $scope.progress = "";
            $scope.$apply();
            //alert("An error has occurred: Code = " + error.code);

            vibrate('error');

        }

        var options = new FileUploadOptions();
        options = {
          fileKey: "file",
          fileName: fileURL.substr( fileURL.lastIndexOf('/') + 1 ),
          mimeType: "image/jpg",
          chunkedMode: false,
          params: { token: window.localStorage.userToken }
        }

        var ft = new FileTransfer();

        ft.onprogress = function( progressEvent ) {
            if (progressEvent.lengthComputable) {
                $scope.progress = "Uploading: " + parseInt(( progressEvent.loaded / progressEvent.total ) * 10000) / 100 + "%";
                $scope.$apply();
            }
        };

        ft.upload(
          fileURL,
          encodeURI("http://lsc.battleshack.net/cis2640/final/users/profile_photo.php"),
          win,
          fail,
          options
        );

      },
      function onCameraFail( e ){
        //alert("Failed to start camera");
        //vibrate('error');
      }, settings
    );

  }

  $scope.updateUser = function(){

    var update = { token: window.localStorage.userToken, data: { }};

    if( $scope.firstName )
      update.data.first_name = $scope.firstName;

    if( $scope.lastName )
      update.data.last_name = $scope.lastName;

    if( $scope.phone )
      update.data.phone = $scope.phone;

    if( $scope.image )
      update.data.image = $scope.image;

    $.ajax({
  		method: 'POST',
  		url: 'http://lsc.battleshack.net/cis2640/final/users/update.php',
  		dataType: 'json',
  		data: update,
  		success: function( data ){

        vibrate('success');

        updateUserData();
        $scope.password = "";
        $scope.$apply();

  		},
  		error: function(){

        vibrate('error');

        //console.log( "Error" );
      }
  	});

  }

  var updateUserData = function(){

    $.ajax({
  		method: 'POST',
  		url: 'http://lsc.battleshack.net/cis2640/final/users/read.php',
  		dataType: 'json',
  		data: {
  			'token': window.localStorage.userToken
  		},
  		success: function( data ){
        $scope.email = data.email;
        $scope.firstName = data.first_name;
        $scope.lastName = data.last_name;
        $scope.created_at = new Date(data.created_at);
        $scope.phone = data.phone;
        $scope.profile_pic = "http://lsc.battleshack.net/cis2640/final/images/" + data.image;
  			$scope.$apply();
  		},
  		error: function(){ console.log( "Error" ); }
  	});

  }
  updateUserData();

}]);

finalApp.controller('loginController', ['$scope', function( $scope ){

  $scope.login = function() {
    $.ajax({
      method: 'POST',
      url: 'http://lsc.battleshack.net/cis2640/final/users/login.php',
      dataType: 'json',
      data: {
        'email': $scope.username,
        'password': $scope.password
      },
      success: function( data ){

        if( data.success ){

          vibrate('success');

          window.localStorage.setItem('userToken', data.token );
          window.location.hash = '#!/';
        }
        else {

          vibrate('error');

          $scope.error = data.msg;
          $scope.$apply();

        }
        console.log( data );

      },
      error: function(){ console.log( "Error" ); }
    });
  }

}]);

finalApp.controller('noteController', ['$scope', '$routeParams', function( $scope, $routeParams ){

	$.ajax({
		method: 'POST',
		url: 'http://lsc.battleshack.net/cis2640/final/notes/read.php',
		dataType: 'json',
		data: {
			'token': window.localStorage.userToken,
      'note_id': $routeParams.note_id
		},
		success: function( data ){
			$scope.note = data.note;
			$scope.date = new Date(data.date);
      $scope.long = data.long;
      $scope.lat = data.lat;
			$scope.$apply();
		},
		error: function(){ console.log( "Error" ); }
	});

  $scope.editNote = function(){

    $.ajax({
			method: 'POST',
			url: 'http://lsc.battleshack.net/cis2640/final/notes/edit.php',
			dataType: 'json',
			data: {
				'note': $scope.note,
				'note_id': $routeParams.note_id,
				'token': window.localStorage.userToken,
			},
			success: function( data ){
        vibrate('success');
				window.location.hash = '#!/notes';
			},
			error: function(){
        vibrate('error');
        //console.log( "Error" );
      }
		});

  }

}]);

finalApp.controller('notesController', ['$scope', function( $scope ){

	$scope.notes = [];

  var updateNotes = function(){
  	$.ajax({
  		method: 'POST',
  		url: 'http://lsc.battleshack.net/cis2640/final/notes/read.php',
  		dataType: 'json',
  		data: {
  			'token': window.localStorage.userToken
  		},
  		success: function( data ){
  			data.forEach(function( value ){
          value.date = new Date( value.date );
        });
  			$scope.notes = data;
  			$scope.$apply();
  		},
  		error: function(){ console.log( "Error" ); }
  	});
  }
  updateNotes();

  $scope.deleteNote = function() {

    $.ajax({
      method: 'POST',
      url: 'http://lsc.battleshack.net/cis2640/final/notes/delete.php',
      dataType: 'json',
      data: {
        'note_id': this.note.note_id,
        'token': window.localStorage.userToken
      },
      success: function(){
        vibrate('success');
        updateNotes();
      },
      error: function(){
        vibrate('error');
        console.log( "Error" );
      }
    });

  }

}]);

finalApp.controller('notesCreateController', ['$scope', '$http', '$location', '$timeout', function( $scope, $http, $location, $timeout ){

  $scope.long = "Loading...";
  $scope.lat = "Loading...";

  navigator.geolocation.getCurrentPosition(
    function gpsSuccess( position ){
      $scope.long = position.coords.longitude;
      $scope.lat = position.coords.latitude;
    },
    function gpsFailure(){
      $scope.long = "Error";
      $scope.lat = "Error";
    }
  );

  $scope.clock = "Loading clock...";
  $scope.tickInterval = 1000;

  var tick = function() {
    $scope.clock = Date.now();
    $timeout( tick, $scope.tickInterval );
  }
  $timeout( tick, $scope.tickInterval);

	$scope.createNewNote = function(){

		$.ajax({
			method: 'POST',
			url: 'http://lsc.battleshack.net/cis2640/final/notes/create.php',
			dataType: 'json',
			data: {
				'note': $scope.note,
				'token': window.localStorage.userToken,
        'long': $scope.long,
        'lat': $scope.lat
			},
			success: function( data ){
        vibrate('success');
				window.location.hash = '#!/notes';
			},
			error: function(){
        vibrate('error');
        console.log( "Error" );
      }
		});

	};

}]);

finalApp.controller('registerController', ['$scope', '$http', '$location', function( $scope, $http, $location ){

	$scope.registerUser = function(){

		$.ajax({
			method: 'POST',
			url: 'http://lsc.battleshack.net/cis2640/final/users/register.php',
			dataType: 'json',
			data: {
				'username': $scope.username,
				'password': $scope.password,
				'phone': $scope.phone,
				'firstName': $scope.firstName,
				'lastName': $scope.lastName,
			},
			success: function( data ){
        vibrate('success');
				window.localStorage.setItem('userToken', data.token );
				window.location.hash = '#!/';
			},
			error: function(){
        vibrate('error');
        //console.log( "Error" );
      }
		});

	};

}]);
