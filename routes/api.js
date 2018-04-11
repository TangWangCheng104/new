var express = require('express');
var router = express.Router();
var dbmethod =require("../model/mySql.js");

/* GET home page. */
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get('/userLogin1', function(req, res, next) {
	
	console.log(req.body)
});
router.post('/userLogin2', function(req, res, next) {
	console.log(req)
//	dbmethod._insertMysql(aid,caid,title,content,author,username,pic,summary)
});


router.post('/userLogin',function(req,res){


    //console.log(req.body);
    dbmethod.find('user',req.body,function(err,data){

        if(data.length<=0){

            res.json({'message':'登录失败','success':false})
        }else{

            res.json({'result':data[0].username,'success':true,'message':'登录成功'});
        }
    })

});


router.post('/userRegister',function(req,res){

    //console.log(req.body)
    dbmethod.find('user',req.body,function(err,data){

        if(data.length>0){
            res.json({'result':'注册失败，用户名存在','success':false})
        }
        else {
            dbmethod.insertOne("user",req.body,function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                res.json({'result':'注册成功','success':true})
            })
        }
    })


});

router.get('/focusjsonp',function(req,res){
	
    dbmethod.find("focus",{},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.jsonp({"result":result});
    })

});


router.get('/articejsonp',function(req,res){

    dbmethod.find("artice",{},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.jsonp({"result":result});
    })

});


router.post('/offerAdvice',function(req,res){


    //console.log(req.body);
    dbmethod.insertOne("advice",req.body,function(err,result){
        if(err){
            console.log(err);
            res.json({'message':'反馈失败','success':false})
            return;
        }
        res.json({'message':'反馈成功','success':true});
    })

});

router.get('/articejson',function(req,res){
	
    console.log(req.query)
    dbmethod.find("artice",{"_id":new dbmethod.ObjectID("59a93d8ffb164814d040d00a")},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.json({"result":result});
    })

});

module.exports = router;
