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
                    title: "月份",
                    field: "month_name",
                    width: 100
                },{
                    title: "charge",
                    field: "charge",
                    width: 100
                }, {
                    title: "ex_charge",
                    field: "ex_charge",
                    width: 100
                },{
                    title: "discount",
                    field: "discount",
                    width: 200
                },{
                    title: "total_charge",
                    field: "total_charge",
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
                text: '2017年APT',
                textAlign : 'center',
                x :'left',
                y : 'top',
                left : 100
            },
            tooltip: {},
            grid:{
                top : 100
            },
            legend: {
                top : 50,
                data:[
                    {
                        name:'ACT'
                    }
                    ]
                },
            xAxis: {
                data: month_date
            },
            yAxis: {},
            series: [{
                name: 'ACT',
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
            url: "/api/get_report_data?station=CHZ&prod_code=P",
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
                    name: 'ACT',
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