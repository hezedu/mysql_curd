var conf = {  //mysql 数据库
    host: '115.28.231.125',
    port:3306,
    //connectTimeout:1000*60*60*24,
    user: 'rootc',
    password: 'JNxSBXNx45ge7x25',
    database: 'zorro_bak'
  };


var mysql_pool_curd = require('../index');

var db = mysql_pool_curd(conf);


/*db.get('com_users', '*',function(err, rows){
  if(err){
    console.log('get err');
  }else{
    console.log('db.get成功');
  }
  
});

db.update('com_users', {id:1,type:13}, 'id', function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.update成功');
  }
  
});*/


/*db.insert('com_users', {type:15}, function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.insert成功');
  }
  
});*/


/*db.getByPrimary('com_users', '1', 'id',  function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.getByPrimary成功');
    console.log(rows);
  }
  
});*/

/*db.InsertOrUpdate('test', {id:3, name:'test'+Date.now()}, 'id',  function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.InsertOrUpdate成功');
    console.log(rows);
  }
  
});

db.updateOrInsert('test', {id:3, name:'test'+Date.now()}, 'id',  function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.updateOrInsert成功');
    console.log(rows);
  }
  
});
*/

/*db.delInsert('test', {id:3, name:'test'+Date.now()}, 'id',  function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.delInsert成功');
    console.log(rows);
  }
  
});*/

/*db.getOrCreate('test', {id:4, name:'test'+Date.now()}, 'id',  function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.getOrCreate成功');
    console.log(rows);
  }
  
});

db.getOrInsertGet('test', {id:5, name:'test'+Date.now()}, 'id',  function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.getOrInsertGet成功');
    console.log(rows);
  }
  
});
*/

/*db.insertInto('test', [{name:'test'+Date.now()}, {name:'test'+Date.now()},{name:'test'+Date.now()}] , function(err, rows){
  if(err){
    console.log('err',err);
  }else{
    console.log('db.getOrInsertGet成功');
    console.log(rows);
  }
  
});*/