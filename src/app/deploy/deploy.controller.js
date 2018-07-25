'use strict';

angular.module('inspinia')
    .controller('DeployCtrl', ['$scope', '$http', '$log', 'toaster', '$timeout', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'CONFIG','$state', DeployCtrl]);
    // .controller('toastrCtrl', ['$scope', 'toaster', toastrCtrl]);

function DeployCtrl($scope, $http, $log, toaster, $timeout, $compile, DTOptionsBuilder, DTColumnBuilder, CONFIG, $state) {
    $scope.data = [];
    $scope.repository_list = []
    $scope.Environment = function() {
        $http.get(CONFIG.url_base + '/ci/v1/groups')
            .success(function(result) {
                if (result.status == 200 && result.data != null) {
                    $scope.groups.dataOption = result.data;
                }
            })
            .error(function() {
                console.log("Error during http get request.");
            });
    };
    $scope.Services = function() {
        $http.get(CONFIG.url_base + '/ci/v1/jobs')
            .success(function(result) {
                if (result.status == 200 && result.data != null) {
                    $scope.services_list = result.data;
                    var groups_obj = $scope.groups.selectedOption;
                    var services = $scope.services_list.filter(function(e){ 
                        return e.services.groups.id == groups_obj.id;
                    });
                    if (services.length > 0) {
                        $scope.services.dataOption = services;
                        $scope.services.selectedOption = services[0];
                        var branches = services[0].services.branches;
                        $scope.branches.dataOption = branches;
                        $scope.branches.selectedOption = branches[0];
                    }
                }
            })
            .error(function() {
                console.log("Error during http get request repository.");
            });
    };
    // $scope.Repo = function() {
    //     $http.get(CONFIG.url_base + '/ci/v1/jobsrepo')
    //         .success(function(result) {
    //             if (result.status == 200 && result.data != null) {
    //                 $scope.repository_list = result.data;
    //                 var project_obj = $scope.projects.selectedOption;
    //                 var services = $scope.repository_list.filter(function(e){ 
    //                     return e.repository.project.id == project_obj.id;
    //                 });
    //                 if (services.length > 0) {
    //                     $scope.repository.dataOption = services;
    //                     $scope.repository.selectedOption = services[0];
    //                     var branches = services[0].repository.branches;
    //                     $scope.branches.dataOption = branches;
    //                     $scope.branches.selectedOption = branches[0];
    //                 }
    //             }
    //         })
    //         .error(function() {
    //             console.log("Error during http get request repository.");
    //         });
    // };
    $scope.Services();
    $scope.Environment();
    $scope.groups = {
        dataOption: [],
        selectedOption: { 'id': '1' },
    };
    $scope.services = {
        dataOption: [],
        selectedOption: {},
    };
    $scope.branches = {
        dataOption: [],
        selectedOption: { 'id': '1' },
    };

    $scope.selectEnvironment = function() {
        var groups_obj = $scope.groups.selectedOption;
        var services = $scope.repository_list.filter(function(e) {
            return e.repository.project.id == groups_obj.id;
        });
        if (services.length > 0) {
            $scope.repository.dataOption = services;
            $scope.repository.selectedOption = services[0];
            var branches = services[0].repository.branches;
            $scope.branches.dataOption = branches;
            $scope.branches.selectedOption = branches[0];
        } else{
            $scope.repository.dataOption = [];
            $scope.branches.dataOption = [];
        }
    };

    // $scope.selectproject = function() {
    //     var project_obj = $scope.projects.selectedOption;
    //     var services = $scope.repository_list.filter(function(e) {
    //         return e.repository.project.id == project_obj.id;
    //     });
    //     if (services.length > 0) {
    //         $scope.repository.dataOption = services;
    //         $scope.repository.selectedOption = services[0];
    //         var branches = services[0].repository.branches;
    //         $scope.branches.dataOption = branches;
    //         $scope.branches.selectedOption = branches[0];
    //     } else{
    //         $scope.repository.dataOption = [];
    //         $scope.branches.dataOption = [];
    //     }
    // };

    $scope.selectrepository = function() {
        var services = $scope.repository.selectedOption;
        if (services != null) {
            var branches = services.repository.branches;
            $scope.branches.dataOption = branches;
            $scope.branches.selectedOption = branches[0];
        } else {
            $scope.branches.dataOption = []
        }

    };

    $scope.submitDeploy = function () {
        var projects = $scope.projects.selectedOption;
        var services = $scope.repository.selectedOption;
        var branches = $scope.branches.selectedOption;
        var build_type = 'deploy';
        if (services != null && services.hasOwnProperty('id') && branches.hasOwnProperty('name')) {
            $scope.build = function() {
                $http.get(CONFIG.url_base + '/ci/v1/jenkins/build',{ 
                    params: {
                        'group': services.job.group.name,
                        'job': services.job.name,
                        'branch': branches.name,
                        'jobsrepo_id': services.id,
                        'branch_id': branches.id,
                        'description': $scope.description,
                        'environment': $scope.environment,
                        'build_type': build_type,
                    }})
                    .success(function(result) {
                        if (result.status == 200) {
                            toaster.success({body:"Add job build successful."});
                            $scope.reloadData();
                        }
                    })
                    .error(function() {
                        toaster.warning("Error during http get request build.");
                    });
            };
            $scope.build();
            $scope.newtaskdeloy();
            //CONFIG.url_base +  /ci/v1/build
        } else{
            toaster.warning({ title:"",body:"Unknown Error"});
        }
        // var instypes_default = 1;
        // if (typeof($scope.projects.selectedOption) !== "undefined" ) {
        //     instypes_default = $scope.projects.selectedOption.id;
        // }
    };

    $scope.newtaskdeloy = function() {
        // console.log($('#box_deploy'))
        var ibox = $('#box_deploy');
        ibox.slideToggle(200);
    };

    $scope.dtInstance = {};
    $scope.reloadData = function() {
       $scope.dtInstance.rerender(); 
    }
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', function(data, callback, settings){
            $http.get(CONFIG.url_base + '/ci/v1/jobsbuild',{ 
                params: {
                    offset: settings._iRecordsDisplay,
                    limit: settings._iDisplayLength,
                }
            })
                .success(function (result){
                    if (result.status == 200 && result.data != null) {
                        callback({
                            // recordsTotal: result.data.count,
                            recordsFiltered: 10,
                            // recordsDisplay: 10
                            data: result.data
                        });
                        $scope.data = result.data;
                    }
                    // console.log("Data is empty !!!")
                })
                .error(function (){
                    console.log("Error during http get request.");
                });
        })
        .withOption('createdRow', function(row, data, dataIndex) {
              $compile(angular.element(row).contents())($scope);
        })
        .withDataProp('data')
        .withDOM('<"htmlbuttons">lTfgitp')
        // .withOption('fnRowCallback',function(nRow, aData, iDisplayIndex, settings){
        //     $("td:first", nRow).html(settings +1);
        //     return nRow;
        // })
        .withOption('drawCallback', function(settings) {
                  if(settings.aoData.length > 0) {
                    var api = this.api();
                    var pgNo = api.page.info();
                    var currPg = pgNo.page;
                    var totalPg = pgNo.pages;
                   }
            })
        .withOption('lengthMenu',[5, 10, 25, 50])
        
        .withOption("order", [[3, "desc"]]);

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('build_number').withTitle('ID'),
        DTColumnBuilder.newColumn('branch.repository').withTitle('Service'),
        DTColumnBuilder.newColumn('branch.name').withTitle('Branch'),
        DTColumnBuilder.newColumn('created_date').withTitle('Created Date'),
        DTColumnBuilder.newColumn('environment').withTitle('Environment'),
        DTColumnBuilder.newColumn('status').withTitle('Status'),
        DTColumnBuilder.newColumn('result').withTitle('Result'),
        DTColumnBuilder.newColumn('build_type').withTitle('Type'),
        DTColumnBuilder.newColumn(null).withTitle('Action')
            .renderWith(function(data, type, full, meta) {
                var html = '<button class="btn btn-info btn-sm" ng-click="showdetail(\'' + data.id + '\')">' +
                           '   <i class="fa fa-list"></i>' +
                           '</button>&nbsp;';
                if (data.result != null && data.result.length > 0){
                    html += '<button class="btn btn-default btn-sm" ng-click="showlog(' + data.id + ')">' +
                            '   <i class="fa fa-file"></i>' +
                            '</button>';
                } 
                return html;
        }).notSortable()
    ];

    $scope.showdetail = function(id) {
        var jobsbuild = $scope.data.filter(function(e) {
            return e.id == id;
        });
        $state.go("deploy.details", { data: jobsbuild });
        // $location.path("deploydetails.html")
    };

    $scope.showlog = function(id) {
        var jobsbuild = $scope.data.filter(function(e) {
            return e.id == id;
        });
        $state.go("deploy.logs", { data: jobsbuild[0] });
        // $location.path("deploydetails.html")
    };
}

// function toastrCtrl($scope, toaster){

//     $scope.demo1 = function(){
//         toaster.success({ body:"Hi, welcome to Inspinia. This is example of Toastr notification box."});
//     };

//     $scope.demo2 = function(){
//         toaster.warning({ title: "Title example", body:"This is example of Toastr notification box."});
//     };

//     $scope.demo3 = function(){
//         toaster.pop({
//             type: 'info',
//             title: 'Title example',
//             body: 'This is example of Toastr notification box.',
//             showCloseButton: true

//         });
//     };

//     $scope.demo4 = function(){
//         toaster.pop({
//             type: 'error',
//             title: 'Title example',
//             body: 'This is example of Toastr notification box.',
//             showCloseButton: true,
//             timeout: 600
//         });
//     };

// }