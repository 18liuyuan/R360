$(function () { 

    function getDaysOfMonth(year, month){
        return 32-new Date(year,month,32).getDate();
    }
   

     $("#table").datagrid({
                singleSelect: true,
                toolbar : "#tb",
                columns: [[{
                    title: "month",
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
                },{
                    title: "rev",
                    field: "rev",
                    width: 100
                },{
                    title: "ach",
                    field: "ach",
                    width: 100,
                    formatter: function(value, row, index){                     
                            return ''+value+'%';                    
                    }
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
                text: 'Achieve Trend',
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
                    },
                     {
                        name:'AOP'
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
                         color: 'rgb(164,205,238)',
                         label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                color: '#615a5a'
                                             }
                         },
                        formatter:function(params){
                            if(params.value==0){
                                return '';
                            }else
                            {
                                return params.value;
                            }
                        }

                    }
                }
            },
            {
                name: 'AOP',
                type: 'bar',
               
                itemStyle: {
                    normal :  {
                         color: 'rgb(164,205,0)',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                            color: '#615a5a'
                    }
                         },
                        formatter:function(params){
                            if(params.value==0){
                                return '';
                            }else
                            {
                                return params.value;
                            }
                        }
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

            var actData = [];
           var aopData = [];
                for(var j in  data){
                    actData.push(data[j]["total_charge"]);
                    aopData.push(data[j]["rev"]);
                }

            var option = {
                series: [{
                    name: 'ACT',
                    type: 'bar',
                    data: actData,
                    itemStyle: {
                        normal :  {
                                color: 'rgb(164,205,238)'
                        }
                    }
                  },{
                    name: 'AOP',
                    type: 'bar',
                    data: aopData,
                    itemStyle: {
                        normal :  {
                                color: 'rgb(164,205,0)'
                        }
                    }
                  }]
            };

            myChart.setOption(option);
        }


    

        


        function initStccodeFilter(){
            $('#stccode').combo({
                    required:false,
                    editable:false
                });

            $('#stccode-panel').appendTo($('#stccode').combo('panel'));
                $.ajax({
                        type: "GET",
                        url: "/api/get_stccode",
                        dataType:"json",
                        data: {},
                        success: function(msg){
                            myChart.hideLoading();
                            if(msg.result == 0){
                            
                                for(var i in msg.data){
                                    var option = "<input type='radio' name='lang value='02'><span>"+msg.data[i].sales_cd+"</span><br/>";
                                    $("#stccode-panel").append(option);
                                }
                                $('#stccode-panel input').click(function(){
                                    var v = $(this).val();
                                    var s = $(this).next('span').text();
                                    $('#stccode').combo('setValue', v).combo('setText', s).combo('hidePanel');
                                });
                            } else {
                                alert('get stccode options failure.');
                            }
                        },
                        error: function(){
                            alert('get stccode options failure.');
                        }
                    });
		}


        function initStationFilter(){
            $('#station').combo({
                    required:false,
                    editable:false
                });

            $('#station-panel').appendTo($('#station').combo('panel'));
            $.ajax({
                    type: "GET",
                    url: "/api/get_station",
                    dataType:"json",
                    data: {},
                    success: function(msg){
                        myChart.hideLoading();
                        if(msg.result == 0){
                        
                            for(var i in msg.data){
                                var option = "<input type='radio' name='lang value='02'><span>"+msg.data[i].station+"</span><br/>";
                                $("#station-panel").append(option);
                            }
                            $('#station-panel input').click(function(){
                                var v = $(this).val();
                                var s = $(this).next('span').text();
                                $('#station').combo('setValue', v).combo('setText', s).combo('hidePanel');
                            });
                        } else {
                            alert('get station options failure.');
                        }
                    },
                    error: function(){
                        alert('get station options failure.');
                    }
                });
		}

        function initIProdCodeFilter(){
            $('#iprodcode').combo({
                    required:false,
                    editable:false
                });

            $('#iprodcode-panel').appendTo($('#iprodcode').combo('panel'));
            var data = ['L', 'T', 'K', 'D', '7', 'M', 'Y', 'E', 'P', '8', 'N'];
            for(var i in data){
                 var option = "<input type='checkbox' name='lang value='02'><span>"+data[i]+"</span><br/>";
                 $("#iprodcode-panel").append(option);
            }
            $('#iprodcode-panel input').click(function(){
                //var v = $(this).val();
                //var s = $(this).next('span').text();
                // var text = $('#iprodcode').combo('getText');
                //$('#iprodcode').combo('setText', text+","+ s).combo('hidePanel');
                //可以通过两重循环来实现
                var selectedData="";
                $("#iprodcode-panel input").each(function(){
                 
                   if($(this)[0].checked){
                       var curData = $(this).next('span').text();
                       if(selectedData.length  == 0){
                            selectedData+=curData;
                       } else {
                            selectedData = selectedData +","+curData;
                       }
                   }
                });
                $('#iprodcode').combo('setText', selectedData);
                //$('#iprodcode').combo('hidePanel');

            });
		}
	   
        



    initStccodeFilter();
    initStationFilter();
    initIProdCodeFilter();
   

            
});