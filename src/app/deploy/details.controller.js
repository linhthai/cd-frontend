'use strict';

angular.module('inspinia')
    .controller('DetailsCtrl', ['$scope', '$stateParams', 'SweetAlert', 'toaster','$state', 'CONFIG', '$http', DetailsCtrl])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });
    // .controller('toastrCtrl', ['$scope', 'toaster', toastrCtrl]);

function DetailsCtrl($scope, $stateParams, SweetAlert, toaster, $state, CONFIG, $http) {
    $scope.data = $stateParams.data;
    $scope.title_small = '';
    $scope.html = {};


    $scope.getDefault = function() {
        $http.get(CONFIG.url_base + '/ci/v1/jobsbuild/getdefault')
            .success(function(result) {
                if (result.status == 200 && result.data != null) {
                    $scope.showData(result.data);
                    $scope.data = result.data;
                }
            })
            .error(function() {
                console.log("Error during http get request repository.");
            });
    };

    $scope.showData = function(data) {
        $scope.button_submit = '<button class="btn btn-primary" type="submit"> \
                                    RollBack \
                                </button>';

        $scope.title_small = data.jobsrepo.job.name;
        $scope.title_small_jenkins = "Jenkins"
        $scope.title_small_bbk = "Bitbucket"
        var btn_result = "badge-warning";
        var btn_status = "badge-warning";
        if (data.result != null && data.result.toLowerCase() == "success") {
            btn_result = "badge-success";
        }
        if (data.result != null && data.status.toLowerCase() == "done") {
            btn_status = "badge-primary";
        }
        $scope.html = {
            Environment: { title: "Environment", contain: data.environment },
            Service: { title: "Service", contain: data.branch.repository },
            Build_Number: { title: "Build Number", contain: data.build_number.toString() },
            Build_By: { title: "Build By", contain: data.build_by },
            Branch_Name: { title: "Branch Name", contain: data.branch.name },
            Revision: { title: "Revision", contain: data.commit },
            Description: { title: "Description", contain: data.description },
            Status: { 
                title: "Status", 
                contain: '<span class="badge ' + btn_status + '">' + data.status + '</span>' },
            Result: { 
                title: "Result", 
                contain: '<span class="badge ' + btn_result + '">' + data.result + '</span>' },
            Created_Date: { title: "Created Date", contain: data.created_date },
        };
        $scope.html_jenkins = {
            Group: { title: "Group Name", contain: data.jobsrepo.job.group.name },
            Job: { title: "Job Name", contain: data.jobsrepo.job.name },
            Build_Number: { title: "Build Number", contain: data.build_number.toString() },
            // Job_id: { title: "Job ID", contain:  },
        };
        $scope.html_bitbucket = {
            Project: { title: "Project", contain: data.jobsrepo.repository.project.name },
            Project_Key: { title: "Project Key", contain: data.jobsrepo.repository.project.key },
            Owner: { title: "Owner", contain: data.jobsrepo.repository.project.owner  },
            Repository: { title: "Repository", contain: data.jobsrepo.repository.slug },
            Description: { title: "Description", contain: data.jobsrepo.repository.project.description },
        }
    };

    $scope.init = function() {
        if ($stateParams.data != null){
            var data = $stateParams.data[0]
            $scope.data = data;
            $scope.showData(data);
        } else {
            $scope.getDefault();
        }
    };
    $scope.init();

    $scope.submitRollback = function () {
        // var confirm = $scope.sweetalert();
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this job!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Rollback!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (confirm) {
                if (confirm) {
                    
                    var projects = $scope.data.jobsrepo.repository.project;
                    var services = $scope.data.jobsrepo.repository;
                    var branches = $scope.data.branch;
                    var job = $scope.data.jobsrepo.job;
                    var commit = $scope.data.commit;
                    var build_type = 'rollback';
                    var description = build_type + ' ' + job.name + ' with commit ' + commit;
                    var environment = $scope.data.environment;
                    console.log(confirm);
                    if (services != null && services.hasOwnProperty('id') && branches.hasOwnProperty('name') && commit != null) {
                        $scope.rollback = function() {
                            $http.get(CONFIG.url_base + '/ci/v1/jenkins/build',{ 
                                params: {
                                    'group': job.group.name,
                                    'job': job.name,
                                    'branch': commit,
                                    'jobsrepo_id': $scope.data.jobsrepo.id,
                                    'branch_id': branches.id,
                                    'description': description,
                                    'environment': environment,
                                    'build_type': build_type,
                                }})
                                .success(function(result) {
                                    if (result.status == 200) {
                                        $state.go("deploy.deploytool");
                                    }
                                })
                                .error(function() {
                                    toaster.warning("Error during http get request rollback.");
                                });
                        };
                        $scope.rollback();
                        SweetAlert.swal("Rollback!", "Job has been rollback.", "success");
                    } else{
                        // toaster.warning({ title:"",body:"Unknown Error"});
                        SweetAlert.swal("Error!", "Job can not rollback.", "error");
                    }
                    
                } else {
                    SweetAlert.swal("Cancelled", "Rollback is cancelled", "error");
                    // toaster.warning({ title:"",body:"Cancel Rollback"});
                }
            });
        // }
    };

    $scope.viewLog = function() {
        $state.go("deploy.logs", { data: $scope.data });
    };
}
