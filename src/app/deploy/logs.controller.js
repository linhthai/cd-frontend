'use strict';

angular.module('inspinia')
    .controller('LogsCtrl', ['$scope', '$stateParams', '$http', 'CONFIG', LogsCtrl])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });
    // .controller('toastrCtrl', ['$scope', 'toaster', toastrCtrl]);

function LogsCtrl($scope, $stateParams, $http, CONFIG) {
    $scope.data = $stateParams.data;
    $scope.logs = '';
    $scope.info_title = '';

    $scope.LogDefault = function() {
        $http.get(CONFIG.url_base + '/ci/v1/jobsbuild/getlogdefault')
            .success(function(result) {
                if (result.status == 200 && result.data != null) {
                    $scope.logs = result.data;
                }
            })
            .error(function() {
                console.log("Error during http get request.");
            });
    };

    $scope.LogsData = function(params) {
        $http.get(CONFIG.url_base + '/ci/v1/jobsbuild/getlogs',{
            params: params
        })
            .success(function(result) {
                if (result.status == 200 && result.data != null) {
                    $scope.logs = result.data;
                }
            })
            .error(function() {
                console.log("Error during http get request.");
            });
    };

    $scope.init = function() {
        if ($stateParams.data != null){
            var data = $stateParams.data;
            $scope.data = data;
            var group = data.jobsrepo.job.group.name;
            var job = data.jobsrepo.job.name;
            var build_number = data.build_number;
            if (group && job && build_number) {
                var params = {
                    'group': group,
                    'job': job,
                    'build_number': build_number,
                }
                $scope.info_title = job + ' build version ' + build_number
                $scope.LogsData(params);
            }
        } else {
            $scope.LogDefault();
        }
    }
    $scope.init();
}
