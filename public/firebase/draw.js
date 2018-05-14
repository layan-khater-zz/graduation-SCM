import {config,init,database,auth} from './conn.js';

  // Initialize Firebase
  var firebaseUserId;

$(function(){ 
    auth.onAuthStateChanged( user => {
        if (user) {
    firebaseUserId= user.uid ;
    var projectKey=extractProjectKey();
    var diagramKey=extractDiagramKey();
    var element=database.child("projects").child(projectKey).child(diagramKey).child("elements"); 
    var canvas = $(".canvas");
    var tools = $(".tools"); 
    var history=database.child('history');
    var project=database.child("projects");///project firebase refrence
    var user=database.child("users");
 

          
            $(".tool").draggable({
                helper: "clone"
            });
             project.child(projectKey).child("team").once('value',function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                    if(childSnapshot.key==firebaseUserId){
            canvas.droppable({
                drop: function(event, ui) {
                   
                    var color=childSnapshot.child("color").val();     
                    if(!ui.helper.attr("id")){   //to avoid to add another tool item when it dragged
                    var time=new Date();
                      var node = {
                        _id:time.getTime() ,
                        position: ui.helper.position(),
                        color:color
                    };
                    node.position.left -=300;
                    node.position.top+=30;
                    if(ui.helper.hasClass("arrow")){
                        node.type = "arrow";
                    } else if(ui.helper.hasClass("sequare-original")){
                        node.type = "sequare";
                    }else {
                        return;
                    }
                    addElement(node);//add element on firebase
                    var date=time;

                    addHistory(date);
                  
              
                } 
            
                } 

            });
        }
                
    });
  });

            function addElement(node){
                var type=node.type;
                var top=node.position.top;
                var left=node.position.left;
                var id=node._id;
                var color=node.color;
            element.push().set({
                id:id,
                type:type,
                top:top,
                left:left,
                color:color,
                data:"Activity"
            });
          

                         
            }
            
////////////////////////added elemnts listener from firebase/////////////////////////////// 
             element.on('child_added',snap =>{
                    var id=snap.val().id;
                    var type=snap.val().type;
                    var left=snap.val().left;
                    var top=snap.val().top;
                    var color=snap.val().color;
                    var data=snap.val().data;
                    var height=snap.val().height;
                    var width=snap.val().width;

                    var html="";
                  
                    if(type=="sequare"){      
                   html=$("<div class='"+type+" tool' style='height:"+height+"px; width:"+width+"px; border-radius:2em; text-align: center; vertical-align: middle; line-height:"+height+"px'>"+data+"</div>");
                   $(html).hover(function(){
                    $(this).css('border-color',color);},function(){
                        $(this).css('border-color',"black");
                    });
                
                    // $(html).
                    }else if(type=="arrow"){
                        html=$("<div class='arrow tool'><div class='line'></div><div class='point'></div></div>");
                        //   $(html+">.line").hover(function(){
                        // $(this).css('background-color',"red");},function(){
                        //     $(this).css('border-color',"black");
                        // });

                    }
                  

                    $(html).css({
                       _id:id,
                        position: "absolute",
                        top:top,
                        left:left
                    }).draggable({
                        stop: function(event, ui) {
                            project.child(projectKey).child("team").once('value',function(snapshot){
                                snapshot.forEach(function(childSnapshot) {
                                    if(childSnapshot.key==firebaseUserId){
                                        var color=childSnapshot.child("color").val();

                             
                            var id = ui.helper.attr("id");
                            var draggedElement=$('#'+id);
                            element.once('value',function(snapshot) {
                           snapshot.forEach(function(childSnapshot) {
                            var childKey = childSnapshot.key;
                           var childID= childSnapshot.child("id").val();

                            if(childID == id){
                                if(ui.helper.position().left<=50 && ui.helper.position().top<=30 ){
                                    removeElement(id);
                                    
                             }//check if not removed element
                             else{                                
                            // ///UPDATE on FIREBASE//
                             element.child(childKey).update({
                             left:ui.helper.position().left,
                            top:ui.helper.position().top,
                            color:color
                             
                            });
                        }
                        }//if

                        });//foreach
                      
                    });//element value ref
                 
                }//search for current user color
            });//for each user in the team
        });//ref on team

                
                 
                }//draggable function
                
                
     
                       

                      ////draggble end                
                    }).attr("id",id);

                   
                    ////////////////end edit if dragged  elements moved and save edits in firebase///////////////
                    $(html).resizable({
                        stop:
                        function(event,ui) {
                       var height=ui.helper.height();
                       var width=ui.helper.width();

                       project.child(projectKey).child(diagramKey).child("elements").once('value',snap=>{
                           snap.forEach(function(childSnapshot){
                               var key=childSnapshot.key;
                               var gId=childSnapshot.val().id;
                               if(id==gId){
                                project.child(projectKey).child(diagramKey).child("elements").child(key).update({
                                    height:height,
                                    width:width
                         });


                               }
                           });

                       });
                            
                        }
                        
                    });
                
////////////////////////add data function/////////////////
                    $('div.sequare').click(function(){
                        var id=$(this).attr("id")+"";
                        if(!$('.tool-input').attr("id")){
                            var oldData=$(this).text();
                            $(this).text(""); ///empty the div
                            width=width-30;
                            height=height-30;
                        var html=$("<input class='tool-input' id='tool-text'  type='text' style='z-index:2; position:relative; top:20%; width:"+width+"px; height:"+height+"px; border:none;' value='"+oldData+"'>");
                        $(this).append(html);

                        
                        }                           
                    });

                    $('div.sequare').dblclick(function(){
                        var ele=$(this);
                        if(ele.has(".tool-input")){
                            var id=ele.attr("id")+"";
                            var data=$('.tool-input').val();
                           if(data !=""){

                           project.child(projectKey).child(diagramKey).child("elements").once('value',snap=>{
                               snap.forEach(function(childSnapshot){
                                   var retrivedId=childSnapshot.val().id+"";
                                   var key=childSnapshot.key;
                                   if(retrivedId==id){
                                       project.child(projectKey).child(diagramKey).child("elements").child(key).update({
                                           data:data
                                       });

                                   }
                               });
                           });

                       }
                       $(".tool-input").remove();
                       ele.text(data);
                    }
                       

                    });
///////////////////////end of add data////////////////////

canvas.append(html);
 
                
                });

             
             
             
 ////////////////////////end added elemnts listener from firebase///////////////////////////////  
 function removeElement(id){
    $("#"+id).remove();
    project.child(projectKey).child(diagramKey).child("elements").once('value',snap=>{
        snap.forEach(function(child){
            if(child.val().id==id){
                project.child(projectKey).child(diagramKey).child("elements").child(child.key).remove();
         }

        });
        

    });

 }


 element.on("child_removed",snap=>{
     var id=snap.val().id;
     if($("#"+id)){
        $(this).remove();
     }


 });

 element.on("child_changed",snap=>{
     var id=snap.val().id;
     var top=snap.val().top;
     var left=snap.val().left;
     var type=snap.val().type;
     var color=snap.val().color;
     var data=snap.val().data;
     var height=snap.val().height;
     var width=snap.val().width;
     
     var elementLeft=$("#"+id).position().left;
     var elementTop=$("#"+id).position().top;

     if(elementLeft != left || elementTop != top ){ 
         //to check if the change happpened from this user 
        //or from other user at the team
         $("#"+id).css({
             left:left,
             top:top
         });
     }
     var elementW=$("#"+id).height();
     var elementH=$("#"+id).width();
         if(elementH != height || elementW != width){
                //to check if the change happpened from this user 
        //or from other user at the team
            $("#"+id).css({
                height:height,
                width:width
            }); 
         }
     $("#"+id).hover(function(){
        $(this).css('border-color',color);},function(){
            $(this).css('border-color',"black");
        }); ///change hover color
        var time=new Date();
        addHistory(time);

        /////display data on activeity/////
       $("#"+id).text(data);
        

 });

            function extractProjectKey(){
    ////extracting project key//////
    var link=window.location.href+"";
    var start=link.search("pId=")+4; ///projecy keystart position
    var end=link.search("&");
    var projectKey=link.substring(start,end);
    return projectKey;
    /////////////////////
    
 }
 function extractDiagramKey(){
    ////extracting project key//////
    var link=window.location.href+"";
    var start=link.search("dId="); ///projecy keystart position
    var diagramKey=link.substring(start+4,link.length);
    return diagramKey;
    /////////////////////
    
 }

 function addHistory(date){    
    var date=date+"";
    var key=history.push().key;
    history.child(key).set({
        did:diagramKey,
        date:date

    });


 
    for(var i=0;i<$(".canvas>.tool").length;i++){
        var left=$(".canvas>.tool:eq("+i+")").css("left");
        var top=$(".canvas>.tool:eq("+i+")").css("top");
        var split=$(".canvas>.tool:eq("+i+")").attr("class").split(" ");
        var type=split[0];
        var id=$(".canvas>.tool:eq("+i+")").attr("id");
        history.child(key).child("elements").push().set({
            id:id,
            top:top,
            left:left,
            type:type
    
        });
    }
 }


 function addHistoryButton(date,HistoryKey){
     var html="<div class='HistoryItem'  id='"+HistoryKey+"'>"+date+"</div>";
    
     $(".history").append(html);
 }

 history.on("child_added",snap=>{
     var did=snap.val().did;
     var CurrentDiagram=extractDiagramKey();
     if(did==CurrentDiagram){
     var date=snap.val().date;
     var HistoryKey=snap.key;
     addHistoryButton(date,HistoryKey);
     }

 });

 $('.history').on('click','.HistoryItem', function(){
    var id= $(this).attr("id");
    canvas.empty();
    history.child(id).child("elements").once('value',function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var id=childSnapshot.child("id").val();
            // $(".tool").remove();
            var left= childSnapshot.child("left").val();
            var top= childSnapshot.child("top").val();
            var type= childSnapshot.child("type").val();
            var color= childSnapshot.child("color").val();
            var html="";

            if(type=="sequare"){      
                html=$("<div class='"+type+" tool' style='height:60px; width:120px; border-radius:45px;'></div>");
                 }else 
                 if(type=="arrow"){
                     html=$("<div class='arrow tool'><div class='line'></div><div class='point'></div></div>");

                 }
                 $(html).css({
                    _id:id,
                     position: "absolute",
                     top:top,
                     left:left
                 });
                 $(html).hover(function(){
                     $(this).css('border-color',color);},function(){
                         $(this).css('border-color',"black");
                     });
             canvas.append(html);
        });
    });
 });



 

}else{ window.location.href='index.html';}

    });




 

            
            
            
}); //end jquery
        
   
  

   