(function (app) {
    'use strict';

    var DynamicControlContainer = function () {
        return {
            restrict: 'E',
            scope: {
                addControl: '&'
            },
            link: function (scope, element, attrs) {
                scope.model = {
                    value: scope.startValue
                };
            }
        };
    };

    app.directive('dynamicControlContainer', [DynamicControlContainer]);
}(angular.module('RPiApp')));