$(document).ready (function() {
    var alreadyFilled = false;
    var list;
    var currentFocus;
    var Models;
    async function getStart(){ 
            await fetch('/deep_learning/getModel')
    .then(function(resp){
      return resp.json();
    })
    .then(function(data){
      Models=data;
    }); initDialog();}
    function initdiv(e,a){
        var newElement = document.createElement('div');
        newElement.id = a; 
        
        newElement.innerHTML = Models.modelnames[e].type_spec + " [" + Models.modelnames[e].language+"]";
        $(".dialog").append(newElement);
        list.push(Models.modelnames[e].type_spec);
    }
    function initDialog() {
        currentFocus=-1;
        console.log(Models.modelnames);
        clearDialog();
    
        // for (var i = 0; i < Models.modelnames.length; i++) {
        //     initdiv(i,i);
        // } 
        Object.keys(Models.modelnames).forEach((key, index) => {
            initdiv(key, index);
        });  
    }
    function clearDialog() {
        list=[];
        $('.dialog').empty();
    }
    $('.typeahead input').click(function() {
        if (!alreadyFilled) {
            $('.dialog').addClass('open');
            currentFoucus=-1;
        }});
    $(document).on('keydown',function(e){
        if(e.keyCode==40){
            ++currentFocus;
            console.log(list.length-1);
            if(currentFocus>list.length-1){
                currentFocus=0;
                var y=document.getElementById(list.length-1);
                y.style.background=null;
    
            }
            if(currentFocus!=0){
                var y=document.getElementById(currentFocus-1);
                y.style.background=null;
            }
            var k=document.getElementById(currentFocus);
            k.style.background="#f2f2f2";
            console.log(k);
        }
        else if(e.keyCode==38){
    
            currentFocus--;   
            if(currentFocus<0){
                currentFocus=list.length-1;
                var y=document.getElementById(0);
                if(y.style.background!=null){
                    y.style.background=null;}
            }
            if(currentFocus!=list.length-1){
                var y=document.getElementById(currentFocus+1);
                y.style.background=null;
            }
            var k=document.getElementById(currentFocus);
            k.style.background="#f2f2f2";
    
            console.log(k);
     
        }
        else if(e.keyCode==13){
            e.prevenDefault;
            var answer=list[currentFocus];
            
            $('.typeahead input').val(answer).focus();
            alreadyFilled=true;
            clearDialog();
            $(".dialog").removeClass("open");
            $(".typeahead .close").addClass("visible");
            
        }
    });
    
    
    
    
    
    $('body').on('click', '.dialog > div', function() {
        $('.typeahead input').val($(this).text()).focus();
        $('.typeahead .close').addClass('visible');
        
        alreadyFilled = true;
        list=[];
    });

    $('.typeahead .close').click(function() {
        alreadyFilled = false;
        $('.dialog').removeClass('open');
    
        initDialog();
        $('.dialog').addClass('open');
        $('.typeahead input').val('').focus();
        $(this).removeClass('visible');
    
    });


    var myChart = null;
    $('#dl').click(function() {
        alreadyFilled = false;
        
        $('.dialog').removeClass('open');
        var type = $('.typeahead input').val();
        var inputData = $('.sentence input').val();
        var model = type.replace(/\[.*?\]/g, '').trim();
        console.log('即将发送的模型:',model);
        console.log('即将发送的句子:',inputData);
        $.ajax({
            type: "POST",
            url: "/deep_learning/useModel", 
            contentType: 'application/json',
            data:JSON.stringify( {
                model: model,
                input_data: inputData
            }),
            success: function(response) {
                console.log('服务器响应:', response);
                var labels = response.labels[0]
                var probabilities =  response.probabilities[0]
                var otherProbability = 1 - probabilities.reduce((acc, cur) => acc + cur, 0);
                labels.push('Other');
                console.log(labels); // 输出labels数组
                console.log(probabilities); // 输出probabilities数组

                probabilities.push(otherProbability);
                var ctx = document.getElementById('myChart').getContext('2d');
                
                if (myChart) {
                    myChart.destroy();
                }
                myChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label:"",
                            data: probabilities.map(p => p * 100), 
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins:{
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw; // 获取当前数据点的值
                                        const total = context.dataset.data.reduce((acc, cur) => acc + cur, 0); // 计算总和
                                        const percentage = ((value / total) * 100).toFixed(2) + '%'; // 计算百分比并格式化为字符串
                                        return label + ': ' + percentage; // 返回标签和百分比
                                    }
                                }
                            },
                            legend: {
                                position: 'left',
                            }    
                        }
                        
                    }
                });
            },
            error: function(error) {
                console.log('错误:', error);
            }
        });

    
    })

    $('.sentence .close').click(function() {
        alreadyFilled = false;
        
        $('.dialog').removeClass('open');
    
        $('.sentence input').val('').focus();
        $(this).removeClass('visible');
        $('.submit').removeClass('visible');
    
    });
      
    function match(str) {
        list=[];
        str = str.toLowerCase();
        clearDialog();
        var a=0;
        for (var i = 0; i < Models.modelnames.length; i++) {
            if (Models.modelnames[i].type_spec.toLowerCase().includes(str)) {
                initdiv(i,a);
                a++;
            }
        }      
    }
    $('.typeahead input').on('input', function() {
        $('.dialog').addClass('open');
        alreadyFilled = false;
        $('.typeahead .close').addClass('visible');
        match($(this).val());
    });

    $('.sentence input').on('input', function() {
        alreadyFilled = false;
        if ($(this).val() === '') {
            // 如果为空，隐藏.cancel按钮
            $('.sentence .close, .submit').removeClass('visible');
            
        }else{
            $('.sentence .close, .submit').addClass('visible');
        }
        
    });
    
    $('body').click(function(e) {
        if (!$(e.target).is("input")) {
            $('.dialog').removeClass('open');
        }
        
    });
    
    getStart();
    
});