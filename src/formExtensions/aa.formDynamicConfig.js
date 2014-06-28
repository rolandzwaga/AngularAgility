/**
 * Created by Roland on 6/28/2014.
 */
(function() {
    'use strict';
    angular.module('aa.formDynamic')
        .provider('aaDynamicFormConfig', function () {
            var _this = this;

            this.elementCreationStrategies = {
                select: function (entity, propertyName, propertyTypeConfig) {
                    var element = angular.element('<select data-ng-model="' + entity.name + '.' + propertyName + '"/>');
                    for (var name in propertyTypeConfig) {
                        if (name !== 'name') {
                            element.attr(name, propertyTypeConfig[name]);
                        }
                    }
                    return element;
                },
                radio: function (entity, propertyName, propertyTypeConfig) {
                    var element = angular.element('<input type="radio" data-ng-model="' + entity.name + '.' + propertyName + '"/>');
                    for (var name in propertyTypeConfig) {
                        if (name !== 'name') {
                            element.attr(name, propertyTypeConfig[name]);
                        }
                    }
                    return element;
                },
                text: function (entity, propertyType, propertyName) {
                    return angular.element('<input type="' + propertyType + '" data-ng-model="' + entity.name + '.' + propertyName + '"/>');
                },
                color: this.text,
                checkbox: this.text,
                date: this.text,
                datetime: this.text,
                "datetime-local": this.text,
                email: this.text,
                month: this.text,
                number: this.text,
                range: this.text,
                search: this.text,
                tel: this.text,
                time: this.text,
                url: this.text,
                week: this.text
            };

            this.$get = function() {
                return {
                    elementCreationStrategies: _this.elementCreationStrategies
                };
            };
        });
})();
