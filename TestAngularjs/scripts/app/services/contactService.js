var app = angular.module("contactApp");

app.service('contactService', function ($http) {

    this.get = function (id) {
        return $http.get("/api/Contact/" + id);
    }

    this.getContacts = function (pagingInfo) {
        return $http.get("/api/Contact", { params: pagingInfo });
    }

    this.isEmailAvailable = function (id, email) {
        return $http.get("/api/Contact/EmailAvailable/?id=" + id + "&email=" + email);
    }

    this.create = function (contact) {
        var request = $http({
            method: "post",
            url: "/api/Contact",
            data: contact
        });
        return request;
    }

    this.update = function (id, contact) {
        var request = $http({
            method: "put",
            url: "/api/Contact/" + id,
            data: contact
        });
        return request;
    }

    this.deleteMultiples = function (ids) {
        var parameters = _.map(ids, function (i) { return "ids=" + i });

        var request = $http({
            method: "delete",
            url: "/api/Contact/?" + parameters.join("&"),

        });
        return request;
    }

});