<?php
    require("samband.php");
    
    if($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    }
    else {
        if(!$mysqli->set_charset("utf8")) {
            echo "Failed to set charset" . $mysqli->error;
        }
        else {
            $FEED_ID = 1;
            $INNIHALD = $_POST['innihald'];
            
            $INNIHALD = $mysqli->real_escape_string($INNIHALD);
            
            $timestamp = time();
            
            if($mysqli->query("UPDATE feed SET feed_innihald = \"$INNIHALD\", feed_timestamp = $timestamp WHERE feed_id = $FEED_ID")){
                echo 1;
            }
            else {
                echo 0;
            }
        }
    }
    
?>