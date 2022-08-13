const mysql= require('mysql')
const express=require('express')
const ejsMate=require('ejs-mate')
var app=express()
const bodyParser=require('body-parser');
const port=process.env.PORT || 5000
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
const pool=mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    port:3306,
    password:"",
    database:"mini",
    connectionLimit:10
})
app.get('/home',(req,res)=>{
    res.render('home')
})
app.get('/stu',(req,res)=>{
    res.render('stu')
})
app.post('/register', function(req, res, next) {
    var roll = req.body.rno;
    var name = req.body.name;
    var city = req.body.city;
    var dept  = req.body.dp;
    var phone=req.body.number;
    var mode = req.body.mode;
    var cgpa=req.body.cgpa;
    var back=req.body.bl;
    
    var total=req.body.tf;

   
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log('connected')

    var sql2 = `INSERT INTO fees (roll, mode,  total) VALUES ("${roll}", "${mode}",  "${total}" )`;
    var sql = `INSERT INTO student (roll, name, city, dept, phone) VALUES ("${roll}", "${name}", "${city}", "${dept}", "${phone}" )`;
    var sql3=`INSERT INTO academic (roll, cgpa,backlogs) VALUES ("${roll}", "${cgpa}", "${back}" )`
    connection.query(sql, function(err, result) {
      if (err) throw err;

    connection.query(sql2, function(err, result) {
        if (err) throw err;
    connection.query(sql3, function(err, result) {
            if (err) throw err;
      
      console.log('record inserted');
      res.render('stu');
    });
})
  });
})
})
app.get('/disp',(req,res)=>{
    res.render('disp')
})

app.post('/disp',(req,res)=>{
     var roll=req.body.rno
     console.log(req.params)
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log('connected')
        var sql=`SELECT * from student natural join fees where roll=${roll}`
        connection.query(sql,(err,rows)=>{
            connection.release()

            if(!err){
                
                res.render('display',{rows})
                
            } else{
                console.log(err)
            }
        })

    })
})
app.post('/disps',(req,res)=>{
    var roll=req.body.rno
    console.log(req.params)
   pool.getConnection((err,connection)=>{
       if(err) throw err
       console.log('connected')
       var sql=`SELECT * from student natural join fees `
       connection.query(sql,(err,rows)=>{
           connection.release()

           if(!err){
               
               res.render('display',{rows})
               
           } else{
               console.log(err)
           }
       })

   })
})

app.get('/dispfee',(req,res)=>{
    res.render('dispfee')
})


app.post('/dispfee',(req,res)=>{
    
    
   pool.getConnection((err,connection)=>{
       if(err) throw err
       var roll=req.body.rno
       console.log('connected')
       var sql=`SELECT * from fees where roll=${roll}`
       connection.query(sql,(err,rows)=>{
           connection.release()

           if(!err){
               
               res.render('feesdisplay',{rows})
               
           } 
           else{
               console.log(err)
           }
       })

   })
})
app.post('/place',(req,res)=>{
    
    
    pool.getConnection((err,connection)=>{
        if(err) throw err
        var roll=req.body.rno
        console.log('connected')
        var sql=`SELECT * from academic  natural join student`
        connection.query(sql,(err,rows)=>{
            connection.release()
 
            if(!err){
                
                res.render('aca',{rows})
                
            } 
            else{
                console.log(err)
            }
        })
 
    })
 })
app.get('/pay',(req,res)=>{
    res.render('pay')
})
app.post('/pay',(req,res)=>{
    var roll=req.body.rno
    var pay=req.body.pays
    console.log(req.params)
   pool.getConnection((err,connection)=>{
       if(err) throw err
       console.log('connected')
       var sql7=`UPDATE fees SET total=total-${pay}  WHERE roll=${roll}`
       
       connection.query(sql7,(err,rows)=>{
           connection.release()

           if(!err){
             
              res.render('home')
               
           } else{
               console.log(err)
           }
       })

   })
})
app.get('/delete',(req,res)=>{
    res.render('delete')
})
app.post('/delete',(req,res)=>{
    var roll=req.body.rno
    console.log(req.params)
   pool.getConnection((err,connection)=>{
       if(err) throw err
       console.log('connected')
       var sql=`DELETE FROM academic WHERE roll=${roll}`
       connection.query(sql,(err,rows)=>{
           connection.release()
           if(!err){
               
              console.log('deleted')
              
              res.render('home')
               
           } else{
               console.log(err)
           }
       })

   })
})
app.listen(port,()=>console.log('hi'))


