'use strict';
// .controller('MyController', ['myService', function (myService) {
//   // Do something with myService
// }]);
angular
    .module('inspinia')
    .controller('datatablesCtrlInsTypes', ['$scope' , '$uibModal', '$http', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'CONFIG', datatablesCtrl])
    .controller('DialogInstCtrl', ['$scope', '$uibModalInstance', 'selectedInsType', 'scopehtml', '$log', , DialogInstCtrl]);


function datatablesCtrl($scope, $uibModal, $http, $compile, DTOptionsBuilder, DTColumnBuilder,CONFIG){
    $scope.data = [];
    $scope.instype = [];

    $scope.edit = function(id){
        console.log('Editing ' + id);
        $scope.instype = $.grep($scope.data, function(e){ return e.id == id; })[0];
        var dialogInst = $uibModal.open({
            templateUrl: 'app/instances/ins_typ_popup_edit.html',
            controller: 'DialogInstCtrl',
            size: 'lg',
            resolve: {
                selectedInsType: function () {
                    return $scope.instype;
                },
                scopehtml: function() {
                    return {
                                title: "Update Instance",
                                button_submit: "Update"
                            };
                }
            }
        });

        dialogInst.result.then(function (updateInsType) {
            $http({
                method: 'POST',
                url: CONFIG.url_base + '/vm/v1/instancetype/update',
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'id':                   updateInsType.id,
                    'type_instances':       updateInsType.type_instances,
                    'type_instances_name':  updateInsType.type_instances_name,
                    'created_date':         updateInsType.created_date,
                    'modified_date':        updateInsType.modified_date,
                    'is_active':            updateInsType.is_active,
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            })
                .success(function (result) {
                    $scope.reloadData();
                    console.log(result)
                })
                .error(function (result){
                    console.log(result)
                    console.log("Error during http post request.");
                });

            // $scope.instype.push(instype);

            }, function () {
                // $animate.enabled(false, element)
                // $log.info('Modal dismissed at: ' + new Date());
        });
        // $scope.dtOptions.reloadData();
    }
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        // $scope.dtOptions.reloadData();
    };

    $scope.dtInstance = {};

    $scope.reloadData = function() {
       $scope.dtInstance.rerender(); 
    }

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', function(data, callback, settings){
            $http.get(CONFIG.url_base + '/vm/v1/instancetype',{ 
                params: {
                    offset: settings._iRecordsDisplay,
                    limit: settings._iDisplayLength,
                }
                // url: +settings.aoData.length,
                // method: 'GET',
                // responseType: "json",
                // // data: {
                // },
                // dept_name__icontains: data.search.value
            })
                .success(function (result){
                    if (result.status == 200) {
                        callback({
                            recordsTotal: result.data.count,
                            recordsFiltered: 10,
                            // recordsDisplay: 10
                            data: result.data.data
                        });
                        $scope.data = result.data.data;
                    }
                })
                .error(function (){
                    console.log("Error during http get request.");
                });
        })
        .withOption('createdRow', function(row, data, dataIndex) {
              $compile(angular.element(row).contents())($scope);
        })
        .withDataProp('data')
        // .withDOM('<"custom-btn">pitrfl')
        .withDOM('<"htmlbuttons">lTfgitp')
        .withButtons([
            {
                text: 'Add Instance Type',
                key: '1',
                action: function (e, dt, node, config) {
                    $scope.instype = [];
                    var stringdate = $scope.dateformat();
                    $scope.instype.created_date = stringdate;
                    $scope.instype.modified_date = stringdate;
                    var dialogInst = $uibModal.open({
                        templateUrl: 'app/instances/ins_typ_popup_edit.html',
                        controller: 'DialogInstCtrl',
                        size: 'lg',
                        resolve: {
                            selectedInsType: function() {
                                return $scope.instype;
                            },
                            scopehtml: function() {
                                return {
                                            title: "Add New Instance Type",
                                            button_submit: "Add Instance Type"
                                        };
                            }
                        }
                    });
                    dialogInst.result.then(function (addInsType) {
                        console.log(addInsType);
                        $http({
                            method: 'POST',
                            url: CONFIG.url_base + '/vm/v1/instancetype/create',
                            transformRequest: function(obj) {
                                var str = [];
                                for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                'type_instances':       addInsType.type_instances,
                                'type_instances_name':  addInsType.type_instances_name,
                                'created_date':         addInsType.created_date,
                                'modified_date':        addInsType.modified_date,
                                'is_active':            addInsType.is_active,
                            },
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        })
                            .success(function (result) {
                                $scope.reloadData();
                                console.log(result)
                            })
                            .error(function (result){
                                console.log(result)
                                console.log("Error during http post request.");
                            });

                        // $scope.instype.push(instype);

                        }, function () {
                            // $animate.enabled(false, element)
                            // $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            }
        ])
        // .withDOM('<"html5buttons"B>lTfgitp')
        // .withButtons([
        //     {extend: 'copy'},
        //     {extend: 'csv'},
        //     {extend: 'excel', title: 'ExampleFile'},
        //     {extend: 'pdf', title: 'ExampleFile'},

        //     {extend: 'print',
        //         customize: function (win){
        //             $(win.document.body).addClass('white-bg');
        //             $(win.document.body).css('font-size', '10px');

        //             $(win.document.body).find('table')
        //                 .addClass('compact')
        //                 .css('font-size', 'inherit');
        //         }
        //     }
        // ])
        .withOption('fnRowCallback',function(nRow, aData, iDisplayIndex, settings){
            // if(settings.aoData.length > 0) {
            //     var api = this.api();
            //     var pgNo = api.page.info();
            //     var currPg = pgNo.page;
            //     var totalPg = pgNo.pages;
            // }
            $("td:first", nRow).html(settings +1);
            return nRow;
        })
        .withOption('drawCallback', function(settings) {
                  if(settings.aoData.length > 0) {
                    var api = this.api();
                    var pgNo = api.page.info();
                    var currPg = pgNo.page;
                    var totalPg = pgNo.pages;
                    // get the label where i need to print the page number details
                    // var myEl = angular.element(document.querySelector('#pgNoDetail'));
                    // myEl.text('Page '+(currPg + 1)+' of '+totalPg);
                   }
            })
        .withOption('lengthMenu',[5, 10, 25, 50])
        ;

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle('ID').withOption('id'),
        DTColumnBuilder.newColumn('type_instances').withTitle('Instances Type'),
        DTColumnBuilder.newColumn('type_instances_name').withTitle('Name'),
        DTColumnBuilder.newColumn('created_date').withTitle('Created Date'),
        DTColumnBuilder.newColumn('modified_date').withTitle('Modified Date'),
        DTColumnBuilder.newColumn('is_active').withTitle('Active'),
        DTColumnBuilder.newColumn(null).withTitle('Action')
            .renderWith(function(data, type, full, meta) {
                return '<button class="btn btn-warning btn-sm" ng-click="edit(\'' + data.id + '\')">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</button>&nbsp;' +
                    '<button class="btn btn-danger btn-sm" ng-click="delete(' + data.id + ')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>';
        }).notSortable()
    ];

     /**
     * persons - Data used in Tables view for Data Tables plugin
     */
    $scope.persons = [
    ];

    $scope.dateformat = function() {
        var d = new Date()
        return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + 
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + 
        ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    };
    // $scope.loadinstancetype();
}

function DialogInstCtrl($scope, $uibModalInstance, selectedInsType, scopehtml, $log) {
    $scope.instype = selectedInsType;
    $scope.html_popup = scopehtml
    $scope.select_data = {
        dataOption: [
            { "Display": "Active", "Value": "true"},
            { "Display": "Inactive", "Value": "false"}
        ],
        selectedOption: {"Value": selectedInsType.is_active}
    };

    $scope.submitInsType = function () {
        $uibModalInstance.close($scope.instype);
    //  $scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
