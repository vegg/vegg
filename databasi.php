<?php

require("samband.php");

header('Content-Type: text/html; charset=UTF-8');
$mysqli->set_charset("utf8");

if($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli->connect_error;
}
else {
    $handling = $_POST['slag'];
    $handling = $mysqli->real_escape_string($handling);
    
    if($handling == "leita") {
        //$mysqli->set_charset("utf8");
        $leitiOrd = $_POST['key'];
        $leitiOrd = $mysqli->real_escape_string($leitiOrd);
        
        if($leitiOrd == "" or $leitiOrd == " " or $leitiOrd == null) {
            $fyrisp = "SELECT * FROM sangir WHERE 1=2";
        }
        else {
            $fyrisp = "SELECT * FROM sangir WHERE sang_tittul LIKE \"%$leitiOrd%\" OR sang_innihald LIKE \"%$leitiOrd%\" LIMIT 5";
        }
        
        leita($mysqli, $fyrisp);
    }
    elseif($handling == "takting") {
        $sangId = $_POST['key'];
        $sangId = $mysqli->real_escape_string($sangId);
        
        $fyrisp = "SELECT * FROM sangir WHERE sang_id = \"$sangId\"";
        
        takUrDB($mysqli,$fyrisp);
    }
    elseif($handling == "innskriva") {
        //$mysqli->set_charset("utf8");
        
        $sang_tittul = $_POST['yvirskrift'];
        $sang_innihald = $_POST['innihald'];
        $gerd = $_POST['gerd'];
        
        $sang_tittul = $mysqli->real_escape_string($sang_tittul);
        $sang_innihald = $mysqli->real_escape_string($sang_innihald);
        $gerd = $mysqli->real_escape_string($gerd);
        
        $sang_innihald = str_replace('\n((vers))\n', '((vers))', $sang_innihald);        
        $sang_innihald = str_replace('\n', '<br>', $sang_innihald);
        
        if($gerd == "nytt") {
            $fyrisp = "INSERT INTO sangir (sang_tittul,sang_innihald) VALUES(\"$sang_tittul\",\"$sang_innihald\")";
        }
        elseif($gerd=="broyt") {
            $sang_id = $_POST['sang_id'];
            $sangId = $mysqli->real_escape_string($sang_id);
            
            $fyrisp = "UPDATE sangir SET sang_tittul = \"$sang_tittul\", sang_innihald = \"$sang_innihald\" WHERE sang_id = \"$sang_id\"";
        }
        
        innskriva($mysqli,$fyrisp);
    }
    elseif($handling == "akkinnskriva") {
        $SANG_ID = $_POST['sang_id'];
        $INNIHALD = $_POST['akkordir'];
        $INNIHALD = $mysqli->real_escape_string($INNIHALD);
        
        $fyrisp = "UPDATE sangir SET sang_akkordir = \"$INNIHALD\" WHERE sang_id = $SANG_ID";
        
        innskriva($mysqli, $fyrisp);
    }
}

function leita($mysqli, $fyrisp) {
    $output = "{";
    $leitan = $mysqli->query($fyrisp);
    
    while($row = $leitan->fetch_assoc()) {
        $output = sprintf("$output\"%s\": {\"sang_tittul\":\"%s\"},", $row['sang_id'], $row['sang_tittul']);
    }
    
    $output = substr($output,0,-1);
    $output = $output . "}";
    
    echo $output;
}

function takUrDB($mysqli, $fyrisp) {
    $leitan = $mysqli->query($fyrisp);
    
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
    
    sendTilGUI($sangPettir, $row);
}

function innskriva($mysqli, $fyrisp) {
    if($mysqli->query($fyrisp)) {
        echo 1;
    }
    else {
        echo 0;
    }
}

function sendTilGUI($sangPettir, $row) {
    $output = sprintf("{\"sang\": {\"sang_id\":\"%s\", \"sang_tittul\":\"%s\", \"sang_innihald\":{%s}, \"sang_akkordir\":%s},",
                          $row['sang_id'] , $row['sang_tittul'], $sangPettir, $row['sang_akkordir']);
    
    $output = str_replace("\'", "'", $output);
    
    $output = substr($output,0,-1);
    $output = $output . "}";
    
    echo $output;
}

?>