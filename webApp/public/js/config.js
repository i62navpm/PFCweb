'use strict';

var webApp = angular.module('webApp', ['ngRoute','webApp.controllers','ui.bootstrap','colorpicker.module']);

    // configure our routes
    webApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '../public/views/games.html',
                
            })
            .when('/score', {
                templateUrl : '../public/views/score.html',
            })

            // route for the about page
            .when('/data', {
                templateUrl : '../public/views/dataUser.html',
                controller  : 'dataController'
            })

            .when('/pongNewConfig', {
                templateUrl : '../public/views/pongNewConfig.html',
                controller  : 'pongConfigController'
            })

            .when('/pongConfig', {
                templateUrl : '../public/views/pongConfig.html',
            })

            // route for the contact page
            .when('/social', {
                templateUrl : '../public/views/social.html',
                controller  : 'socialController'
            });
    });