var app = angular.module("contactApp");

app.directive('timeAgo', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var date = attrs.timeAgo;

            var today = moment(date).isSame(moment(), 'day');
            if (!!today) {
                element.text(moment(date).fromNow());
            } else {
                var yesterday = moment().diff(moment(date), 'days');
                if (yesterday == 1) {
                    element.text("yesterday");
                }
                else {
                    element.text(moment(date).format('DD/MM/YYYY HH:mm:ss A'));
                }
            }
        }
    };
});
