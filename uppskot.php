<?php
    require("samband.php");
    //$searchWord = $_GET['songid'];
    $searchWord = $_GET['key'];
    
    $searchWord = mysql_escape_string($searchWord);
    
    $output = "{";
    
    //$mysqli = new mysqli("localhost","vegg","1234","rachmaninoff");
    if($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    }
    else {
        //sql-query sum verður sent til databasan
        $leitan = $mysqli->query("SELECT * FROM sangir WHERE sang_tittul LIKE \"%$searchWord%\" OR sang_innihald LIKE \"%$searchWord%\"");
        
        //JSON objekt sum verður sent til front-end
        while($row = $leitan->fetch_assoc()) {
            $output = sprintf("$output\"%s\": {\"sang_tittul\":\"%s\"},", $row['sang_id'], $row['sang_tittul']);
        }
        
        $output = substr($output,0,-1);
        $output = $output . "}";
        
        echo $output;
    }
    
?>