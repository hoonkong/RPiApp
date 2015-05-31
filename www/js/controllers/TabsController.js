/**
 * Copyright (C) Carena, Inc - All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

(function (module) {
    'use strict';

    var TabsController = function ($scope) {
        // Implementation of the service
        $scope.tabsModel = {
            isFullScreen: false
        };
    };

    module.controller('RPiApp.TabsController', ['$scope', TabsController]);
}(angular.module('RPiApp')));