import {config,init,database,auth} from './conn.js';
var firebaseUserId;

$(function()
{
    auth.onAuthStateChanged( user => {
        if (user) 
        { firebaseUserId= user.uid ;
    var diagram=database.child("diagrams");//diagram firebase refrence
    var project=database.child("projects");///project firebase refrence
    var user=database.child("users");
    var projectKey=extractProjectKey();
    ////first we check if the user is teamleader OR team member

    project.child(projectKey).child("team").child(firebaseUserId).once('value',snap=>{
        var role=snap.val().role;
        if(role=="teamLeader"){
            $("#LeaveProject").css("display","none");

            $("#addMember").css("display","block");
            
        }else if(role =="teamMember"){
            $("#addMember").css("display","none");
            $("#LeaveProject").css("display","block");

        }
        });

   


 function extractProjectKey(){
        ////extracting project key from diagram page//////
        var link=window.location.href+"";
        var start=link.search("pId=")+4; ///project keystart position
        var projectKey=link.substring(start,link.length);
        return projectKey;
        /////////////////////
        
     }


//////////////////////////////diagram///////////////////////////
     //add diagram  on front end and call method to add it at backend
   $('.create-diagram').click(function(){
    var diagramName=$('#InputDiagram').val(); 
    if(diagramName != ""){
    const DiagramKey=CreateDiagram(diagramName);//add on firebase 
    $('#create-diagram').modal('hide');
    }else $('#InputDiagram').after("<small style='color:red'>please enter diagram name</small>");
    $('#InputDiagram').val("");
    
 });

 function CreateDiagram(name) {
    var key=project.child(projectKey).push().key;
     //add diagram name to project
     project.child(projectKey).child(key).set({
         name:name

     });


     return key;
     
 }

 ///Diagram ADDED listener
 project.child(projectKey).on('child_added',snap =>{
 var diagramKey=snap.key;
 var diagramName=snap.val().name;
 if (diagramKey !='name' && diagramKey != 'team'){
 $(".diagrams").last().append("<a href='draw.html?pId="+projectKey+"&dId="+diagramKey+"'><div class='diagram'><div>"+diagramName+"</div></div> </a>");
 }
 });

//////color algorithm
 
 function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}
/////////////color algorithm end


 $("#AddMem").on('click',function(){
        var email=$(".members-input>.email-addMem").val();
        var color=intToRGB(hashCode(email+""));
    if( email != ""){
        user.once('value',function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
             var childKey = childSnapshot.key;
            var snapEmail= childSnapshot.val().email;
         
            if(snapEmail == email){
                // projectKey
                user.child(childKey).child("UserProjects").push(projectKey);
                project.child(projectKey).child("team").child(childKey).set({
                    role:"teamMember",
                    color:"#"+color
                });                   
            }
     
            });
        });
           

    }else {$('#email-addMem').after("<small style='color:red'>please enter the email</small>");}



});
$('#signoutbtn').on('click',function(){
    auth.signOut().then(function() {
        // Sign-out successful.
        window.location.href='index.html';
      }).catch(function(error) {
          alert("error");
      });
    });

    $("#LeaveProject").click(function(){
        user.child(firebaseUserId).child("UserProjects").once('value',snapshot=>{
            snapshot.forEach(function(childSnapshot){
              var project=childSnapshot.val();
              var deleted_key=childSnapshot.key;
              if(project==projectKey){
                user.child(firebaseUserId).child("UserProjects").child(deleted_key).remove();
                window.location.href="project.html";
              }


            });
        });
    });
       

}else {window.location.href='index.html';}
    });
   


 
});

