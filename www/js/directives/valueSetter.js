/**
 * Copyright (C) Carena, Inc - All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

(function (app) {
    'use strict';

    var ValueSetter = function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/valueSetter.html',
            require: 'ngModel',
            scope: {
                controlName: '@'
            },
            link: function (scope, element, attrs, ngModelController) {
                scope.model = {
                    value: '',
                    valueSent: false
                };

                scope.actions = {
                    toggleValue: function () {
                        scope.model.valueSent = !scope.model.valueSent;
                        //scope.resetValue = !scope.resetValue;

                        var valueToSet = scope.model.value;
                        if (!scope.model.valueSent) {
                            valueToSet = 0;
                        }

                        ngModelController.$setViewValue(valueToSet);
                        ngModelController.$render();
                    }
                };
            }
        };
    };

    app.directive('valueSetter', [ValueSetter]);
}(angular.module('RPiApp')));