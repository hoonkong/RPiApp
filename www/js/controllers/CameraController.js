/**
 * Copyright (C) Carena, Inc - All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

(function (module) {
    'use strict';

    var CameraController = function ($scope, $http, $document, settings) {

        var tabNav = angular.element(document.querySelector('div.tab-nav.tabs'));

        // Duplicate code
        var getActionUrl = function (requestParams) {
            return settings.serverUrl + '/?callback=JSON_CALLBACK&payload=' + JSON.stringify(requestParams);
        };

        var stopCamera = function () {
            $scope.model.cameraServerUrl = '';

            var url = getActionUrl({
                action: 'stop_camera'
            });

            $scope.actions.exitFullScreen();

            $http.jsonp(url)
                .success(function () {
                    $scope.model.showVideo = false;
                })
                .error(function () {
                    navigator.notification.alert(
                        'Unable to stop camera',
                        null,
                        'Error',
                        'Ok'
                    );
                });
        };

        $scope.model = {
            cameraServerUrl: '',
            showVideo: false,
            cameraEnabled: false,
            isFullScreen: false,
            showStartStreamBtn: false,
            isServerManuallyStopped: false
        };

        $scope.actions = {
            startServer: function () {
                var url = getActionUrl({
                    action: 'start_camera'
                });

                $scope.model.isServerManuallyStopped = false;

                $http.jsonp(url)
                    .success(function () {
                        $scope.model.cameraEnabled = true;
                        $scope.model.showStartStreamBtn = true;
                    })
                    .error(function () {
                        $scope.model.isServerManuallyStopped = true;
                        navigator.notification.alert(
                            'Unable to start camera',
                            null,
                            'Error',
                            'Ok'
                        );
                    });
            },
            startVideo: function () {
                $scope.model.showVideo = true;
                $scope.model.cameraServerUrl = settings.cameraServerUrl;
            },
            goFullScreen: function () {
                $scope.model.isFullScreen = true;
                tabNav.addClass('tab-nav-hide');
            },
            exitFullScreen: function () {
                $scope.model.isFullScreen = false;
                tabNav.removeClass('tab-nav-hide');
            },
            stopCamera: function () {
                $scope.model.isServerManuallyStopped = true;
                $scope.model.showStartStreamBtn = false;
                stopCamera();
            }
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.model.showStartStreamBtn = true;
            $scope.actions.startServer();
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.model.showStartStreamBtn = false;
            $scope.model.isServerManuallyStopped = false;
            if ($scope.model.showVideo) {
                stopCamera();
            }
        });
    };

    module.controller('RPiApp.CameraController', ['$scope', '$http', '$document', 'settings',  CameraController]);
}(angular.module('RPiApp')));