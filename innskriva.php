<?php
    require("samband.php");
    if($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    }
    else {
        //SKIFT MYSQL_ESCAPE_STRING ÚT VIÐ TAÐ NÝGGJA!!!
        $sang_id = $_POST['sang_id'];
        $sang_tittul = mysql_escape_string($_POST['yvirskrift']);
        $sang_innihald = mysql_escape_string($_POST['innihald']);
        $gerd = $_POST['gerd'];
        
        $sang_innihald = str_replace('\n((vers))\n', '((vers))', $sang_innihald);
        
        $sang_innihald = str_replace('\n', '<br>', $sang_innihald);
        
        
        if($gerd == "nytt") {
            if($mysqli->query("INSERT INTO sangir (sang_tittul,sang_innihald) VALUES(\"$sang_tittul\",\"$sang_innihald\")")) {
                echo 1;
            }
            else {
                echo 0;
            }
        }
        elseif($gerd=="broyt") {
            if($mysqli->query("UPDATE sangir SET sang_tittul = \"$sang_tittul\", sang_innihald = \"$sang_innihald\" WHERE sang_id = \"$sang_id\"")) {
                echo 1;
            }
            else {
                echo 0;
            }
        }
        

    }
?>