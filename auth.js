//process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
var express = require('express') , bodyParser = require('body-parser');
var request = require('request');
const cors = require('cors');
var app = express();
var data;
var baseurl = 'https://chequechain.wasplabs.ca/accounts?finInstNum=';
app.use(bodyParser.json());
app.use(cors())


app.post('/', function(req, res){
        data = req.body;
        data.processed = false;
        //console.log(data);      // your JSON
        var now = new Date();
        now.setHours(0,0,0,0);
        var comp = new Date(data.date)
        comp.setHours(0, 0, 0, 0);
        //console.log(now)
        //console.log(comp)
        if( comp.getTime() <= now.getTime()){
                data.processed = true;
                data.accountvalid = false;
                data.amountvalid = false;
        }
        if(data.processed == true){
                var url = baseurl.concat(data.finInstNum, '&tranNum=', data.tranNum,'&bodyLimit=10&pageLimit=1');
                request(url, function (error, response, body){
                        //console.log(error)
                        if ( response.statusCode == "200"){
                                data.statusCode = response.statusCode;
                                var jsonlist = JSON.parse(body);
                                for ( var i = 0; i < jsonlist.length ; i ++){
                                        var tmp = jsonlist[i];
                                        console.log(data.accountId);
                                        if (data.accountId == tmp.accountId){
                                                data.accountvalid = true;
                                                //console.log(tmp);
                                                data.balance = tmp.balance;
                                                if (data.balance >= data.amount){
                                                                data.amountvalid = true;
                                                }
                                        }
                                }
                        }
                        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        //console.log(data);
                        res.send(data);
                });
        }else{
                 res.send(data);
        }
});

app.listen(3000);


