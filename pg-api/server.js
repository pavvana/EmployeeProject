let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let cors = require('cors');
let pg = require('pg');

const PORT = 3000;

let pool = new pg.Pool({
        user:'postgres',
        database:'Countries',
        password:'admin',
        host:'localhost',
        port :5432,
        max:10
        
});



let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
 

app.use(function(request, response , next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

      app.delete('/api/remove/:id',function(request,response){
              var id = request.params.id;
              pool.connect(function(err, db , done){
                if(err){
                        return response.status(400).send(err)
                }
                else{
                        db.query('DELETE from employee where id = $1', [Number(id)] , function(err,result) {
                                done();
                                if(err) {
                                        return response.status(400).send(err)
                                }
                                else{
                                        return response.status(200).send({message:'success in deleting reacords'})
                                }
                        })
                }

              })
      })

      app.get ('/api/employee' , function (request,response ){
              pool.connect(function(err,db,done){
                      if (err){
                                return response.status(400).send(err)
                      }
                      else{

                        db.query('select * from employee',function(err,table){
                                done();
                                if (err){
                                        return response.status(400).send(err)
                                }
                                else{
                                        return response.status(200).send(table.rows)
                                }
                        })
                      }
              })
      })
      app.post('/api/new-employee', function(request, response) {
        var first_name = request.body.first_name;
        var id = request.body.id;
        var organization = request.body.organization;
        let values = [first_name , organization,id];

        pool.connect((err,db,done) => {
        if (err){
               return response.status(400).send(err);
       }
        else{

                db.query('Insert into employee (first_name,organization,id) values ($1,$2,$3)',[...values], (err , table) => {
                        done();

                       if (err){

                                return response.status(400).send(err);
                      }

                        else {
                                console.log('DATA inerted');
                
                                response.status(201).send({message:'Data inserted!'});
                        }
                })
        }

})
      });
      app.listen(PORT, () => console.log ('listening on port' + PORT));


