(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('lacta-counter')
         .controller('LactationsCtrl', LactationsController);

  LactationsController.$inject = ['$scope', 'Lactations', '$log'];
  function LactationsController($scope, Lactations, $log) {
    var self = this;

    $scope.lactations = [];
    self.selected = null;

    Lactations.getAllLactations()
              .then(
                function (lactations) {
                  // debugger;
                  $scope.lactations = lactations;
                },
                function (err) {
                  $log.error(err.message);
                }
              );
    self.addNewLactation = function (dateTime, breast) {
      var ts = angular.isDate(dateTime)
               ? dateTime.getTime()
               : Date.now();
      Lactations.addLactation(ts, breast || null).then(
        function (rowsAffected) {
          if(rowsAffected > 0){
            $scope.lactations.push({timeStamp: ts, breast: breast});
          }
        },
        function (err) {
          log.error(err.message);
        }
      );
    };

    self.removeLactation = function (item) {
      var idx = angular.isNumber(item)
                ? item
                : $scope.lactations.indexOf(item);

      if(idx >= 0 && angular.isObject($scope.lactations[idx])){
        var id = $scope.lactations[idx].timeStamp;

        Lactations.removeLactation(id).then(
          function (rowsAffected) {
            if(rowsAffected > 0){
              $scope.lactations.splice(idx, 1);
            }
          },
          function(err){
            $log.error(err.message);
          }
        );
      }


    };
    self.removeSelected = function(){
      self.removeLactation(self.selected);
      self.setSelected(null);
    };
    self.setSelected = function (item) {
      if(self.selected === item){
        self.selected = null;
        return;
      };

      self.selected = item;
    }
  }


})();
