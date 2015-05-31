/**
 * Copyright (C) Carena, Inc - All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

(function (app) {
    'use strict';

    var SavedPanelController = function ($scope) {
        $scope.actions = {
            toggleDeleteMode: function () {
                $scope.model.showDelete = !$scope.model.showDelete;
                $scope.viewModel.toggleDeleteButtonText = $scope.model.showDelete ? "Done" : "Delete";
            },
            showPanelDetails: function (panelName) {
                var panel = JSON.parse(window.localStorage.getItem(panelName));
                console.log(panelName, panel);
            },
            deletePanel: function (index, panelName) {
                $scope.model.controlPanels.splice(index, 1);
                window.localStorage.setItem('panels', JSON.stringify($scope.model.controlPanels));
                window.localStorage.removeItem(panelName);
            }
        };

        $scope.model = {
            showDelete: false,
            controlPanels: JSON.parse(window.localStorage.getItem('panels'))
        };

        $scope.viewModel = {
            toggleDeleteButtonText: "Delete"
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.model.controlPanels = JSON.parse(window.localStorage.getItem('panels'));
        })
    };

    app.controller('RPiApp.SavedPanelController', ['$scope', SavedPanelController]);
}(angular.module('RPiApp')));