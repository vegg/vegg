<?php

require("samband.php");

header('Content-Type: text/html; charset=ISO-8859-15');

if($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli->connect_error;
}
else {
    $lesiSlag = $_POST['slag'];
    $lesiSlag = $mysqli->real_escape_string($lesiSlag);
    
    if($lesiSlag == "feed1") {
        $fyrisp = "SELECT * FROM feed WHERE feed_id = 1";
        lesEinaferd($mysqli,$fyrisp, "feed");
    }
    elseif($lesiSlag == "feed+") {
        $fyrisp = "SELECT * FROM feed WHERE feed_id = 1";
        polla($mysqli,$fyrisp,"feed");
    }
    elseif($lesiSlag == "akkfeed1") {
        $fyrisp = "SELECT * FROM akk_feed WHERE akk_feed_id = 1";
        lesEinaferd($mysqli,$fyrisp,"akkfeed");
    }
    elseif($lesiSlag == "akkfeed+") {
        $fyrisp = "SELECT * FROM akk_feed WHERE akk_feed_id = 1";
        polla($mysqli,$fyrisp,"akkfeed");
    }
    elseif($lesiSlag == "skrivafeed") {
        $FEED_ID = 1;
        $INNIHALD = $_POST['innihald'];
        $INNIHALD = $mysqli->real_escape_string($INNIHALD);
        $timestamp = microtime(true);
        
        $fyrisp = "UPDATE feed SET feed_innihald = \"$INNIHALD\", feed_timestamp = $timestamp WHERE feed_id = $FEED_ID";
        
        innskriva($mysqli,$fyrisp);
    }
    elseif($lesiSlag == "skrivaakkfeed") {
        $FEED_ID = 1;
        $INNIHALD = $_POST['innihald'];
        $AKKORDIR = $_POST['akkordir'];
        
        $INNIHALD = $mysqli->real_escape_string($INNIHALD);
        $AKKORDIR = $mysqli->real_escape_string($AKKORDIR);
        
        $timestamp = microtime(true);
        
        $fyrisp = "UPDATE akk_feed SET akk_innihald = \"$INNIHALD\", akk_akkordir = \"$AKKORDIR\", akk_timestamp = $timestamp WHERE akk_feed_id = $FEED_ID";
        
        innskriva($mysqli,$fyrisp);
    }
}

function lesEinaferd($mysqli, $fyrisp, $slag) {
    $fs = $mysqli->query($fyrisp);
    $tilfar = $fs->fetch_array(MYSQLI_ASSOC);
    tilfarTilGui($tilfar,$slag);
}

function polla($mysqli,$fyrisp, $slag) {
    if($slag == "feed") {
        $timestampKey = "feed_timestamp";
    }
    elseif($slag == "akkfeed") {
        $timestampKey = "akk_timestamp";
    }
    
    $fs = $mysqli->query($fyrisp);
    $tilfar = $fs->fetch_array(MYSQLI_ASSOC);
    $lastmodif = $currentTid = $tilfar[$timestampKey];
    $byrjunarTid = time();
    
    while($currentTid <= $lastmodif) {
        if(time() - $byrjunarTid > 20) {
            die("");
        }
        usleep(10000);
        clearstatcache();
        $fs = $mysqli->query($fyrisp);
        $tilfar = $fs->fetch_array(MYSQLI_ASSOC);
        $currentTid = $tilfar[$timestampKey];
    }
    
    tilfarTilGui($tilfar, $slag);
}

function innskriva($mysqli,$fyrisp) {
    $mysqli->set_charset("utf8");
    if($mysqli->query($fyrisp)) {
        echo 1;
    }
    else {
        echo 0;
    }
}

function tilfarTilGui($tilfar,$slag) {
    if($slag == "feed") {
        echo '{"ting": "' . $tilfar['feed_innihald'] . '"}';
    }
    elseif($slag == "akkfeed") {
        echo '{"sang" : '.$tilfar['akk_innihald'].', "akkordir" : '.$tilfar['akk_akkordir'].'}';
    }
}

?>