(function (app) {
    'use strict';

    var SettingsService = function () {
        this.serverUrl = localStorage.getItem('serverUrl') || '';
        this.cameraServerUrl = localStorage.getItem('cameraServerUrl') || '';
        this.debugModeEnabled = false;
    };

    app.service('settings', [SettingsService]);
}(angular.module('RPiApp')));