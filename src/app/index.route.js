(function() {
  'use strict';

  angular
    .module('inspinia')
    .constant('CONFIG',{
      'url_base': 'http://localhost:8000',
    })
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
        data: { pageTitle: 'Dzones DevOps Tools' }
      })
      .state('instances', {
          abstract: true,
          url: "/instances",
          templateUrl: "app/components/common/content.html",
      })
      .state('instances.instances', {
        url: "/main",
        templateUrl: "app/instances/instances.html",
        data: { pageTitle: 'Instances' },
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
      })
      .state('deploy', {
          abstract: true,
          url: "/deploy",
          templateUrl: "app/components/common/content.html",
      })
      .state('deploy.deploytool', {
          url: "/deploytool",
          templateUrl: "app/deploy/deploytool.html",
          data: { pageTitle: 'Deploy tool' },
          resolve: {
              loadPlugin: function ($ocLazyLoad) {
                  return $ocLazyLoad.load([
                      {
                          insertBefore: '#loadBefore',
                          name: 'toaster',
                          files: ['app/js/toastr/toastr.min.js', 'app/css/plugins/toastr/toastr.min.css']
                      },
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
      .state('deploy.logs', {
          url: "/logs",
          templateUrl: "app/deploy/logs.html",
          data: { pageTitle: 'Logs' },
          params: { data: null },
      })
      .state('deploy.details', {
          url: "/details",
          templateUrl: "app/deploy/deploydetails.html",
          data: { pageTitle: 'Details' },
          params: { data: null },
          resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['app/js/toastr/toastr.min.js', 'app/css/plugins/toastr/toastr.min.css']
                        },
                        {
                            files: ['app/js/sweetalert/sweetalert.min.js', 'app/css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['app/js/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
      })
      ;


    $urlRouterProvider.otherwise('/index/main');
  }

})();
