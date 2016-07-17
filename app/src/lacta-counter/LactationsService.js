(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('lacta-counter')
         .service('Lactations', LactationsService)
         .service('LactationDB', LactationDB);

  LactationsService.$inject = ['$q', '$webSql', 'LactationDB'];
  function LactationsService($q, $webSql, LactationDB) {
    // var lactations = LactationDB.getAllLactations();

    return {
      getAllLactations: function(){
        return LactationDB.getAllLactations().then(function (rows) {
          return $q.when(Array.prototype.map.call(rows, function (row) {
            return row;
          }));
        });
      },
      addLactation: function (timeStamp, breast) {
        return LactationDB.addLactation({timeStamp: timeStamp, breast: breast});
      },
      removeLactation: function (id){
        return LactationDB.removeLactation({timeStamp: id});
      }
    };

  }

  LactationDB.$inject = ['$window', '$log', '$q'];
  function LactationDB($window, $log, $q){
    return {
      openDb: function () {
        var def = $q.defer();
        try {
          var db = openDatabase('Lactations', '', 'A list of lactations.', 5*1024*1024);

          if(db === null){
            def.reject(new Error('Не удалось подключиться к базе данных.'));
          }else if(db.version === ''){
            db.changeVersion('', '0.1',
              function (tx) {
                $log.info('Инициализация БД версии 0.1.')
                $log.info('Создание таблицы Lactations.')
                tx.executeSql("CREATE TABLE Lactations (timeStamp REAL UNIQUE NOT NULL, breast TEXT)", []);
              },
              def.reject.bind(def),
              def.resolve.bind(def, db)
            );
          }else{
            def.resolve(db);
          }

        } catch (e) {
          def.reject(e);
        };

        return def.promise;
      },
      getAllLactations: function(){

        return this.openDb().then(
          function (db) {
            var def = $q.defer();

            db.readTransaction(function(tx) {
              tx.executeSql("SELECT * FROM Lactations", [],
                function (tx, data) {
                  def.resolve(data.rows)
                },
                function (tx, err) {
                  def.reject(err);
                }
              );
            });

            return def.promise;
          }
        )
      },
      addLactation: function(lactationFields){
        if(!angular.isObject(lactationFields)){
          throw new TypeError('Параметр lactationFields должен быть объектом.');
        };

        return this.openDb().then(
          function (db) {
            var def = $q.defer();

            db.transaction(function(tx) {
              tx.executeSql("insert into lactations (timestamp, breast) values (?, ?)", [lactationFields.timeStamp, lactationFields.breast],
                function (tx, data) {
                  def.resolve(data.rowsAffected)
                },
                function (tx, err) {
                  def.reject(err);
                }
              );
            });

            return def.promise;
          }
        )
      },
      removeLactation: function(whereObj){
        if(!angular.isObject(whereObj)){
          throw new TypeError('Параметр whereObj должен быть объектом.');
        };

        return this.openDb().then(
          function (db) {
            var def = $q.defer();

            db.transaction(function(tx) {
              tx.executeSql("delete from lactations where timeStamp = ?", [whereObj.timeStamp],
                function (tx, data) {
                  def.resolve(data.rowsAffected)
                },
                function (tx, err) {
                  def.reject(err);
                }
              );
            });

            return def.promise;
          }
        )
      }
    }
  }

})();
