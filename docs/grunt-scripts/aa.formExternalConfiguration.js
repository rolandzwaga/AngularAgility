/*
 * AngularAgility Form External Validation Configuration
 *
 * https://github.com/AngularAgility/AngularAgility
 *
 * Copyright (c) 2014 - Roland Zwaga
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function() {
    /**
     * @ngdoc overview
     * @name aa.formExternalConfiguration
     *
     * @description
     * This module contains the form extension directives that are used to easily generate
     * angular form elements using an external configuration.
     *
     * Instead of defining all the validation specs directly in the markup, these specs
     * can be passed to the aaConfiguredForm directive as a regular JavaScript object.
     *
     * This approach allows you to have the validation data to be retrieved from a server,
     * for example.
     * Also, when different kinds of form layouts/visualisations exist for the same data
     * across an application, this approach might save a bunch of markup typing.
     *
     * The configuration object has an interface like this:
     * var formconfig = {
    *   validations:Object,
    *   ignore?:Object,
    *   globals?:Object,
    *   resolve?:Object,
    *   resolveFn?:Function
    * }
     *
     * A simple configuration looks like this:
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
       scope.user = {
           name:'Test1',
       };
       scope.formconfig = {
           validations: {
               user:{
                   name: {
                       'ng-minlength':8,
                       required:true
                   },
               }
           }
       };
    }]);
     </script>
     <div ng-controller="main">
     <div aa-configured-form validation-config="formconfig" ng-form="exampleForm">
     <input type="text" ng-model="user.name" />
     </div>
     </div>
     </pre>
     *
     * If there are validation specs you need to add to all applicable inputs, add a globals
     * property:
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
       scope.user = {
           name:'Test1',
       };
       scope.formconfig = {
           globals: {
               'aa-valid-icon':''
           },
           validations: {
               user:{
                   name: {
                       'ng-minlength':8,
                       required:true
                   },
               }
           }
       };
    }]);
     </script>
     <div ng-controller="main">
     <div aa-configured-form validation-config="formconfig" ng-form="exampleForm">
     <input type="text" ng-model="user.name" />
     </div>
     </div>
     </pre>
     *
     * If the scope name doesn't match the validation name for some reason,
     * add a resolve property to the config like this:
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
        scope.user = {
           name:'Test1',
        };
        scope.formconfig = {
           resolve: {
               user:'UserType'
           },
           validations: {
               'UserType':{
                   name: {
                       'ng-minlength':8,
                       required:true
                   },
               }
           }
        };
    }]);
     </script>
     <div ng-controller="main">
     <div aa-configured-form validation-config="formconfig" ng-form="exampleForm">
     <input type="text" ng-model="user.name" />
     </div>
     </div>
     </pre>
     *
     * If the resolving the scope name to the validation name is more complex,
     * add a resolveFn property to the config:
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
        scope.user = {
           name:'Test1',
           __type:'UserType'
        };
        scope.formconfig = {
           resolveFn: function(modelValue){
               //modelValue === 'user.name'
               if (modelValue.indexOf('.') > -1) {
                   parts = modelValue.split('.');
               }
               var modelName = parts[parts.length-2];
               return scope[modelName]['__type'];
           },
           validations: {
               'UserType':{
                   name: {
                       'ng-minlength':8,
                       required:true
                   },
               }
           }
        };
    }]);
     </script>
     <div ng-controller="main">
     <div aa-configured-form validation-config="formconfig" ng-form="exampleForm">
     <input type="text" ng-model="user.name" />
     </div>
     </div>
     </pre>
     *
     * Named input fields can be added to the 'ignore' section of the configuration,
     * that way they won't be processed (so also the globals won't be added):
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
	scope.user = {
	   name:'Test1',
	   lastname:'Test2'
	};
	scope.formconfig = {
	   globals: {
		   'aa-valid-icon':''
	   },
	   ignore: {
		   'last-name':true
	   },
	   validations: {
		   'user':{
			   name: {
				   'ng-minlength':8,
				   required:true
			   },
		   }
	   }
	};
	}]);
     </script>
     <div ng-controller="main">
     <div aa-configured-form validation-config="formconfig" ng-form="exampleForm">
     <input type="text" ng-model="user.name" />
     <input type="text" ng-model="user.lastname" name="last-name/>
     </div>
     </div>
     </pre>
     *
     * For very large models that have lots of properties sharing a lot of common validations,
     * it is also possible to let one property config inherit from another, like this:
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
        scope.user = {
           name:'Test1',
           lastname:'Test2'
        };
        scope.formconfig = {
           validations: {
               'user':{
                   name: {
                       'ng-minlength':4,
                       'ng-maxlength':8,
                       required:true,
                       'aa-label':'Name'
                   },
                   property2: {
                       'aa-inherit':'name',
                       'aa-label':'Property 2'
                   },
                   property3: {
                       'aa-inherit':'name',
                       'aa-label':'Property 3'
                   },
                   property4: {
                       'aa-inherit':'name',
                       'aa-label':'Property 4'
                   }
               }
           }
        };
}]);
     </script>
     </pre>
     *
     * It is even possible to inherit from a property belonging to another
     * model validation:
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
    scope.user = {
       name:'Test1',
       lastname:'Test2'
    };
    scope.formconfig = {
       validations: {
           'person':{
               name: {
                   'ng-minlength':4,
                   'ng-maxlength':8,
                   required:true,
                   'aa-label':'Name'
               },
           },
           'user':{
               name: {
                   'aa-inherit':'person.name',
                   'aa-label':'Name'
               },
               property2: {
                   'aa-inherit':'name',
                   'aa-label':'Property 2'
               },
               property3: {
                   'aa-inherit':'name',
                   'aa-label':'Property 3'
               },
               property4: {
                   'aa-inherit':'name',
                   'aa-label':'Property 4'
               }
           }
       }
    };
}]);
     </script>
     </pre>
     *
     * The inheritance also supports overriding,
     * simply add the override to the property config.
     *
     <pre>
     <script>
     var app = angular.module('app', ['aa.formExternalConfiguration', 'aa.notify'])
     .controller('main', ['$scope', function(scope) {
    scope.user = {
       name:'Test1',
       lastname:'Test2'
    };
    scope.formconfig = {
       validations: {
           'person':{
               name: {
                   'ng-minlength':4,
                   'ng-maxlength':8,
                   required:true,
                   'aa-label':'Name'
               },
           },
           'user':{
               name: {
                   'aa-inherit':'person.name',
                   'ng-maxlength':12,
                   'aa-label':'Name'
               },
               property2: {
                   'aa-inherit':'person.name',
                   'aa-label':'Property 2'
               },
               property3: {
                   'aa-inherit':'person.name',
                   'aa-label':'Property 3'
               },
               property4: {
                   'aa-inherit':'person.name',
                   'aa-label':'Property 4'
               }
           }
       }
    };
}]);
     </script>
     </pre>
     *
     */

    'use strict';
    angular.module('aa.formExternalConfiguration', ['aa.formServices'])
        .directive('aaConfiguredForm', ['$compile', '$parse', 'aaFormConfigurationService', function($compile, $parse, formConfigService) {
            return {
                restrict: 'A',
                scope: false,
                replace: true,
                priority: 500,
                terminal: true,
                compile: function() {
                    return function(scope, elem, attr) {
                        var validationConfig = $parse(attr.validationConfig)(scope);
                        elem.removeAttr('validation-config');
                        elem.removeAttr('aa-configured-form');
                        if(validationConfig) {
                            validationConfig.ignore = validationConfig.ignore || {};
                            formConfigService.findFormElements(elem.children(), validationConfig);
                        }
                        $compile(elem)(scope);
                    };
                }
            };
        }]);
})();