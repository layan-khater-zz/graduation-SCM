
////////////backend//////
$(function()
{
    //clear placeholder after focus
    'use strict';
    $('[placeholder]').focus(function()
    {
        $(this).attr('data-set',$(this).attr('placeholder'));
        $(this).attr('placeholder',' ');
    }).blur(function()
    {

        $(this).attr('placeholder',$(this).attr('data-set'));

    });

 

  
    //required star
    $('input').each(function(){
        if($(this).attr('required') ==='required'){
            $(this).after('<span class="asterisk" style="color:darkred;">*</span>');
        }

    });

    //input show password icon
    var passField=$('.password');

    $('.show-password').hover(function() {
        passField.attr('type','text');

    },function(){
        passField.attr('type','password');
    });

    $(".sign-up").click(function(){
        $(".signupbox").css("display","block");
        $(".signinbox").css("display","none");
        
        
     });
    
     $(".sign-in").click(function(){
     $(".signinbox").css("display","block");
    $(".signupbox").css("display","none");
     });
     $("#addMember").click(function(){
        $(".AddMemModal").css("display","block");
        }); 
    
            
     
    
     
    
     
    
});
