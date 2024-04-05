$(document).ready (function() {
    var alreadyFilled = false;
    var list;
    var currentFocus;
    var American_States;
    async function getStart(){ 
            await fetch('https://www.happychamber.xyz/deep_learning/getState')
    .then(function(resp){
      return resp.json();
    })
    .then(function(data){
      American_States=data;
    }); initDialog();}
    function initdiv(e,a){
        var newElement = document.createElement('div');
        newElement.id = a; 
        
        newElement.innerHTML = American_States.geonames[e].toponymName;
        $(".dialog").append(newElement);
        list.push(American_States.geonames[e].toponymName);
    }
    function initDialog() {
        currentFocus=-1;
        console.log(American_States.geonames);
        clearDialog();
    
        for (var i = 0; i < American_States.geonames.length; i++) {
            initdiv(i,i);
        }   
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
      
    function match(str) {
        list=[];
        str = str.toLowerCase();
        clearDialog();
        var a=0;
        for (var i = 0; i < American_States.geonames.length; i++) {
            if (American_States.geonames[i].toponymName.toLowerCase().includes(str)) {
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
    
    $('body').click(function(e) {
        if (!$(e.target).is("input")) {
            $('.dialog').removeClass('open');
        }
        
    });
    
    getStart();
    
});