$(function () { 

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

    

    var myChart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: '2017年销售额度'
        },
        xAxis: {
            categories: cat
        },
        yAxis: {
            title: {
                text: '额度'
            }
        },
        series: [{
            name: '华南区',
            data: seri
        }]
    });

     $("#table").datagrid({
                data: testData1,
                height: 400,
                columns: [[{
                    title: "编号",
                    field: "id",
                    width: 100
                }, {
                    title: "月份",
                    field: "month",
                    width: 100
                }, {
                    title: "金额",
                    field: "totle",
                    width: 100
                }]]

            });


});