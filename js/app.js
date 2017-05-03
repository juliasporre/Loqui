var LoquiApp = angular.module( 'Loqui', [ 'ngRoute', 'ngResource'] );

LoquiApp.config( [ '$routeProvider',
    function( $routeProvider ) {
        $routeProvider.
        when( '/', { // INITAL PAGE LOAD ONLY
            templateUrl: 'partials/chatRoom.html',
            controller: 'landingCtrl'
        } ).
        when( '/home', {
            templateUrl: 'partials/landingView.html',
            controller: 'landingCtrl'
        } ).
        when( '/search', {
            templateUrl: 'partials/searchView.html',
            controller: 'searchCtrl'
        } ).
        when( '/profile', {
            templateUrl: 'partials/profileView.html',
            controller: 'profileCtrl'
        } ).
        when( '/menu', {
            templateUrl: 'partials/menuView.html',
            controller: 'menuCtrl'
        } ).
        when( '/members', {
            templateUrl: 'partials/membersView.html',
            controller: 'membersCtrl'
        } ).
        when( '/chatroom', {
            templateUrl: 'partials/chatRoom.html',
            controller: 'chatRoomCtrl'
        } ).
        otherwise( {
            redirectTo: '/home'
        } );
    }
] );
