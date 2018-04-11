/**
 * Created by Administrator on 2017/3/3 0003.
 */
var Mongo=require('mongodb');

var Config=require("./config.inc.js")

var MongoClient=Mongo.MongoClient;

var ObjectID=Mongo.ObjectID;

/*连接数据库*/
function _connectDB(callback){
    //MongoClient.connect(Config.DbUrl,function(err,db){
    //    if (err) {
    //        console.log('数据库连接失败...');
    //        callback(err, null);
    //        return;
    //    }
    //    callback(err, db);
    //})

    MongoClient.connect(Config.DbUrl,function(err,db){

        if (err) {
            console.log('数据库连接失败...');
            callback(err, null);
            return;
        }
        callback(err, db);
    })

}





//用于获取id
exports.ObjectID=ObjectID;

exports.count=function(collectionName,json,callback){


    _connectDB(function(err,db){
        db.collection(collectionName).count(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })

}

/*插入数据*/
exports.insertOne=function(collectionName,json,callback){


    _connectDB(function(err,db){
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })

}
/*更新数据*/


//修改一条
exports.updateOne = function (collectionName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateOne(
            json1,
            json2,
            function (err, results) {
                callback(err, results);
                db.close();//关闭数据库
            });
    })
}
//修改全部
exports.updateMany=function (collectionName, json1, json2, callback) {

    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(
            json1,
            json2,
            function (err, results) {
                callback(err, results);
                db.close();//关闭数据库
            });
    })


}

// 查找
exports.find=function (collectionName, json, C, D) {



    var result = [];    //结果数组
    if (arguments.length == 3) {
        //那么参数C就是callback，参数D没有传。
        var callback = C;
        var skipnumber = 0;
        //数目限制
        var limit = 0;
    } else if (arguments.length == 4) {
        var callback = D;
        var args = C;
        //应该省略的条数  1
        var skipnumber = args.pageSize * (args.page-1) || 0;
        //数目限制
        var limit = args.pageSize || 20;
        //排序方式
        var sort = args.sort || {};
    } else {
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }


    _connectDB(function(err,db){


            if(err){ /*数据库连接失败*/

                console.log('数据库连接失败');
                return;
            }


            //var userRel=db.collection(collectionName).find(json);
          var userRel=db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);;


            userRel.each(function(err, doc) {

                if(err){
                    res.write("游标遍历错误");
                    return;
                }
                if (doc != null) {
                    result.push(doc);
                } else {
                    //console.log(result);
                    //遍历完毕
                    db.close();
                    callback(err,result)
                }
            });

    })




}

//删除
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        //删除
        db.collection(collectionName).deleteMany(
            json,
            function (err, results) {
                callback(err, results);
                db.close(); //关闭数据库
            }
        );
    });
}
