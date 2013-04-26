<?php
    require("samband.php");
    
    if($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    }
    else {
        //Eg skal nokk ikki brúka hetta her, men eg behaldi tað fyri sikkurheits skyld
        /*if(!$mysqli->set_charset("utf8")) {
            echo "Failed to set charset" . $mysqli->error;
        }
        else {
            
        }*/
        
        $urslit = $mysqli->query("SELECT * FROM feed WHERE feed_id = 1");
        
        $row = $urslit->fetch_array(MYSQLI_ASSOC);
        $lastmodif = $currentTid = $row['feed_timestamp'];
        $byrjunarTid = time();
        
        while($currentTid <= $lastmodif) {
            if(time() - $byrjunarTid > 20) {
                die("");
            }
            usleep(10000);
            clearstatcache();
            $urslitTid = $mysqli->query("SELECT * FROM feed WHERE feed_id = 1");
            $row = $urslitTid->fetch_array(MYSQLI_ASSOC);
            $currentTid = $row['feed_timestamp'];
        }
        
        $json = '{"ting" : "'.$row['feed_innihald'].'"}';
        
        $json = htmlentities($json, ENT_NOQUOTES);
        
        //grundin fyri hesum er at htmlentities konverterar < og >
        $json = str_replace('&lt;br&gt;', '<br>', $json);

        echo $json;
    }
?>