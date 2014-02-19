'use strict';

var webApp = angular.module('webApp', ['ngRoute','webApp.controllers','ui.bootstrap','colorpicker.module']);

    // configure our routes
    webApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '../public/views/games.html',
                controller  : 'mainController'
            })

            .when('/score', {
                templateUrl : '../public/views/score.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/request', {
                templateUrl : '../public/views/request.html',
                controller  : 'mainController'
            })

            // route for the contact page
            .when('/messages', {
                templateUrl : '../public/views/messages.html',
                controller  : 'mainController'
            });
    });