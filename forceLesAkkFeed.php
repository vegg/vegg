<?php
    require("samband.php");
    
    if($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    }
    else {
        //$tid = $_POST['tid'];
        $urslit = $mysqli->query("SELECT * FROM akk_feed WHERE akk_feed_id = 1");
        
        $row = $urslit->fetch_array(MYSQLI_ASSOC);
        
        $json = '{"sang" : '.$row['akk_innihald'].', "akkordir" : '.$row['akk_akkordir'].'}';
        
        //$json = htmlentities($json, ENT_NOQUOTES);
        
        //grundin fyri hesum er at htmlentities konverterar < og >
        $json = str_replace('&lt;br&gt;', '<br>', $json);

        echo $json;
    }
?>