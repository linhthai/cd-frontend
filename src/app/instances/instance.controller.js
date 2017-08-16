'use strict';

angular.module('inspinia')
    .controller('datatablesCtrlIns', ['$scope' , '$uibModal', '$http', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', datatablesCtrl])
    .controller('DialogInstCtrl', ['$scope', '$uibModalInstance', '$http', 'selectedIns', 'scopehtml', '$log', DialogInstCtrl]);

function datatablesCtrl($scope, $uibModal, $http, $compile, DTOptionsBuilder, DTColumnBuilder){
    $scope.data = [];
    $scope.ins = [];

    $scope.edit = function(id){
        console.log('Editing ' + id);
        $scope.ins = $.grep($scope.data, function(e){ return e.id == id; })[0];
        var dialogInst = $uibModal.open({
            templateUrl: 'app/instances/ins_popup.html',
            controller: 'DialogInstCtrl',
            size: 'lg',
            resolve: {
                selectedIns: function () {
                    return $scope.ins;
                },
                scopehtml: function() {
                    return {
                                title: "Update Instance",
                                button_submit: "Update"
                            };
                }
            }
        });

        dialogInst.result.then(function (updateIns) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/vm/v1/instance/update',
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'id':                   updateIns.id,
                    'instance_name':        updateIns.instance_name,
                    'instance_type':        updateIns.instance_type,
                    'ip_address':           updateIns.ip_address,
                    'description':          updateIns.description,
                    'status':               updateIns.status,
                    'created_date':         updateIns.created_date,
                    'modified_date':        updateIns.modified_date,
                    'is_active':            updateIns.is_active,
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
            $http.get('http://localhost:8000/vm/v1/instance',{ 
                params: {
                    offset: settings._iRecordsDisplay,
                    limit: settings._iDisplayLength,
                }
            })
                .success(function (result){
                    if (result.status == 200 && result.data != null) {
                        callback({
                            recordsTotal: result.data.count,
                            recordsFiltered: 10,
                            // recordsDisplay: 10
                            data: result.data.data
                        });
                        $scope.data = result.data.data
                    }
                    console.log("Data is empty !!!")
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
        .withButtons([
            {
                text: 'Add Instance',
                key: '1',
                action: function (e, dt, node, config) {
                    $scope.ins = [];
                    var stringdate = $scope.dateformat();
                    $scope.ins.created_date = stringdate;
                    $scope.ins.modified_date = stringdate;
                    var dialogInst = $uibModal.open({
                        templateUrl: 'app/instances/ins_popup.html',
                        controller: 'DialogInstCtrl',
                        size: 'lg',
                        resolve: {
                            selectedIns: function() {
                                return $scope.ins;
                            },
                            scopehtml: function() {
                                return {
                                    title: "Add New Instance ",
                                    button_submit: "Add Instance "
                                };
                            }
                        }
                    });
                    dialogInst.result.then(function (addIns) {
                            console.log(addIns);
                            $http({
                                method: 'POST',
                                url: 'http://localhost:8000/vm/v1/instance/create',
                                transformRequest: function(obj) {
                                    var str = [];
                                    for(var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                    return str.join("&");
                                },
                                data: {
                                    'instance_name':        addIns.instance_name,
                                    'ip_address':           addIns.ip_address,
                                    'description':          addIns.description,
                                    'instance_type':        addIns.instance_type,
                                    'created_date':         addIns.created_date,
                                    'modified_date':        addIns.modified_date,
                                    'is_active':            addIns.is_active,
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
                        }, function () {
                            // $animate.enabled(false, element)
                    });
                }
            }
        ])
        .withOption('fnRowCallback',function(nRow, aData, iDisplayIndex, settings){
            $("td:first", nRow).html(settings +1);
            return nRow;
        })
        .withOption('drawCallback', function(settings) {
                  if(settings.aoData.length > 0) {
                    var api = this.api();
                    var pgNo = api.page.info();
                    var currPg = pgNo.page;
                    var totalPg = pgNo.pages;
                   }
            })
        .withOption('lengthMenu',[5, 10, 25, 50])
        ;

    $scope.dateformat = function() {
        var d = new Date()
        return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + 
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + 
        ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    };

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle('ID').withOption('id'),
        DTColumnBuilder.newColumn('instance_name').withTitle('Instance Name'),
        DTColumnBuilder.newColumn('ip_address').withTitle('IP Address'),
        DTColumnBuilder.newColumn('instance_type.type_instances_name').withTitle('Instances Type').withOption('instance_type.id'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
        DTColumnBuilder.newColumn('created_date').withTitle('Created Date'),
        DTColumnBuilder.newColumn('modified_date').withTitle('Modified Date'),
        DTColumnBuilder.newColumn('status').withTitle('Status'),
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
}

function DialogInstCtrl($scope, $uibModalInstance, $http, selectedIns, scopehtml, $log) {
    $scope.InstanceTypes = function() {
        $http.get('http://localhost:8000/vm/v1/instancetype/getallname')
            .success(function(result) {
                if (result.status == 200 && result.data != null) {
                    $scope.instypes.dataOption = result.data;
                }
            })
            .error(function() {
                console.log("Error during http get request.");
            });
    };
    $scope.InstanceTypes();
    $scope.ins = selectedIns;
    $scope.html_popup = scopehtml;
    $scope.instypes = {
        dataOption: [],
        selectedOption: selectedIns.instance_type,
    };
    $scope.select_data = {
        dataOption: [
            { "Display": "Active", "Value": "true"},
            { "Display": "Inactive", "Value": "false"}
        ],
        selectedOption: {"Value": selectedIns.is_active}
    };
    $scope.submitInstance = function () {
        $scope.ins.instance_type = $scope.instypes.selectedOption.id;
        $uibModalInstance.close($scope.ins);
    //  $scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
