(function() {
  'use strict';
  var truncateTextApp = angular.module("truncateTextApp", []);

  truncateTextApp.factory("truncationService", TruncationService);
  TruncationService.$inject = ["$compile"];
  function TruncationService($compile) {
    return {
      truncationApplies: function($scope, limtchars) {
        return $scope.text.length > limtchars;
      },
      applyTruncation: function(limtchars, $scope, $element) {
        var more_label = "More";
        var less_label = "Less";
        if($scope.useToggling) {
            var el = angular.element("<span>" + $scope.text.substr(0, limtchars) +"<span ng-show='!open'>...</span>" +
              "<span class='btn-link ngTruncateToggleText' " + "ng-click='toggleShow()'" + "ng-show='!open'>" + " " +
              more_label + "</span>" + "<span ng-show='open'>" + $scope.text.substring(limtchars) +
              "<span class='btn-link ngTruncateToggleText'" + "ng-click='toggleShow()'>" +
              " " + less_label + "</span></span></span>" );
            $compile(el)($scope);
            $element.append(el);
        } else {
          $element.text($scope.text.substr(0, limtchars) + "...");
        }
      }
    };
  };

  truncateTextApp.directive("truncateTextDir", TruncateTextDir);
  TruncateTextDir.$inject = ["truncationService"];
  function TruncateTextDir(truncationService) {
    var directive = {
      link: link,
      restrict: "A",
      scope: {
        text: "=truncateTextDir",
        charsLimit: "@charsLimit",
      },
      controller: ["$scope", "$attrs", function($scope, $attrs) {
        $scope.toggleShow = function() {
          $scope.open = !$scope.open;
        };
        $scope.useToggling = $attrs.noToggling === undefined;
      }]
    };
    return directive;

    function link($scope, $element, $attrs) {
      $scope.open = false;
      var CHARS_LIMIT = parseInt($scope.charsLimit);
      $scope.$watch("text", function() {
        $element.empty();
        if(CHARS_LIMIT) {
          if($scope.text && truncationService.truncationApplies($scope, CHARS_LIMIT)) {
            truncationService.applyTruncation(CHARS_LIMIT, $scope, $element);
          } else {
            $element.text($scope.text);
          }
        }
      });
    }
  };
}());
