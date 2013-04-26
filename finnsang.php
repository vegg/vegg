<?php
    require("samband.php");
    $sangId = $_GET['key'];
    $output = "{";
    
    //$mysqli = new mysqli("localhost","vegg","1234","rachmaninoff");
    if($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    }
    else {
        $leitan = $mysqli->query("SELECT * FROM sangir WHERE sang_id = \"$sangId\"");
        
        $row = $leitan->fetch_assoc();
        
        $innihald = $row['sang_innihald'];
        
        
        $pettir = explode("((vers))", $innihald);
        $sangPettir = "";
        $versNr = 1;
        
        foreach($pettir as $petti) {
            if(!$petti == "") {
                $sangPettir = "$sangPettir\"vers$versNr\":\"$petti\",";
            }
            $versNr++;
        }
        
        if($row['sang_akkordir'] == "") {
            $row['sang_akkordir'] = "{}";
        }
        
        $sangPettir = substr($sangPettir,0,-1);

        $output = sprintf("$output\"sang\": {\"sang_id\":\"%s\", \"sang_tittul\":\"%s\", \"sang_innihald\":{%s}, \"sang_akkordir\":%s},",
                          $row['sang_id'] , $row['sang_tittul'], $sangPettir, $row['sang_akkordir']);
        
        
        $output = str_replace("\'", "'", $output);
        
        $output = substr($output,0,-1);
        $output = $output . "}";
    }
    
    echo $output;
?>