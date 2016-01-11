var mysql = require('mysql');
var sas = require('sas');
var js2sql = require('js2sql');

function Db(conf) {
 this.pool = mysql.createPool(conf.mysql);
}
//this.pool.connect();
// 无条件查询 
//@param {String} Connection 表名
//@param {Object} keyObj 键数据

Db.prototype.get = function(Connection, keyObj, callback){
  var sql = js2sql.obj_to_select_sql(Connection, keyObj);
  this.pool.query(sql, callback);
}

// 更新  只适合有一个主键的表
//@param {String} Connection 表名
//@param {Object} data 数据
//@param {primary_key} 数据库主键
Db.prototype.update = function(Connection, data, primary_key, callback){
    var sql = js2sql.obj_to_update_sql(Connection, data, primary_key);
    //console.log('update sql', sql);
    this.pool.query(sql, callback);
}

// 将数据插入到表中 
//@param {String} Connection 表名
//@param {Object} data 数据 
Db.prototype.insert = function(Connection, data, callback){
    var sql = js2sql.obj_to_insert_sql(Connection, data);
    //console.log('insert sql\n', sql)
    this.pool.query(sql, callback);
}

// 根据主键查询 返回单行数据
//@param {String} Connection 表名
//@param {Object||string} keyObj 键名数据 为字符串时(主键值)，查询所有
//@param {primary_key} 数据库主键
Db.prototype.getByPrimary = function(Connection, keyObj, primary_key, callback){
  if(typeof primary_key === 'string'){
    var sql = js2sql.obj_to_select_sql(Connection, keyObj, primary_key);
  }else{
    var sql = js2sql.obj_to_select_sql_by_index(Connection, keyObj, primary_key);
  }
  //console.log('getByPrimary sql', sql);
  this.pool.query(sql, function(err, rows) {
    if (err) {
      callback(err);
    }else{
      callback(null, rows[0]);
    }
  });
}



// 插入获者更新 适用于插入比较多的场景 只适合有一个主键的表
//@param {String} Connection 表名
//@param {Object} 数据
//@param {primary_key} 数据库主键
Db.prototype.InsertOrUpdate = function(Connection, data, primary_key, callback) {
  function insert_task(cb) {
    var sql = js2sql.obj_to_insert_sql(Connection, data);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        if (err.errno === 1062) { //主键重复
          cb('$RELOAD', update_task);
        } else {
          cb('$STOP', err);
        }
      } else {
        cb(resp);
      }
    });
  }

  function update_task(cb) {
    var sql = js2sql.obj_to_update_sql(Connection, data, primary_key);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        cb('$STOP', err);
      } else {
        cb(resp);
      }
    });
  }

  sas(insert_task, callback);
}

// 更新获者插入 适用于更新比较多的场景 只适合有一个主键的表
//@param {String} Connection 表名
//@param {Object} 数据
//@param {primary_key} 数据库主键
Db.prototype.updateOrInsert = function(Connection, data, primary_key, callback) {

  function update_task(cb) {
    var sql = js2sql.obj_to_update_sql(Connection, data, primary_key);
    //console.log('update SQL ', sql);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        cb('$STOP', err);
      } else {
        if (resp.affectedRows === 0) {
          cb('$RELOAD', insert_task);
        }else{
          cb(resp);
        }
      }
    });
  }

  function insert_task(cb) {
    var sql = js2sql.obj_to_insert_sql(Connection, data);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        cb('$STOP', err);
      } else {
        cb(resp);
      }
    });
  }

  sas(update_task, callback);

}

Db.prototype.delInsert = function(Connection, data, primary_key, callback){

  function del_task(cb) {
    var sql = 'DELETE FROM ' + Connection + ' WHERE ' + primary_key  + '= "' + data[primary_key] + '"';
    //console.log('DELETE SQL ', sql);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        cb('$STOP', err);
      } else {
        if (resp.affectedRows === 0) {
          cb('$RELOAD', insert_task);
        }else{
          cb(resp);
        }
      }
    });
  }

  function insert_task(cb) {
    var sql = js2sql.obj_to_insert_sql(Connection, data);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        cb('$STOP', err);
      } else {
        cb(resp);
      }
    });
  }

  sas(del_task, callback);

}

// 更新获者插入 适用于更新比较多的场景 只适合有一个主键的表
//@param {String} Connection 表名
//@param {def_Data} 不存在的话,创建的数据
//@param {primary_key} 数据库主键


Db.prototype.getOrCreate = function(Connection, def_Data, primary_key, callback) {

  function get_task(cb) {
    var sql = js2sql.obj_to_select_sql(Connection, def_Data, primary_key);
    this.pool.query(sql, function(err, rows, fields) {
      if (err) {
        cb('$STOP', err);
      } else {
        if (rows.length === 0) {
          cb('$RELOAD', insert_task);
        } else {
          cb(rows[0]);
        }
      }
    });
  }

  function insert_task(cb) {
    var result = def_Data;
    if (typeof def_Data === 'string') {
      result = {};
      result[primary_key] = def_Data;
    }
    var sql = js2sql.obj_to_insert_sql(Connection, result);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        cb('$STOP', err);
      } else {
        cb(result);
      }
    });
  }
  sas(get_task, callback);
}

Db.prototype.getOrInsertGet = function(Connection, def_Data, primary_key, callback) {

  function get_task(cb) {
    var sql = js2sql.obj_to_select_sql(Connection, def_Data, primary_key);
    this.pool.query(sql, function(err, rows, fields) {
      if (err) {
        cb('$STOP', err);
      } else {
        if (rows.length === 0) {
          cb('$RELOAD', insert_task);
        } else {
          cb(rows[0]);
        }
      }
    });
  }

  function insert_task(cb) {
    var result = def_Data;
    if (typeof def_Data === 'string') {
      result = {};
      result[primary_key] = def_Data;
    }
    var sql = js2sql.obj_to_insert_sql(Connection, result);
    this.pool.query(sql, function(err, resp) {
      if (err) {
        cb('$STOP', err);
      } else {
        cb('$RELOAD', get_task);
      }
    });
  }
  sas(get_task, callback);
}


Db.prototype.insertInto = function(Connection, list, callback){

    var sql = js2sql.obj_to_insert_into_sql(Connection, list);
    //console.log('insert_into sql\n', sql);
    this.pool.query(sql, callback);
};


Db.prototype.errHandle = function(callback , key) {
  return function(err, data) {
    if (err) {
      err.name = 'dbErr ' + err.name;
      return callback(err);
    }
    callback(null, data);
  }
}





module.exports = db;