var mysql      = require('mysql');
var dbConfig = {
    host     : '120.25.201.8',
    user     : 'dhl',
    password : 'dhl',
    database : 'dhl'
};



function DataBase(){
    this._connect_status = 0;//0未连接，1正在连接，2已连接
    this._connection = null;
    this._connResCallbackList = [];
}

DataBase.prototype.connect = function(){
    this.disconnect();
    this._connection = mysql.createConnection(dbConfig);
    this._connect_status = 1;
    this._connection.connect(function(err){
        var retObj = {};
        if(err){
           // console.log('connect database failure.');
            this._connect_status = 0;
            retObj.result = 0;
            retObj.message = 'database connected failure';
        } else {
            //console.log('connect database success.');
            this._connect_status = 2;
             retObj.result = 2;
            retObj.message = 'database connect success.';
        }
        for(var i in this._connResCallbackList){
            this._connResCallbackList[i](retObj);
        }
        this._connResCallbackList = [];
    }.bind(this));
}

DataBase.prototype.disconnect = function(){
    
    if(this._connection != null){
        this._connection.destroy();
    }
    this._connect_status = 0;
    this._connection = null;
}



DataBase.prototype.start = function(cb){
    


    if(this._connect_status == 0){
         if(cb != null){
             this._connResCallbackList.push(cb);
         }
        this.connect();
    } else if(this._connect_status == 1){
        if(cb != null){
            cb({
                result : 1,
                msg : 'database connecting...'
            });
        }
    } else {
        if(cb != null){
            cb({
                result : 2,
                 msg : 'database connected success.'
            });
        }
    }
}

DataBase.prototype.get_query_sql = function(param){
    var sql1 = "SELECT DATE_FORMAT( prd_end_dt, '%Y-%m') as prd_end_date, SUM(charge), SUM(ex_charge), SUM(discount) from o_detail GROUP BY DATE_FORMAT( prd_end_dt, '%Y-%m') ";
    var sql2 = 'select * , SUM(weight) as total_weight ,   date_format(ship_date,"%Y-%m-%d") as ship_date_out  FROM o_detail GROUP BY ship_date';

    var sql="";
    if(param.qtype === "it"){

    } else if(param.qtype === "ot"){

    } else if(param.qtype === "ot"){

    }
    return sql;
}



DataBase.prototype.get_irecord = function(param, cb){
     var sql = "select a.*,b.station from i_detail  a left join acct b on a.bill_acct=b.acct_no where true";
     if(param && param.station && param.station!== "all"){
         sql = sql + " and b.station='"+ param.station+"'";
     }

      if(param && param.prod_code && param.prod_code!== "all"){
         sql = sql + " and a.prod_code = '"+ param.prod_code + "'";
     }
     
    
    this._connection.query(sql, function(err, result){
        console.log(JSON.stringify(result));
        if(!cb){
            return ;
        }
        var retObj = {};
        if(err){
            retObj.result = -10;
            retObj.message = 'query database failure';
        } else {
            retObj.result = 0;
            retObj.data = result;
        }
        cb(retObj);

    });
}

DataBase.prototype.get_act = function(param, cb){
    /*
    SELECT AA.month_name, AA.charge, AA.ex_charge, AA.station, AA.discount, AA.final_charge , SUM(AA.final_charge) as total_charge from (
    select 'o' as iotype ,DATE_FORMAT(prd_end_dt,'%Y-%m') as month_name, a.charge ,a.ex_charge, b.station ,b.sales_cd, a.discount as discount, (a.charge+a.ex_charge-discount) as final_charge from o_detail  a left join acct b on a.ship_acct=b.acct_no where oWhere
    UNION ALL
    select 'i' as iotype ,DATE_FORMAT(prd_end_dt,'%Y-%m') as month_name, a.charge, a.ex_charge, b.station ,b.sales_cd, 0 as discount, (a.charge+a.ex_charge-discount) as final_charge from o_detail  a left join acct b on a.ship_acct=b.acct_no where iWhere
    ) as AA  GROUP BY AA.month_name
    */



    var oWhere = " true and b.sales_cd='CHG' and a.prod_code in ('L', 'T', 'K', 'D', '7', 'M', 'Y', 'E', 'P', '8', 'B', 'G','N') and a.pay_type in ('C', 'R', 'N') ";
    var iWhere = " true and b.sales_cd='CHG' and a.prod_code in ('L', 'T', 'K', 'D', '7', 'M', 'Y', 'E', 'P', '8', 'N')  and a.pay_type in ('E')";

     var sqlo = "select 'o' as iotype ,DATE_FORMAT(prd_end_dt,'%Y-%m') as month_name, a.charge ,a.ex_charge, b.station ,b.sales_cd, a.discount as discount, \
    (a.charge+a.ex_charge-discount) as final_charge from o_detail  a left join acct b on a.ship_acct=b.acct_no where " + oWhere;

    var sqli = "select 'i' as iotype ,DATE_FORMAT(prd_end_dt,'%Y-%m') as month_name, a.charge, a.ex_charge, b.station ,b.sales_cd, 0 as discount, \
     (a.charge+a.ex_charge-discount) as final_charge from o_detail  a left join acct b on a.ship_acct=b.acct_no where " + iWhere;

   
     var querySql = "SELECT AA.month_name, SUM(AA.charge) as charge, SUM(AA.ex_charge) as ex_charge , SUM(AA.discount) as discount, SUM(AA.final_charge) as total_charge \
      from (" + sqlo ;
     querySql = querySql+ " UNION ALL " + sqli + ") as AA GROUP BY AA.month_name";

 var sql;
     if(param && param.station && param.station!== "all"){
         sql = sql + " and b.station='"+ param.station+"'";
     }

      if(param && param.sales_cd && param.sales_cd!== "all"){
         sql = sql + " and b.sales_cd='"+ param.sales_cd+"'";
     }

    if(param && param.prod_code && param.prod_code!== "all"){
         sql = sql + " and a.prod_code = '"+ param.prod_code + "'";
     }

    //sql = sql + "and a.pay_type in()"
     
    
    this._connection.query(querySql, function(err, result){
        console.log(JSON.stringify(result));
        if(!cb){
            return ;
        }
        var retObj = {};
        if(err){
            retObj.result = -10;
            retObj.message = 'query database failure';
        } else {
            retObj.result = 0;
            retObj.data = result;
        }
        cb(retObj);

    });
}


DataBase.prototype.get_report_data = function(param, cb){

   
   
    if(!param){
        return cb({result : -11,
            message : 'client request param error.'});
    }
    var sql = getQuerySql(param);
    this._connection.query(sql, function(err, result){
        console.log(JSON.stringify(result));
        if(!cb){
            return ;
        }
        var retObj = {};
        if(err){
            retObj.result = -10;
            retObj.message = 'query database failure';
        } else {
            retObj.result = 0;
            retObj.data = result;
        }
        cb(retObj);

    });
}

var dataBaseInstance = new DataBase();

module.exports = dataBaseInstance;