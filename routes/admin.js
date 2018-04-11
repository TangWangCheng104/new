var express = require('express');
var router = express.Router();

var session = require("express-session");
var multiparty = require('multiparty');
var dbmethod =require("../model/db");
// console.log(dbmethod);

var user = require('./admin/user');
var focus = require('./admin/focus');
var login = require('./admin/login');
var advice = require('./admin/advice');
var artice = require('./admin/artice');
/* GET users listing. */

router.use('/login', login);

//权限判断
router.use(function (req,res,next) {
    // console.log(req.url);
    if(req.url=="/login" ||req.url=="/doLogin" ){ /*不做权限判断*/
        next();
    }else{  /*其他页面做权限判断*/
        if(session.userinfo){  /*登录*/
            router.use('/user', user);

            router.use('/focus', focus);

            router.use('/advice', advice);

            router.use('/artice', artice);
            next();
        }else{  /*没有登录*/
            res.redirect('/admin/login');
        }

    }
})

router.get('/', function(req, res, next) {
    dbmethod.find('admin',{},function (err,data) {
        //console.log(data);
        res.render('admin/index',{list:data});
    })
});
//
router.get('/add', function(req, res, next) {
    res.render('admin/add');
});
//
router.post('/doAdd',function (req,res) {

    var form = new multiparty.Form();
    form.uploadDir='public/pic';  /*上传的目录*/
    form.parse(req, function(err, fields, files) {
        /*console.log(fields);
        console.log(files);*/
        //
        var title=fields.title[0];
        var price=fields.price[0];
        var fee=fields.fee[0];
        var description=fields.description[0];
        var img=files.pic[0].path;
        //
        dbmethod.insertOne('admin',{
                title,
                price,
                fee,
                description,
                img
            },function (error,data) {
                if(error){
                    console.log(error);
                    return;
                }
                res.redirect('/admin');//跳转首页
            })

    });

})
//
router.get('/delete',function (req,res) {
    var id = req.query.id;
    dbmethod.deleteMany('admin',{ _id :new dbmethod.ObjectID(id)},function () {
        res.redirect('/admin');//跳转首页
    })

})
//
router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    dbmethod.find('admin',{ _id :new dbmethod.ObjectID(id)},function (err,data) {
        //console.log(11);
        //console.log(data[0]);
        res.render('admin/edit',{list:data[0]});
    })
});
//
router.post('/doEdit',function (req,res) {

        //接收form表单提交的数据
        var form = new multiparty.Form();
        form.uploadDir='public/pic';  /*上传的目录*/
        form.parse(req,function (err,fields,files) {
           // console.log(fields);
            //console.log(files);
            var _id=fields.id[0];
            var title=fields.title[0];
            var price=fields.price[0];
            var fee=fields.fee[0];
            var description=fields.description[0];
            var img=files.pic[0].path;

            var originalFilename=files.pic[0].originalFilename;
            if(originalFilename){ /*更新了图片*/
                var setData={/*需改图片的时候更新的数据*/
                    title,
                    price,
                    fee,
                    description,
                    img
                }
            }else{
                var setData={/*没有需改图片的时候更新的数据*/
                    title,
                    price,
                    fee,
                    description
                }
            }
            //
            dbmethod.updateOne( 'admin',{'_id':new dbmethod.ObjectID(_id)},
            {$set:setData},function (error) {

                if(error){
                    console.log('修改失败');
                    return;
                }
                    res.redirect('/admin');//跳转首页
            });
        })

})
//用户注册页面
router.get('/exit',function(req,res,next){
    session.userinfo='';
    res.render('admin/login');

})

//用户登录页面
/*router.get('/login',function(req,res){
    res.render('admin/login');
})*/
//
router.post('/doLogin',function (req,res) {
    //获取提交的数据
    var form = new multiparty.Form();
    form.uploadDir='public/pic';  /*上传的目录*/
    form.parse(req, function(err, fields, files){
        var username=fields.username[0];
        var password=fields.password[0];
        //数据库查询 用户名密码对不对
        dbmethod.find('admin',{"title":username,"price":password},function (err,data) {
            if(data.length>0){
                session.userinfo=data[0];
                res.redirect('/admin');//跳转首页
            }else{
                res.send('<script>alert("用户名或者密码错误");location.href="/admin/login"</script>')
            }
        })
    })

})



module.exports = router;
