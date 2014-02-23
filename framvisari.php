<!DOCTYPE html>
<html>
<head>
    <title>Framv&iacute;sari</title>
    <script src="jquery.min.js"></script>
    <style>
        body {
            background-color: #000000;
            color: #ffffff;
            text-align: center;
            font-size: 2em;
        }
        
        #feedSpot {
            
        }
    </style>
</head>
<body>
    <script>
    var i = 0;
        $(document).ready(function(){
            heintaEinaferd();
            heinta();
        });
        
        function heintaEinaferd() {
            $.ajax({
                url:"feed.php",
                type: "post",
                data: {slag:"feed1"},
                success:function(d) {
                    if(d != "" && d != null) {
                        document.getElementById('feedSpot').innerHTML = d.ting;
                    }
                },
                dataType: "json"
            });
        }
        
        function heinta() {
            $.ajax({
                url:"feed.php",
                type:"post",
                data: {slag:"feed+"},
                success:function(data) {
                    if(data != "" && data != null) {
                        document.getElementById('feedSpot').innerHTML = data.ting;
                    }
                }, dataType: "json", complete: heinta, timeout: 30000
            });
        }
    </script>
    
    <p id="feedSpot"></p>
</body>
</html>