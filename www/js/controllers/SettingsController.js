/**
 * Copyright (C) Carena, Inc - All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

(function (module) {
    'use strict';

    var SettingsController = function ($scope, settings) {

        $scope.settings = {
            enableDebugMode: false,
            serverUrl: settings.serverUrl || '',
            cameraServerUrl: settings.cameraServerUrl || ''
        };

        $scope.actions = {
            setServerUrl: function () {
                if ($scope.settings.serverUrl.trim() === 'http://') {
                    $scope.settings.serverUrl = '';
                } else {
                    settings.serverUrl = $scope.settings.serverUrl;
                    localStorage.setItem('serverUrl', $scope.settings.serverUrl);
                }
            },

            setCameraServerUrl: function () {
                if ($scope.settings.cameraServerUrl.trim() === 'http://') {
                    $scope.settings.cameraServerUrl = '';
                } else {
                    settings.cameraServerUrl = $scope.settings.cameraServerUrl;
                    localStorage.setItem('cameraServerUrl', $scope.settings.cameraServerUrl);
                }
            },

            setDefaultHttp: function () {
                if ($scope.settings.serverUrl.trim() === '') {
                    $scope.settings.serverUrl = 'http://';
                }

                if ($scope.settings.cameraServerUrl.trim() === '') {
                    $scope.settings.cameraServerUrl = 'http://';
                }
            },

            setDebugMode: function () {
                settings.debugModeEnabled = $scope.settings.enableDebugMode;
            },

            deleteServerUrl: function () {
                $scope.settings.serverUrl = '';
                settings.serverUrl = '';
                localStorage.removeItem('serverUrl');

                $scope.settings.cameraServerUrl = '';
                settings.cameraServerUrl = '';
                localStorage.removeItem('cameraServerUrl');
            }
        };
    };

    module.controller('RPiApp.SettingsController', ['$scope', 'settings', SettingsController]);
}(angular.module('RPiApp')));