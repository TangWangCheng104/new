/**
 * Created by Administrator on 2017/8/31 0031.
 */
var express = require('express');
var multiparty = require('multiparty');
var dbmethod =require("../../model/db");
var router = express.Router();
const fs =require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
    dbmethod.find("artice",{},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.render('admin/artice/index', {
            list: result,
        });
    })
});

router.get('/edit', function(req, res, next) {
    var id =req.query.id;
    dbmethod.find("artice",{"_id":new dbmethod.ObjectID(id)},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.render('admin/artice/edit',{

            list:result[0]
        });
    })
});

router.post("/doedit",(req,res)=>{

    var formEdit = new multiparty.Form();

    formEdit.uploadDir='./public/pic';  /*上传的目录*/
    formEdit.parse(req, function(err, fields, files) {

        var id =fields.id[0];
        var title =fields.title[0];
        var author =fields.author[0];
        var content =fields.content[0];
        var addtime =fields.addtime[0];
        var status =fields.status[0];
        var description =fields.description[0];
        var pic =files.pic[0].path;
        var originalFilename=files.pic[0].originalFilename;
        var img=files.pic[0].path;

        console.log(files)
        if(originalFilename){
            var setData={
                title,
                author,
                content,
                addtime,
                status,
                description,
                pic
            };

        }else{
            var setData={
                title,
                author,
                content,
                addtime,
                status,
                description
            }

        }

        dbmethod.updateOne("artice",{"_id": new dbmethod.ObjectID(id)},{$set: setData
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
            res.redirect('/admin/artice')
        })
    })
})

router.get('/add', function(req, res, next) {
    res.render("admin/artice/add")
});

router.post("/doAdd",(req,res)=>{

    var form = new multiparty.Form();

   form.uploadDir='./public/pic';  /*上传的目录*/
    form.parse(req, function(err, fields, files) {

       fields.pic =files.pic[0].path;
        dbmethod.insertOne("artice",fields,function(err,result){
            if(err){
                console.log(err);
                return;
            }
            res.redirect("/admin/artice")
        })
    });
})

router.get("/delete",(req,res)=>{
    var id =req.query.id;
    dbmethod.find("artice",{"_id":new dbmethod.ObjectID(id)},function(err,result){
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
        dbmethod.deleteMany("artice",{"_id": new dbmethod.ObjectID(id)}, (err,results) =>{
            if(err){
                console.log(err);
                return;
            }
            res.redirect("/admin/artice")
        })
    })
})

module.exports = router;
