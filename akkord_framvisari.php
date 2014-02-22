<!DOCTYPE html>
<html>
<head>
    <title>Akkordframs&yacute;ning</title>
    <script src="jquery.min.js"></script>
    <script src="akkordskipan.js"></script>
    
    <meta charset="utf-8" />
    <style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-size: 1.5em;
        }
        
        .akkord {
            position:absolute;
            top:-1em;
            z-index:-1;
        }
    </style>
</head>
<body>
    <script>
    
    $(document).ready(function(){
        akkordSkipan.tendra("akkfeed");
        
        eventHandlersOnTranspose("upp");
        eventHandlersOnTranspose("nidur");
        eventHandlersOnTranspose("nullstilla");
    });
    
    function eventHandlersOnTranspose(act) {
        $('#'+act).click(function(e) {
            if(e.preventDefault)
                e.preventDefault(); //Mozilla
            else
                e.returnValue = false; //IE
            
            //alt annað enn IE8 og eldri
            if('bubbles' in e) {
                if(e.bubbles) {
                    e.stopPropagation();
                }
            }
            //IE8 og eldri
            else {
                e.cancelBubble = true;
            }
            
            akkordSkipan.transponera(act);
        });
    }
    
    </script>
    
    <p>Transponera: <a id="upp" href="#">+</a>
    <a id="nidur" href="#">-</a>
    <a id="nullstilla" href="#">0</a></p>
    
    <p id="sang"></p>
</body>
</html>