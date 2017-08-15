(function() {
  'use strict';

  angular
    .module('inspinia')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/components/common/content.html"
      })
      .state('index.main', {
        url: "/main",
        templateUrl: "app/main/main.html",
        data: { pageTitle: 'Example view' }
      })
      .state('instances', {
          abstract: true,
          url: "/instances",
          templateUrl: "app/components/common/content.html",
      })
      .state('instances.instances', {
        url: "/main",
        templateUrl: "app/instances/instances.html",
        data: { pageTitle: 'Example view' },
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        serie: true,
                        files: ['app/js/dataTables/datatables.min.js','app/css/plugins/dataTables/datatables.min.css']
                    },
                    {
                        serie: true,
                        name: 'datatables',
                        files: ['app/js/dataTables/angular-datatables.min.js']
                    },
                    {
                        serie: true,
                        name: 'datatables.buttons',
                        files: ['app/js/dataTables/angular-datatables.buttons.min.js']
                    }
                ]);
            }
        }
      })
      .state('instances.instances_types', {
        url: "/instancetypes",
        templateUrl: "app/instances/instancetypes.html",
        data: { pageTitle: 'Instance Types' },
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        serie: true,
                        files: ['app/js/dataTables/datatables.min.js','app/css/plugins/dataTables/datatables.min.css']
                    },
                    {
                        serie: true,
                        name: 'datatables',
                        files: ['app/js/dataTables/angular-datatables.min.js']
                    },
                    {
                        serie: true,
                        name: 'datatables.buttons',
                        files: ['app/js/dataTables/angular-datatables.buttons.min.js']
                    }
                ]);
            }
        }
      });


    $urlRouterProvider.otherwise('/index/main');
  }

})();
