/*
 * AngularAgility Form Configuration Service
 *
 * https://github.com/AngularAgility/AngularAgility
 *
 * Copyright (c) 2014 - Roland Zwaga
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
(function() {
    'use strict';
    angular.module('aa.formServices', [])
        .service('aaFormConfigurationService', [function() {

            this.mergedAttrs = [];

            this.findFormElements = function(elements, validationConfig) {
                var _this = this;
                angular.forEach(elements, function(element) {
                    var jqElm = angular.element(element);
                    var modelAttr = jqElm.attr('ng-model') || jqElm.attr('data-ng-model') || jqElm.attr('ngModel') || jqElm.attr('aa-field') || jqElm.attr('aa-field-group') || jqElm.attr('data-aa-field') || jqElm.attr('data-aa-field-group');
                    if(modelAttr) {
                        if(validationConfig.ignore[jqElm[0].name]) {
                            return;
                        }
                        _this.processElement(jqElm, modelAttr, validationConfig);
                    }
                    _this.findFormElements(jqElm.children(), validationConfig);
                });
            };

            this.processElement = function(jqElm, nameAttr, validationConfig) {
                if(!jqElm.attr('name')) {
                    jqElm.attr('name', nameAttr.split('.').join('-'));
                }
                this.addValidations(jqElm, nameAttr, validationConfig);
            };

            this.addValidations = function(jqElm, modelValue, validationConfig) {
                var parts;
                var name;

                if(modelValue.indexOf('.') > -1) {
                    parts = modelValue.split('.');
                } else {
                    throw new Error("the name attribute value needs to contain a '.' char");
                }

                var modelName = parts[parts.length - 2];
                var propName = parts[parts.length - 1];

                modelName = this.resolveModelName(modelName, modelValue, validationConfig);

                var modelValidations = validationConfig.validations[modelName];
                if(modelValidations) {
                    if(!this.checkIfAlreadyMerged(modelName + '.' + propName)) {
                        if(modelValidations[propName] && modelValidations[propName]['aa-inherit']) {
                            this.mergeInheritedAttributes(modelValidations[propName], modelValidations[propName]['aa-inherit'], modelValidations, validationConfig.validations);
                        }
                    }
                    this.addAttributes(jqElm, modelValidations[propName]);
                } else {
                    console.log('no validations defined for ' + modelName);
                }
                var globals = validationConfig.globals;
                if(globals) {
                    this.addAttributes(jqElm, globals, modelValidations, validationConfig);
                }
            };

            this.checkIfAlreadyMerged = function(name) {
                if(this.mergedAttrs.indexOf(name) < 0) {
                    this.mergedAttrs.push(name);
                    return false;
                }
                return true;
            };

            this.addAttributes = function(jqElm, attrs) {
                for(var name in attrs) {
                    if(name !== 'aa-inherit') {
                        if(name !== 'required') {
                            jqElm.attr(name, attrs[name]);
                        } else {
                            jqElm.prop(name, attrs[name]);
                        }
                    }
                }
            };

            this.mergeInheritedAttributes = function(targetAttrs, inheritedName, validations, allValidations) {
                var inheritedAttrs = this.getInheritedAttributes(inheritedName, validations, allValidations);
                if((inheritedAttrs['aa-inherit'] && (!this.checkIfAlreadyMerged(inheritedAttrs['aa-inherit'])))) {
                    this.mergeInheritedAttributes(inheritedAttrs, inheritedAttrs['aa-inherit'], validations, allValidations);
                }
                for(var name in inheritedAttrs) {
                    if(!targetAttrs.hasOwnProperty(name)) {
                        if(name !== 'aa-inherit') {
                            targetAttrs[name] = inheritedAttrs[name];
                        }
                    }
                }
            };

            this.getInheritedAttributes = function(validationName, validations, allValidations) {
                if(validationName.indexOf('.') < 0) {
                    return validations[validationName];
                } else {
                    var parts = validationName.split('.');
                    return allValidations[parts[0]][parts[1]];
                }
            };

            this.resolveModelName = function(modelName, modelValue, config) {
                if(!config.resolveFn) {
                    return (config.resolve && config.resolve[modelName]) ? config.resolve[modelName] : modelName;
                } else {
                    return config.resolveFn(modelValue);
                }
            };
        }]);
})();