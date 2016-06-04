var app = angular.module("contactApp");
app.controller("contactDetailsView", ['$scope', '$http', 'contactService', '$uibModalInstance', 'contact', 'mode', function ($scope, $http, contactService, $uibModalInstance, contact, mode) {

    $scope.title = "Contact Details";
    $scope.contact = {
        id: 0,
        name: "",
        email: "",
        address: "",
        phone: ""
    };
    $scope.mode = mode;
    $scope.modelStatesErrors = [];

    init();

    $scope.onSave = function () {
        if ($scope.contactForm.$valid) {
            if (!!$scope.contact.id) {
                contactService.isEmailAvailable($scope.contact.id, $scope.contact.email).then(function (result) {
                    if (!!result.data) {
                        editContact();
                    } else {
                        $scope.modelStatesErrors.push("Email is existed. Please use another one.");
                    }
                });
                
            } else {
                contactService.isEmailAvailable(0, $scope.contact.email).then(function (result) {
                    if (!!result.data) {
                        createContact();
                    } else {
                        $scope.modelStatesErrors.push("Email is existed. Please use another one.");
                    }
                });
            }
        }
    }

    $scope.onCancel = function () {
        $uibModalInstance.close();
    }

    function init() {
        if ($scope.mode == 'Add') {
            $scope.title = "Add New Contact";
        } else if ($scope.mode == "Edit") {
            $scope.title = "Edit Contact";
        }

        if (!!contact) {
            $scope.contact.id = contact.id;
            $scope.contact.name = contact.name;
            $scope.contact.email = contact.email;
            $scope.contact.address = contact.address;
            $scope.contact.phone = contact.phone;
        }
    }

    function createContact() {
        contactService.create($scope.contact).then(function (result) {
            if (result.status == 200) {
                $uibModalInstance.close(true);
            }
        }, function (err) {
            $scope.modelStatesErrors = _.flatten(_.values(err.data.ModelState));
        });
    }

    function editContact() {
        contactService.update($scope.contact.id, $scope.contact).then(function (result) {
            if (result.status == 200) {
                $uibModalInstance.close(true);
            }
        }, function (err) {
            $scope.modelStatesErrors = _.flatten(_.values(err.data.ModelState));
        });
    }

}]);