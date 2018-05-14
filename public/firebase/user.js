import {config,init,database,auth} from './conn.js';

 let userId;
$(function()
{  
// sign-up modal inputs
var txtname=$('#usname-signup');
var txtemail_signup=$('#email-signup');
var txtpass_siginup=$('#pass-signup');
var txtconfpass=$('#confpass-signup');
var signup_btn=$('#signupbtn');

// sign-in modal inputs
var txtemail_signin=$('#email-signin');
var txtpass_signin=$('#pass-signin');
var signinp_btn=$('#signinbtn');
 

 
    
signup_btn.on('click',e=>{
  $("small").remove();
//get values
var email=txtemail_signup.val();
var password=txtpass_siginup.val();
var cpass=txtconfpass.val();
if(txtname.val() != "" && txtemail_signup.val() != "" && txtpass_siginup.val() != "" && txtconfpass.val() != ""){
  if(txtpass_siginup.val() == txtconfpass.val()){
//create account

const consle=auth.createUserWithEmailAndPassword(email, password);
var m=consle.catch(e=>{ 
  if(e.message=="The email address is badly formatted."){
    txtemail_signup.after("<small class='false' style='color:red'>The email address is badly formatted.Email@example.com</small>");
    }else if(e.message=="The password must be 6 characters long or more." &&  e.message != "The email address is already in use by another account."){
      txtpass_siginup.after("<small class='false' style='color:red'>The password must be 6 characters long or more.</small>");
    }else if(e.message == "The email address is already in use by another account."){
    $("h1").after("<small class='false' style='color:red'>The email address is already in use by another account.</small>");
    txtname.val()="";
    txtemail_signup.val()="";
    txtpass_siginup.val()="";
    txtconfpass.val()="";
  }



});
  
auth.onAuthStateChanged( user => {
  if(user){
    var user=database.child('users');
    var cUser=auth.currentUser;
    cUser.sendEmailVerification().catch(e=>{
    
    }); 
    var userKey=cUser.uid;
    var e=cUser.email;
    var name=txtname.val();
  
      user.child(userKey).set({
        name:name,
      email:e
  
      });

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href='index.html';
      });

      $(".signupbox").css("display","none");
      
   
 

  }
});
}else{ txtconfpass.after("<small style='color:red'>your password doesn't match,try again!</small>");}//else }
}else{      $("h1").after("<small style='color:red'>Please fill all fields</small>");    } 


});







//method of sign-in button 

//add sign-in event
 

signinp_btn.on('click',e=>{
  $("small").remove();
   //get values
    var email=txtemail_signin.val();
    var password=txtpass_signin.val();
    if( email != "" && password != ""){
    //sign-in 
    const consle=auth.signInWithEmailAndPassword(email,password).catch(function(error){
      var errorMessage=error.message;
      var errorCode=error.code;
      console.log(errorMessage);
      if( errorMessage == "The email address is badly formatted." || e.message=="There is no user record corresponding to this identifier. The user may have been deleted."){
        $("#email-signin").after("<small style='color:red'>The email address is badly formatted</small>");}
       
       else if(errorMessage == "The password is invalid or the user does not have a password."){
     $("#pass-signin").after("<small style='color:red'>wrong-password</small>");}else{if(errorMessage=="There is no user record corresponding to this identifier. The user may have been deleted."){
       $("h1").after("<small style='color:red'>Please sign-up...your email not registered</small>");
     }}
    });
  
      
    auth.onAuthStateChanged( user => {
      if (user) 
    {
        window.location.href='project.html'; 
        }
      });
    
    }else{
      $("h1").after("<small style='color:red'>Please fill all fields</small>");    } 
    });
  
});




















