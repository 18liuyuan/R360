$(function () { 

    function getDaysOfMonth(year, month){
        return 32-new Date(year,month,32).getDate();
    }
    var testData1=[
        {
            "id" : 1,
            "month" : "一月",
            "totle" : 200
        },
        {
            "id" : 2,
            "month" : "二月",
            "totle" : 232
        },
         {
            "id" : 3,
            "month" : "三月",
            "totle" : 100
        },
         {
            "id" : 4,
            "month" : "四月",
            "totle" : 454
        },
         {
            "id" : 5,
            "month" : "五月",
            "totle" : 900
        },
         {
            "id" : 6,
            "month" : "六月",
            "totle" : 520
        },
         {
            "id" : 7,
            "month" : "七月",
            "totle" : 482
        },
         {
            "id" : 8,
            "month" : "八月",
            "totle" : 502
        },
         {
            "id" : 9,
            "month" : "九月",
            "totle" : 1000
        },
         {
            "id" : 10,
            "month" : "十月",
            "totle" : 256
        },
         {
            "id" : 11,
            "month" : "十一月",
            "totle" : 842
        },
         {
            "id" : 12,
            "month" : "十二月",
            "totle" : 464
        }
    ]


    var cat = [];
    var seri = [];
    for(var j in  testData1){
       cat.push(testData1[j]["month"]);
       seri.push(testData1[j]["totle"]);
    }

     $("#table").datagrid({
               
               
                singleSelect: true,
                columns: [[{
                    title: "运单编号",
                    field: "airbill_number",
                    width: 100
                },{
                    title: "始发地",
                    field: "orig",
                    width: 100
                }, {
                    title: "目的地",
                    field: "dest",
                    width: 100
                }, {
                    title: "产品类型",
                    field: "prod_code",
                    width: 100
                },{
                    title: "ship日期",
                    field: "ship_date_out",
                    width: 200
                },{
                    title: "总重量",
                    field: "total_weight",
                    width: 100
                },{
                    title: "收款账户",
                    field: "bill_acct",
                    width: 100
                },{
                    title: "市场价格",
                    field: "std_charge",
                    width: 100
                },{
                    title: "成交价格",
                    field: "charge",
                    width: 100
                },{
                    title: "附加费",
                    field: "ex_charge",
                    width: 100
                },{
                    title: "支付方式",
                    field: "pay_type",
                    width: 100
                }]],
                onClickRow: function (rowIndex) {  
                   
                }  

            });

    //$("#table").loading({ msg: "正在加载...", topMost: true });

    var month_date = [];

    var cnt = getDaysOfMonth(2017,3);
    for(var i=0;i<12;i++){
        month_date.push((i+1)+"月");
    }

 // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '2017年3月销量',
                textAlign : 'center',
                x :'left',
                y : 'top'
            },
            tooltip: {},
            grid:{
                top : 100
            },
            legend: {
                top : 50,
                data:[
                    {
                        name:'销量'
                    }
                    ]
                },
            xAxis: {
                data: month_date
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
               
                itemStyle: {
                    normal :  {
                         color: 'rgb(164,205,238)'
                    }
                }
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        myChart.showLoading({
        　　text : 'loading',
        　　effect : 'whirling' 
        });

        $.ajax({
            type: "GET",
            url: "/api/get_report_data",
            dataType:"json",
            data: {},
            success: function(msg){
                myChart.hideLoading();
                if(msg.result == 0){
                    updateReportData(msg.data);
                } else {
                    alert(msg.message);
                }
            },
            error: function(){
                alert('保存时出错！请刷新重新发布。');
            }
        });

        function updateReportData(data){

            $("#table").datagrid('loadData', {
                total : data.length,
                rows : data
            });

            var showData = [];
          
                for(var j in  data){
                    showData.push(data[j]["total_weight"]);
                }

            var option = {
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: showData,
                    itemStyle: {
                        normal :  {
                                color: 'rgb(164,205,238)'
                        }
                    }
                  }]
            };

            myChart.setOption(option);
        }


        
});