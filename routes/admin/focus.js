var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var dbmethod =require("../../model/db.js");
const fs =require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {


  dbmethod.find("focus",{},function (err,data) {
    if(err){
      console.log("数据库连接错误");
      return;
    }
   // console.log(data);
    res.render('admin/focus',{list:data});
  })



});
//跳转到修改页面
router.get('/edit', function(req, res, next) {
  //查找数据
  var id = req.query.id;
  dbmethod.find("focus",{_id: new dbmethod.ObjectID(id)},function (err,data) {
    if(err){
      console.log("数据库连接错误");
      return;
    }
    // console.log(data);
    res.render('admin/focus/edit',{list:data});
  })


});
//修改数据
router.post('/doEdit',function (req,res,next) {

  var form = new multiparty.Form();
  form.uploadDir = 'public/pic';//上传的目录
  form.parse(req,function (err,fields,files) {

    var _id = fields.id[0];
    var title = fields.title[0];
    var pic = files.pic[0].path;
    var author = fields.author[0];
    var description = fields.description[0];
    var url = fields.url[0];
    var addtime = fields.addtime[0];
    var status = fields.status[0];
    var originalFilename=files.pic[0].originalFilename;
    var img=files.pic[0].path;
    if (originalFilename) {

      var dataSet = {
        title:title,
        pic:pic,
        author:author,
        description:description,
        url:url,
        addtime:addtime,
        status:status
      }
    }else {
      var dataSet = {
        title:title,
        author:author,
        description:description,
        url:url,
        addtime:addtime,
        status:status
      }
    }

    dbmethod.updateOne('focus', {"_id": new dbmethod.ObjectID(_id)},{$set:dataSet}, function (err) {
          if(err){
            console.log('更新数据失败');
            return;
          }
      if(!originalFilename){

        fs.unlink(img, (error) => {
          if (error) {
            console.log(error)
          } else {

            console.log("删除成功")
          }
        })
      }
          res.redirect("/admin/focus");
    })
  })
})


//跳转到增加页面
router.get('/add', function(req, res, next) {
  res.render('admin/focus/add');
});

//实行数据的增加
router.post('/doAdd',function (req,res,next) {

  var form = new multiparty.Form();
  form.uploadDir = 'public/pic';//上传的目录
  form.parse(req,function (err,fields,files) {
/*    console.log(fields);
    console.log(files.img[0].path);*/

    var title = fields.title[0];
    var pic = files.pic[0].path;
    var author = fields.author[0];
    var description = fields.description[0];
    var url = fields.url[0];
    var addtime = fields.addtime[0];
    var status = fields.status[0];



    var json1 = {
      title:title,
      pic:pic,
      author:author,
      description:description,
      url:url,
      addtime:addtime,
      status:status
    }

    dbmethod.insertOne("focus",json1,function (err,data) {
      if(err){
        console.log("插入数据失败");
        return;
      }
      else{
        res.redirect('/admin/focus');
      }
    })
  })
})



//删除数据
router.get('/delete',function(req,res,next){

  var id =req.query.id;
  dbmethod.find("focus",{"_id":new dbmethod.ObjectID(id)},function(err,result){
    if(err){
      console.log(err);
      return;
    }
    fs.unlink(result[0].pic, (error) => {
      if (error) {
        console.log(error)
      } else {

        console.log("删除成功")
      }
    })
    dbmethod.deleteMany("focus",{"_id": new dbmethod.ObjectID(id)}, (err,results) =>{
      if(err){
        console.log(err);
        return;
      }
      res.redirect("/admin/focus")
    })
  })

})
module.exports = router;
