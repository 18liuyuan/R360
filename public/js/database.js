$(function () { 

        function updateIDetailData(tabname, data){
            var columns = [];
            if(data.length > 0){
                for(var k in data[0]){
                    columns.push({
                        title : k,
                        field: k
                    });
                }
           }
            
            $("#"+tabname).datagrid({
                singleSelect: true,            
                columns : [columns],
                title : tabname
            });

            $("#"+tabname).datagrid('loadData', {
                total : data.length,
                rows : data
            });
      }
      
      function getData(tab){

        $.ajax({
                type: "GET",
                url: "/api/get_base_data",
                dataType:"json",
                data: {table : tab},
                success: function(msg){
                    
                    if(msg.result == 0){
                        var tabName = "";
                        if(tab == "i_detail"){
                            tabName = "tab-idetail";
                        } else if(tab == "o_detail"){
                              tabName = "tab-odetail";
                        } else if(tab == "acct"){
                              tabName = "tab-acct";
                        }
                        updateIDetailData(tabName,msg.data);
                    } else {
                       alert('get data base failure.');
                    }
                },
                error: function(){
                    alert('get data base failure.');
                }
            }); 
        }

        getData('i_detail');
        getData('o_detail');
        getData('acct');
   


});