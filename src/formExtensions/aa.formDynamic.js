/*
 * AngularAgility Dynamic Form
 *
 * https://github.com/AngularAgility/AngularAgility
 *
 * Copyright (c) 2014 - Roland Zwaga
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
(function(){
    'use strict';
    angular.module('aa.formDynamic', ['aa.formServices'])
        .directive('aaDynamicForm', ['$compile', '$parse', 'aaFormConfigurationService', 'aaDynamicFormConfig', function($compile, $parse, formConfigService, aaDynamicFormConfig) {
            return {
                restrict: 'A',
                scope: false,
                replace: true,
                priority: 500,
                terminal: true,
                compile: function () {
                    var _this = this;
                    return function (scope, elem, attr) {
                        var formConfig = $parse(attr.formConfig)(scope);
                        elem.removeAttr('form-config');
                        elem.removeAttr('aa-dynamic-form');
                        if (formConfig) {
                            _this.createEntitiesElements(formConfig, elem);
                            if (formConfig.validationConfig) {
                                formConfig.validationConfig.ignore = formConfig.validationConfig.ignore || {};
                                formConfigService.findFormElements(elem.children(), formConfig.validationConfig);
                            }
                        }
                        $compile(elem)(scope);
                    };
                },
                createEntitiesElements: function (config, rootElement) {
                    var _this = this;
                    angular.forEach(config.entities, function (entity) {
                        _this.createEntityElements(entity, rootElement);
                    });
                },
                createEntityElements: function (entity, rootElement) {
                    for (var name in entity.properties) {
                        this.createPropertyElement(entity, entity.properties[name], name, rootElement);
                    }
                },
                createPropertyElement: function (entity, propertyConfig, propertyName, rootElement) {
                    if (angular.isString(propertyConfig.type)) {
                        rootElement.append(this.createSimplePropertyElement(entity, propertyConfig.type, propertyName));
                    } else {
                        rootElement.append(this.createComplexPropertyElement(entity, propertyConfig.type, propertyName, rootElement));
                    }
                },
                createSimplePropertyElement: function (entity, propertyType, propertyName) {
                    return aaDynamicFormConfig.elementCreationStrategies[propertyType](entity, propertyType, propertyName);
                },
                createComplexPropertyElement: function (entity, propertyTypeConfig, propertyName) {
                    return aaDynamicFormConfig.elementCreationStrategies[propertyTypeConfig.name](entity, propertyName, propertyTypeConfig);
                }
            };
        }]);
})();