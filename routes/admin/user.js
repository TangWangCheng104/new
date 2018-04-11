var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var dbmethod =require("../../model/db");
const fs =require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  dbmethod.find("user",{},function(err,result){
    if(err){
      console.log(err);
      return;
    }
    res.render('admin/user/index', {
      list: result,
    });
  })
});

router.get('/edit', function(req, res, next) {
  var id =req.query.id;
  dbmethod.find("user",{"_id":new dbmethod.ObjectID(id)},function(err,result){
    if(err){
      console.log(err);
      return;
    }
    res.render('admin/user/edit',{

      list:result[0]
    });
  })
});

router.post("/doedit",(req,res)=>{

  var formEdit = new multiparty.Form();

  formEdit.uploadDir='./public/pic';  /*上传的目录*/
  formEdit.parse(req, function(err, fields, files) {

    var id =fields.id[0];
    var username =fields.username[0];
    var password =fields.password[0];
    var tel =fields.tel[0];
    var addtime =fields.addtime[0];
    var status =fields.status[0];
    var sex =fields.sex[0];
    var description =fields.description[0];
    var pic =files.pic[0].path;
    var originalFilename=files.pic[0].originalFilename;
    var img=files.pic[0].path;

    if(originalFilename){

      var setData={
        username,
        password,
        tel,
        addtime,
        status,
        sex,
        description,
        pic
      };

    }else{
      var setData={
        username,
        password,
        tel,
        addtime,
        status,
        sex,
        description,
      }

    }
    dbmethod.updateOne("user",{"_id": new dbmethod.ObjectID(id)},{$set: setData
    }, function(err,result){
      if(err){
        console.log(err);
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
      res.redirect('/admin/user')
    })
  })
})

router.get('/add', function(req, res, next) {
  res.render("admin/user/add")
});

router.post("/doAdd",(req,res)=>{

  var form = new multiparty.Form();

  form.uploadDir='./public/pic';  /*上传的目录*/
  form.parse(req, function(err, fields, files) {

    fields.pic =files.pic[0].path;
    dbmethod.insertOne("user",fields,function(err,result){
      if(err){
        console.log(err);
        return;
      }
      res.redirect("/admin/user")
    })
  });
})

router.get("/delete",(req,res)=>{
  var id =req.query.id;
  dbmethod.find("user",{"_id":new dbmethod.ObjectID(id)},function(err,result){
    if(err){
      console.log(err);
      return;
    }
    if(result[0].pic){
    fs.unlink(result[0].pic, (error) => {
      if (error) {
        console.log(error)
      } else {

        console.log("删除成功")
      }
    })

    }
    else {
      dbmethod.deleteMany("user",{"_id": new dbmethod.ObjectID(id)}, (err,results) =>{
        if(err){
          console.log(err);
          return;
        }
        res.redirect("/admin/user")
      })
    }
  })

})

module.exports = router;
