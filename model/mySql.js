/*引入数据库模块*/
var mysql = require('mysql');
/*数据库地址，即主机地址*/
/*var mysqlUrl = require('./mySqlUrl.js');*/

/*创建连接数据库模块*/
var connection = mysql.createConnection({
	  	host:'bdm250384577.my3w.com',/*主机地址*/
		user:'bdm250384577',/*用户名*/
		password:'tangwang104',/*密码*/
		port:'3306',/*端口号*/
		database:'bdm250384577_db',/*数据库名字*/
		insecureAuth: true
	});

/*连接数据库*/
	connection.connect();

/*连接数据库*/
exports._connectMysql = function(){

	connection.query('SELECT 1 + 1 AS solution',function(error,result,fields){
		if(error) {
			console.log("连接错误");
			return
		};
		console.log('The solution is :' + result[0].solution);
	})
	connection.end
}
/*数据库的查询*/
exports._findMysql = function(){
	
	var sql = "SELECT "+"id = 1"+" FROM simpleTable";/*查询数据库的语句，查询数据中的所有数据,from 后面是表名*/
	
	connection.query(sql,function(err,result){
		if(err){
			console.log('查询数据库失败：' + err.message);
			return;
		}
		/*查询成功做的操作*/
		console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');  
        return result
	})
	connection.end
}

/*向数据插入数据*/
 exports._insertMysql = function(aid,caid,title,content,author,username,pic,summary){
 	
 	var addSql = "INSERT INTO content(aid,caid,title,content,author,username,pic,summary) VALUES(?,?,?,?,?,?,?,?)"
 	var addSqlParams = [aid,caid,title,content,author,username,pic,summary];
 	connection.query(addSql,addSqlParams,function(err,result){
 		if(err){
 			console.log('[INSERT ERROR] - ',err.message);
         	return;
 		}
 		console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');
 	})
 	connection.end
 }
/*删除*/
exports._deletMysql = function(){
	var delSql = "DELETE FROM simpleTable where id=3"
	
	connection.query(delSql,function(err,result){
		if(err){
 			console.log('[UPDATE ERROR] - ',err.message);
         	return;
 		}
 		console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('UPDATE affectedRows:',result.affectedRows);        
       console.log('-----------------------------------------------------------------\n\n');
	})
	connection.end
}

/*修改数据*/
exports._upDataMysql = function(){
	
	var upDate = "UPDATE simpleTable SET name=?,password=? WHERE id=?"
	var modSqlParams = ['zhangsan1', '1234567',3];
	connection.query(upDate,modSqlParams,function(err,result){
		if(err){
 			console.log('[UPDATE ERROR] - ',err.message);
         	return;
 		}
 		console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('UPDATE affectedRows:',result.affectedRows);        
       console.log('-----------------------------------------------------------------\n\n');
 	})
	connection.end
}
