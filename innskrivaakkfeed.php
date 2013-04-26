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
            $AKKORDIR = $_POST['akkordir'];
            
            $INNIHALD = $mysqli->real_escape_string($INNIHALD);
            $AKKORDIR = $mysqli->real_escape_string($AKKORDIR);
            
            $timestamp = time();
            
            if($mysqli->query("UPDATE akk_feed SET akk_innihald = \"$INNIHALD\", akk_akkordir = \"$AKKORDIR\", akk_timestamp = $timestamp WHERE akk_feed_id = $FEED_ID")){
                echo 1;
            }
            else {
                echo 0;
            }
        }
    }
    
?>