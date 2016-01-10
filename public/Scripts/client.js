   var app = angular.module('myApp', ['btford.socket-io'])
    .factory('socketio', ['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}])
    .controller('ArduController', ['$scope', 'socketio', function ($scope,socketio) {
    
            var lights;
    
            $scope.lights = lights;
    
            $scope.lightstatusOn = function(light){
              light.status = "on";
              socketio.emit('led:on', light.name);
              socketio.emit("lights.update", $scope.lights); 
                //console.log(lights);
            };
    
            $scope.lightstatusOff = function(light){
              light.status = "off";
              socketio.emit('led:off', light.name);
              socketio.emit("lights.update", $scope.lights);
            };
    
            socketio.on('potentiometer', function(data){
                $scope.value = data.value;
            });

            socketio.on('light', function(data){
              $scope.lights = data;
                //console.log(data);
            })

            socketio.on('led:on', function(data){
                $scope.lights[data.value] = {                  
                  status: "on"
                };
                //console.log(data.value);

            });

            socketio.on('led:off', function(data){
                $scope.lights[data.value] = {
                  status: "off"
                };
            });
       
    }]);
 