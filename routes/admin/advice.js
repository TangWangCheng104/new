/**
 * Created by Administrator on 2017/8/31 0031.
 */
var express = require('express');
var dbmethod =require("../../model/db");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    dbmethod.find("advice",{},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.render('admin/advice/index', {
            list: result,
        });
    })
});

router.get('/edit', function(req, res, next) {
    var id =req.query.id;
    dbmethod.find("advice",{"_id":new dbmethod.ObjectID(id)},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.render('admin/advice/edit',{

            list:result[0]
        });
    })
});

router.post("/doedit",(req,res)=>{

    var id =req.body.id;
        dbmethod.updateOne("advice",{"_id": new dbmethod.ObjectID(id)},{$set: req.body
        }, function(err,result){
            if(err){
                console.log(err);
                return;
            }

            res.redirect('/admin/advice')
        })

})

router.get('/add', function(req, res, next) {
    res.render("admin/advice/add")
});

router.post("/doAdd",(req,res)=>{

    dbmethod.insertOne("advice",req.body,function(err,result){
        if(err){
            console.log(err);
            return;
        }
        res.redirect("/admin/advice")
    })
})

router.get("/delete",(req,res)=>{
    var id =req.query.id;
    dbmethod.deleteMany("advice",{"_id": new dbmethod.ObjectID(id)}, (err,results) =>{
        if(err){
            console.log(err);
            return;
        }
        res.redirect("/admin/advice")
    })

})

module.exports = router;
