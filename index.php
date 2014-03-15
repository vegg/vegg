<!DOCTYPE html>

<html>

<head>
    <link type="text/css" rel="stylesheet" href="style.css" />
    
    <script src="jquery.min.js"></script>
    <script type="text/javascript" src="lutir.js"></script>
    <script type="text/javascript" src="akkordskipan.js"></script>
    
    <meta charset="utf-8" />
    <title>Vegg</title>
</head>

<body>
    <div class="wrapper">
        <div class="upper">
            <a href="framvisari.php" target="_blank">Lat upp framv&iacute;sara</a> - <a href="akkord_framvisari.php" target="_blank">Lat upp akkordframv&iacute;sara</a> - 
            <a href="#" onclick="sangInnskrivari.byggSangInnskrivan();">N&yacute;ggjan sang</a>
            <div class="search">
                <img src="grafikkur/logo.jpg"><br><br>
                <form name="searchform">
                    <input id="search" class="searchbar" type="text" placeholder="Skriva navni&eth;, nummari&eth; ella onkran tekst &uacute;r sanginum, t&uacute; ynskir at finna." autocomplete="off" onkeyup="searcher.sendQuery();" />
                </form>
                <div id="searchsuggestiondropdown" class="searchsuggestiondropdown-closed">
                        <ul id="autocomplete-list"></ul>
                    </div>
                <div id="msg"></div>
            </div>
        </div>
        
        <div id="list">Skr&aacute;
            <ul id="list-list">
            </ul>
        </div>
        <div id="undansyning">Undans&yacute;ning<span id="framsynKnott"></span><span id="broytKnott"></span><span id="akkordKnott"></span>
            <div id="undansyning_tekst"></div>
        </div>
        <div id="actual">Frams&yacute;ning
            <div id="framsyning_tekst"></div>
        </div>
        <div id="preview_boxes">
            <div id="framsyning_vindeyga">Frams&yacute;ningarvindeyga
                <div id="preview_window_wrapper">
                    <div id="framsyningar_vindeyga_tekst"></div>
                </div>
            </div>
            <div id="preview_window">Undans&yacute;ningarvindeyga
                <div id="preview_window_wrapper">
                    <div id="preview_window_text"></div>
                </div>
            </div>
            
        </div>
    </div>
</body>

</html>