'use strict';

angular.module('inspinia')
    .controller('StatusCtrl', ['$scope', 'CONFIG', '$http', '$interval', '$rootScope', StatusCtrl]);

function StatusCtrl($scope, CONFIG, $http, $interval, $rootScope){
    $scope.data = [];
    $scope.infocm = {
        name: "Service Content Manager",
        status: "None",
        icon: "fa-rotate-90",
    };
    $scope.services = {
        CM : {
            "services-content-manager":"https://services-content-manager.dzones.vn/v1_0_1/system_monitors/heartbeat",},
        Search : {
            "services-searching":"https://services-searching.dzones.vn/v1_0_1/system_monitors/heartbeat",},
        LiveFeed: {
            "services-live-feed":"https://services-live-feed.dzones.vn/v1_0_1/system_monitors/heartbeat",
        },
        Admin: {
            "services-admin":"https://services-admin.dzones.vn/v1_0_1/system_monitors/heartbeat",
        },
        IDENTITY: {
            "services-identity":"https://services-identity.dzones.vn/v1_0_1/system_monitors/heartbeat",
        },
        FILEMANAGER: {
            "services-file-manager":"https://services-file-manager.dzones.vn/v1_0_1/system_monitors/heartbeat",
        },
        PUSHING: {
            "services-pushing":"https://services-pushing.dzones.vn/v1_0_1/system_monitors/heartbeat",
        },
        METADATA: {
            "services-metadata":"https://services-metadata.dzones.vn/v1_0_1/system_monitors/heartbeat",
        },
        
    };
    $scope.getcm = function(){
        $http({
            method: 'POST',
            url: 'https://staging-services-content-manager.dzones.vn/v1_0_1/system_monitors/heartbeat',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        })
        .success(function (result) {
            if (result.success == true){
                $scope.infocm.status = "Up";
                $scope.infocm.icon = "fa-rotate-270";
            } else {
                $scope.infocm.status = "Down";
                $scope.infocm.icon = "fa-rotate-90";
            }
            console.log(result)
        })
        .error(function (result){
            console.log(result)
            console.log("Error during http post request.");
        });
    };
    $scope.getcm();
    $scope.stop = $interval($scope.getcm, 5000);
    $scope.$on('$destroy', function(){
        $interval.cancel($scope.stop);
        
    });
}

