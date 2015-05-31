(function (app) {
    'use strict';

    var PanelController = function ($scope, $compile, $ionicModal, $ionicPopover, $http, settings) {
        var controls = [];

        var getActionUrl = function (requestParams) {
            return settings.serverUrl + '/?callback=JSON_CALLBACK&payload=' + JSON.stringify(requestParams);
        };

        var createValueSetter = function (savedControl) {
            var gpio = $scope.model.gpio,
                controlName = $scope.model.controlName;

            if (savedControl) {
                gpio = savedControl.gpio;
                controlName = savedControl.controlName;
            }

            var key = 'GPIO_' + gpio,
                modelToWatch = 'controls.' + key + '.model',
                control = {
                    type: 'valueSetter',
                    gpio: gpio,
                    controlName: controlName,
                    modelToWatch: modelToWatch
                };

            controls.push(control);

            var valueSetter = angular.element(document.createElement('value-setter'));
            valueSetter.attr('ng-model', modelToWatch);
            valueSetter.attr('control-name', controlName || key);

            angular.element(document.getElementById('sliderContainer')).append(valueSetter);

            $scope.controls[key] = {
                control: valueSetter,
                model: ''
            };

            $scope.$watch(modelToWatch, function (newValue, oldValue) {
                var requestParams = {
                    action: 'set_value',
                    gpio: control.gpio,
                    value: newValue
                };

                var actionUrl = getActionUrl(requestParams);
                console.log('Request for ' + key +  ': ' + actionUrl);
                $http.jsonp(actionUrl);
            });

            $compile(valueSetter)($scope);
        };

        var createToggleControl = function (savedControl) {
            var gpio = $scope.model.gpio,
                controlName = $scope.model.controlName;

            if (savedControl) {
                gpio = savedControl.gpio;
                controlName = savedControl.controlName;
            }

            var key = 'GPIO_' + gpio,
                modelToWatch = 'controls.' + key + '.model',
                control = {
                    type: 'toggle',
                    gpio: gpio,
                    controlName: controlName,
                    modelToWatch: modelToWatch
                };

            controls.push(control);

            var toggle = angular.element(document.createElement('ion-toggle'));
            toggle.attr('ng-model', modelToWatch);
            toggle.attr('ng-change', 'controls.' + key + '.actions.toggle()');
            toggle.text('Toggle for ' + (controlName || key));
            angular.element(document.getElementById('toggleContainer')).append(toggle);

            $scope.controls[key] = {
                control: toggle,
                model: false,
                actions: {
                    toggle: function () {
                        var value =  $scope.controls[key].model ? 'high' : 'low';

                        var requestParams = {
                            action: 'toggle',
                            gpio: control.gpio,
                            value: value
                        };

                        var actionUrl = getActionUrl(requestParams);
                        console.log('Request for ' + key +  ': ' + actionUrl);
                        $http.jsonp(actionUrl);
                    }
                }
            };

            $compile(toggle)($scope);
        };

        var createSliderControl = function (savedControl) {
            var gpio = $scope.model.gpio,
                controlName = $scope.model.controlName,
                startValue =  $scope.model.startValue,
                minValue = $scope.model.minValue,
                maxValue = $scope.model.maxValue;

            if (savedControl) {
                gpio = savedControl.gpio;
                controlName = savedControl.controlName;
                startValue =  savedControl.startValue;
                minValue = savedControl.minValue;
                maxValue = savedControl.maxValue;
            }

            var key = 'GPIO_' + gpio,
                modelToWatch = 'controls.' + key + '.model',
                control = {
                    type: 'slider',
                    gpio: gpio,
                    controlName: controlName,
                    modelToWatch: modelToWatch,
                    startValue: startValue || 50,
                    minValue: minValue || 0,
                    maxValue: maxValue || 100
                };

            controls.push(control);

            var slider = angular.element(document.createElement('slider'));
            slider.attr('left-icon-class-name', 'ion-ios-cog-outline');
            slider.attr('right-icon-class-name', 'ion-ios-cog');
            slider.attr('value', control.startValue);
            slider.attr('min-value', control.minValue);
            slider.attr('max-value', control.maxValue);
            slider.attr('control-name', controlName || key);
            slider.attr('on-slide-model', modelToWatch);
            angular.element(document.getElementById('sliderContainer')).append(slider);

            $scope.controls[key] = {
                control: slider,
                model: $scope.model.startValue  || 50
            };

            $compile(slider)($scope);

            $scope.$watch(modelToWatch, function (newValue, oldValue) {
                var requestParams = {
                    action: 'set_value',
                    gpio: control.gpio,
                    value: 0.1 + (0.002 * newValue)
                };

                var actionUrl = getActionUrl(requestParams);
                console.log('Request for ' + key +  ': ' + actionUrl);
                $http.jsonp(actionUrl);
            });
        };

        var addValueSetterControl = function () {
            var requestParams = {
                action: 'create_pin',
                gpio: $scope.model.gpio,
                pintype: 'pwm'
            };

            var url = getActionUrl(requestParams);
            $http.jsonp(url)
                .success(function () {
                    createValueSetter();

                    $scope.model.gpio = 0;
                    $scope.model.controlType = '';
                    $scope.model.maxValue = '';
                    $scope.model.minValue = '';
                    $scope.model.startValue = '';
                    $scope.model.controlName = '';
                })
                .error(function (err) {
                    navigator.notification.alert(
                        'Unable to create control. ' + err,
                        null,
                        'Error',
                        'Ok'
                    );
                });
        };

        var addToggleControl = function () {
            var requestParams = {
                action: 'create_pin',
                gpio: $scope.model.gpio,
                pintype: 'digital',
                initialState: 'low'
            };

            var url = getActionUrl(requestParams);
            $http.jsonp(url)
                .success(function () {
                    createToggleControl();

                    $scope.model.gpio = 0;
                    $scope.model.controlType = '';
                    $scope.model.maxValue = '';
                    $scope.model.minValue = '';
                    $scope.model.startValue = '';
                    $scope.model.controlName = '';
                }).error(function () {
                    navigator.notification.alert(
                        'Unable to create control.',
                        null,
                        'Error',
                        'Ok'
                    );
                });
        };

        var addSliderControl = function () {
            var requestParams = {
                action: 'create_pin',
                gpio: $scope.model.gpio,
                pintype: 'piBlaster',
                initialValue: $scope.model.startValue || 0
            };

            var url = getActionUrl(requestParams);
            $http.jsonp(url)
                .success(function () {
                    createSliderControl();

                    $scope.model.gpio = 0;
                    $scope.model.controlType = '';
                    $scope.model.maxValue = '';
                    $scope.model.minValue = '';
                    $scope.model.startValue = '';
                    $scope.model.controlName = '';
                }).error(function () {
                    navigator.notification.alert(
                        'Unable to create contro.l',
                        null,
                        'Error',
                        'Ok'
                    );
                });
        };

        $ionicPopover.fromTemplateUrl('templates/popOvers/saveControls.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $ionicModal.fromTemplateUrl('templates/modals/controlProperties.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.actions = {
            closeModal: function () {
                $scope.modal.hide();
            },

            openAddControl: function () {
                $scope.modal.show();
            },

            addControl: function () {
                if ($scope.model.gpio && $scope.model.controlType && !$scope.controls['GPIO_' + $scope.model.gpio]) {
                    if ($scope.model.controlType === 'slide') {
                        if (settings.debugModeEnabled) {
                            createSliderControl();
                        } else {
                            addSliderControl();
                        }
                    } else if ($scope.model.controlType === 'toggle') {
                        if (settings.debugModeEnabled) {
                            createToggleControl();
                        } else {
                            addToggleControl();
                        }
                    } else if ($scope.model.controlType === 'valueSetter') {
                        if (settings.debugModeEnabled) {
                            createValueSetter();
                        } else {
                            addValueSetterControl();
                        }
                    }

                    $scope.modal.hide();
                } else {
                    navigator.notification.alert(
                        'Unable to add the control.',
                        null,
                        'Error',
                        'Ok'
                    );
                }
            },

            toggle: function () {
                console.log($scope.model.toggled);
            },

            openSaveControls: function ($event) {
                $scope.model.panelSaved = false;
                $scope.popover.show($event);
            },

            saveControls: function () {
                var name = $scope.model.panelName.trim();
                if (name === '' || controls.length === 0) {
                    navigator.notification.alert(
                        'Unable to save the panel.',
                        null,
                        'Error',
                        'Ok'
                    );
                } else {
                    var panelName = $scope.model.panelName.trim(),
                        overwritePermission = false;

                    if (panelName) {
                        var existingPanel = window.localStorage.getItem(panelName);
                        if (existingPanel) {
                            navigator.notification.confirm(
                                'There is a panel with the same name. Overwrite?',
                                function (buttonIndex) {
                                    if (buttonIndex === 1) {
                                        overwritePermission = true;
                                    }
                                },
                                'Panel name conflict',
                                ['Yes', 'No']
                            );
                        }

                        if (!existingPanel || (existingPanel && overwritePermission)) {
                            console.log('Saving as ' + name + ', ' + controls.length);
                            var panels = null,
                                panelsData = window.localStorage.getItem('panels');
                            if (panelsData) {
                                panels = JSON.parse(panelsData);
                            } else {
                                panels = [];
                            }

                            panels.push($scope.model.panelName);
                            window.localStorage.setItem('panels', JSON.stringify(panels));
                            window.localStorage.setItem(panelName, JSON.stringify(controls));
                            $scope.model.panelSaved = true;
                        }
                    } else {
                        navigator.notification.alert(
                            'Please enter the panel name.',
                            null,
                            'Error',
                            'Ok'
                        );
                    }
                }

                $scope.model.panelName = '';
                $scope.popover.hide();
            },

            shutdownGpio: function () {
                var requestParams = {
                    action: 'shutdown'
                };

                navigator.notification.confirm(
                    'Are you sure you want to shutdown GPIO?',
                    function (buttonIndex) {
                        if (!settings.debugModeEnabled && buttonIndex === 1) {
                            $http.jsonp(getActionUrl(requestParams));
                        }
                    },
                    'Shutdown GPIO',
                    ['Yes', 'No']
                );

            },

            clearPanel: function () {
                angular.element(document.getElementById('toggleContainer')).empty();
                angular.element(document.getElementById('sliderContainer')).empty();
                controls = [];
                $scope.controls = {};
            }
        };

        $scope.controls = {};

        $scope.model = {
            brightness: 0,
            serveAngle: 0,
            servoAngle: 0,
            gpio: 0,
            controlType: '',
            maxValue: '',
            minValue: '',
            startValue: '',
            controlName: '',
            panelName: '',
            toggled: false,
            panelSaved: false
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
            $scope.popover.remove();
        });
    };

    app.controller('RPiApp.PanelController', ['$scope', '$compile', '$ionicModal', '$ionicPopover', '$http', 'settings', PanelController]);
}(angular.module('RPiApp')));