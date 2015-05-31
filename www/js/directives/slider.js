(function (app) {
    'use strict';

    var SliderControl = function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/slider.html',
            scope: {
                leftIconClassName: '@',
                rightIconClassName: '@',
                minValue: '@',
                maxValue: '@',
                startValue: '@',
                controlName: '@',
                onSlideModel: '='
            },
            link: function (scope, element, attrs) {
                scope.model = {
                    value: scope.startValue
                };
            }
        };
    };

    app.directive('slider', [SliderControl]);
}(angular.module('RPiApp')));