var app = angular.module("contactApp");

app.service('dialogService', function ($uibModal, $timeout) {

    function open(options, callback) {
        var uibModalInstance = $uibModal.open(_.extend(options, {
            backdrop: 'static',
            controller: createController(options)
        }));

        function createController() {
            return ['$scope', '$uibModalInstance', '$timeout',
                function ($scope, $uibModalInstance, $timeout) {
                    $scope.header = options.header;
                    $scope.content = options.content;
                    $scope.buttonOK = options.buttonOK || 'OK';
                    $scope.buttonYes = options.buttonYes || 'Yes';
                    $scope.buttonNo = options.buttonNo || 'No';
                    $scope.buttonCancel = options.buttonCancel || 'Cancel'

                    $scope.result = {
                        yes: 1,
                        no: 0,
                        cancel: 2
                    };

                    $scope.close = function (result) {
                        $uibModalInstance.close(result);
                    };
                }
            ]
        };

        uibModalInstance.result.then(function (result) {
            if (callback) {
                callback(result);
            }
        }, function () {
            
        });
    };

    this.confirmDialog = function (options, callback) {
        options = _.extend(options || {}, {
            windowClass: 'default-modal',
            templateUrl: window.baseUrl + 'scripts/app/dialogs/confirm.html'
        });
        open(options, callback);
    };

    this.openDialog = function (options, callback) {
        var uibModalInstance = $uibModal.open(_.extend(options, {
            backdrop: 'static',
            controller: options.controller
        }));

        uibModalInstance.result.then(function (result) {
            if (callback) {
                callback(result);
            }
        });

    };
});