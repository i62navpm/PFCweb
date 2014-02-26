'use strict';

var webApp = angular.module('webApp', ['ngRoute','highcharts-ng','webApp.controllers','ui.bootstrap','colorpicker.module']);

    // configure our routes
    webApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '../public/views/games.html',
                controller  : 'gamesController'
                
            })
            .when('/score', {
                templateUrl : '../public/views/score.html',
                controller  : 'scoreController'
            })

            // route for the about page
            .when('/data', {
                templateUrl : '../public/views/dataUser.html',
                controller  : 'dataController'
            })

            .when('/pongNewConfig', {
                templateUrl : '../public/views/pong/pongNewConfig.html',
                controller  : 'pongConfigController'
            })

            .when('/pongConfig', {
                templateUrl : '../public/views/pong/pongConfig.html',
                controller  : 'pongModifyConfController'
            })
            .when('/pongViewConfig', {
                templateUrl : '../public/views/pong/pongViewConfig.html',
            })

            .when('/tetrisNewConfig', {
                templateUrl : '../public/views/tetris/tetrisNewConfig.html',
                controller  : 'tetrisConfigController'
            })

            .when('/tetrisConfig', {
                templateUrl : '../public/views/tetris/tetrisConfig.html',
                controller  : 'tetrisModifyConfController'
            })
            .when('/tetrisViewConfig', {
                templateUrl : '../public/views/tetris/tetrisViewConfig.html',
            })

            .when('/dragMeNewConfig', {
                templateUrl : '../public/views/dragMe/dragMeNewConfig.html',
                controller  : 'dragMeConfigController'
            })

            .when('/dragMeConfig', {
                templateUrl : '../public/views/dragMe/dragMeConfig.html',
                controller  : 'dragMeModifyConfController'
            })
            .when('/dragMeViewConfig', {
                templateUrl : '../public/views/dragMe/dragMeViewConfig.html',
            })

            // route for the contact page
            .when('/social', {
                templateUrl : '../public/views/social.html',
                controller  : 'socialController'
            });
    });