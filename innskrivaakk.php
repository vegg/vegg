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
            $SANG_ID = $_POST['sang_id'];
            $INNIHALD = $_POST['akkordir'];
            
            $INNIHALD = $mysqli->real_escape_string($INNIHALD);
            
            if($mysqli->query("UPDATE sangir SET sang_akkordir = \"$INNIHALD\" WHERE sang_id = $SANG_ID")){
                echo 1;
            }
            else {
                echo 0;
            }
        }
    }

?>