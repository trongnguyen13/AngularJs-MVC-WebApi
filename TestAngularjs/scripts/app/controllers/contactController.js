var app = angular.module("contactApp");

app.controller("contactController", ['$scope', '$http', 'contactService', 'dialogService', function ($scope, $http, contactService, dialogService) {

    $scope.title = "Manage Contacts";
    $scope.contacts = [];
    $scope.selectedAll = false;
    $scope.selectedAny = false;
    $scope.filterText = "";

    $scope.pagingInfo = {
        page: 1,
        itemsPerPage: 10,
        sortBy: 'Name',
        search: '',
        reverse: false,
        totalItems: 0
    };

    init();

    $scope.searchContact = function () {
        $scope.pagingInfo.page = 1;
        getContacts();
    };

    $scope.sort = function (sortBy) {
        if (sortBy === $scope.pagingInfo.sortBy) {
            $scope.pagingInfo.reverse = !$scope.pagingInfo.reverse;
        } else {
            $scope.pagingInfo.sortBy = sortBy;
            $scope.pagingInfo.reverse = false;
        }
        $scope.pagingInfo.page = 1;
        getContacts();
    };

    $scope.pageChanged = function () {
        getContacts();
    }

    $scope.getSortIcon = function (column) {
        var sortColumn = $scope.pagingInfo.sortBy;

        if (sortColumn == column) {
            return $scope.pagingInfo.reverse
              ? 'glyphicon-chevron-up'
              : 'glyphicon-chevron-down';
        }

        return '';
    }

    $scope.createContact = function () {
        dialogService.openDialog({
            windowClass: 'contact-modal',
            templateUrl: window.baseUrl + 'scripts/app/dialogs/contactDetailsView.html',
            controller: 'contactDetailsView',
            resolve: {
                contact: function () {
                    return null;
                },
                mode: function () {
                    return "Add";
                }
            }
        }, function (result) {
            if (!!result) {
                getContacts();
            }
        });
    }

    $scope.editContact = function (id) {
        var selectedContact = _.find($scope.contacts, function (c) { return c.id == id });
        dialogService.openDialog({
            windowClass: 'contact-modal',
            templateUrl: window.baseUrl + 'scripts/app/dialogs/contactDetailsView.html',
            controller: 'contactDetailsView',
            resolve: {
                contact: function () {
                    return selectedContact;
                },
                mode: function () {
                    return "Edit";
                }
            }
        }, function (result) {
            if (!!result) {
                getContacts();
            }
        });
    }

    $scope.deleteContact = function () {
        var selectedContacts = _.filter($scope.contacts, function (item) { return item.selected; });
        if (!!selectedContacts.length) {
            dialogService.confirmDialog({
                header: 'Delete',
                content: 'Are you sure you want to delete these items?'
            }, function (result) {
                if (!!result) {
                    var ids = _.pluck(selectedContacts, 'id');

                    contactService.deleteMultiples(ids).then(function (result) {
                        if (!!result) {
                            getContacts();
                        }
                    });
                }
            });
        }
    }

    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }

        _.each($scope.contacts, function (item) { item.selected = $scope.selectedAll });
    }


    $scope.$watch("contacts", function () {
        if (!!$scope.contacts.length) {
            $scope.selectedAny = _.some($scope.contacts, function (item) { return item.selected == true; });
            $scope.selectedAll = _.every($scope.contacts, function (item) { return item.selected == true; });
        }
    }, true);

    function init() {
        getContacts();
    }

    function getContacts() {
        $scope.selectedAll = false;
        contactService.getContacts($scope.pagingInfo).then(function (result) {
            $scope.pagingInfo.totalItems = result.data.TotalItems;
            $scope.contacts = _.map(result.data.Contacts, function (item) { return { id: item.Id, name: item.Name, email: item.Email, address: item.Address, phone: item.Phone, createdDate: item.CreatedDate, modifiedDate: item.ModifiedDate, selected: false }; });
        });
    }
}]);