import {config,init,database,auth} from './conn.js';
let firebaseUserId;
$(function()
{
    auth.onAuthStateChanged( user => {
        if (user) 
        { firebaseUserId= user.uid ;
    var  users=database.child('users');
    var project=database.child('projects');



   



      //add project to FIREBASE
$('.create-project').click(function(e){
    var projectName=$('#InputProject').val();
    if(projectName != ""){
    CreateProject(projectName);//add to FIREBASE 
    $('#create-project').modal('hide');

    }else $('#InputProject').after("<small style='color:red'>please enter project name</small>");
    
});
////Add project to FIREBASE
function CreateProject(name) {
    var key=project.push().key;

    project.child(key).set({
         name:name
     });
     ///add FIRST user and his information to his team -FIRSTUSER----->teamLeader
    project.child(key).child("team").child(firebaseUserId).set({
        role:"teamLeader",
        color:"red"
     });

     users.child(firebaseUserId).child("UserProjects").push(key);//add project key to user with project id
 }

 ////////////////////////added project LISTENIER//////////////////////////

project.on('child_added',snap =>{
    var projectKey=snap.key;
    users.child(firebaseUserId).child("UserProjects").once('value',function(snapshot) {
        snapshot.forEach(function(childSnapshot) {   
            var projectForUser=childSnapshot.val();
            if (projectKey != "pId" && projectKey == projectForUser){////here we check the projects that user has
            var projectName=snap.val().name;                
                ///add project icon on fronend
            $(".projects").last().append("<a href='diagram.html?pId="+projectKey+"'><div class='project'><div>"+projectName +"</div></div> </a>");
            }

        });
    });
 
 });






 
     
  
    
 $('#signoutbtn').on('click',function(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href='index.html';
      }).catch(function(error) {
          alert("error");
      });

       
});
}else {
window.location.href='index.html';}
});



 
 



});