var LoquiApp = angular.module( 'Loqui', [ 'ngRoute', 'ngResource'] );

LoquiApp.config( [ '$routeProvider',
    function( $routeProvider ) {
        $routeProvider.
        when( '/', { // INITAL PAGE LOAD ONLY
            templateUrl: 'partials/searchView.html',
            controller: 'searchCtrl'
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
        when( '/privateMessages', {
            templateUrl: 'partials/privateMessagesView.html',
            controller: 'privateMessagesCtrl'
        } ).
        when( '/chatroom', {
            templateUrl: 'partials/chatRoom.html',
            controller: 'chatRoomCtrl'
        } ).
        when( '/lunch', {
            templateUrl: 'partials/lunchView.html',
            controller: 'lunchCtrl'
        } ).
        otherwise( {
            redirectTo: '/home'
        } );
    }
] );
