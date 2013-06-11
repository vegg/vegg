<!DOCTYPE html>
<html>
<head>
    <title>Projection of feed</title>
    <script src="jquery-1.7.2.min.js"></script>
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
            heinta();
        });
        
        function heinta() {
            $.ajax({
                url:"lesFeed.php",
                type:"post",
                success:function(data) {
                    if(data != "" && data != null) {
                        document.getElementById('feedSpot').innerHTML = data.ting;
                    }
                }, dataType: "json", complete: heinta, timeout: 30000
            });
        }
        
        /*
         
         heinta : function() {
                $.ajax({
                    url:"lesAkkFeed.php",
                    type: "post",
                    success:function(data) {
                        if(data != "") {
                            framvisari_akkordSkipan.ruddaSkerm();
                            $.each(data.sang, function(index, value) {
                                framvisari_akkordSkipan.valdaVers = index;
                                framvisari_akkordSkipan.fSangtekst = data.sang;
                                framvisari_akkordSkipan.fAkkord = data.akkordir;
                                framvisari_akkordSkipan.innVidSangi();
                            });
                        }
                    }, dataType: "json", complete: framvisari_akkordSkipan.heinta, timeout: 30000 });
        },
         
        */
    </script>
    
    <p id="feedSpot"></p>
</body>
</html>