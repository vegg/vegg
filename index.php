<!DOCTYPE html>

<html>

<head>
    <link type="text/css" rel="stylesheet" href="style.css" />
    
    <script src="jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="lutir.js"></script>
    
    <meta charset="utf-8" />
    <title>Veggur 0.3</title>
</head>

<body>
    <div class="wrapper">
        <a href="framvisari.php" target="_blank">Lat upp framv&iacute;sara</a> - <a href="akkord_framvisari.php" target="_blank">Lat upp akkordframv&iacute;sara</a> - 
        <a href="#" onclick="sangInnskrivari.byggSangInnskrivan();">N&yacute;ggjan sang</a>
        <section class="search">
            <h1>Vegg</h1><br/>
            <form name="searchform">
                <input id="search" class="searchbar" type="text" placeholder="Skriva navni&eth;, nummari&eth; ella onkran tekst &uacute;r sanginum, t&uacute; ynskir at finna." autocomplete="off" onkeydown="searcher.sendQuery();" />
                <br>
                <section id="searchsuggestiondropdown" class="searchsuggestiondropdown-closed">
                    <ul id="autocomplete-list"></ul>
                </section>
            </form>
            <section id="super"></section>
        </section>
        <section id="list">Skr&aacute;
            <ul id="list-list">
            </ul>
        </section>
        <section id="undansyning">Undans&yacute;ning<span id="framsynKnott"></span><span id="broytKnott"></span><span id="akkordKnott"></span>
            <section id="undansyning_tekst"></section>
        </section>
        <section id="actual">Frams&yacute;ning
            <section id="framsyning_tekst"></section>
        </section>
        <section id="preview_boxes">
            <section id="framsyning_vindeyga">Frams&yacute;ningarvindeyga
                <div id="preview_window_wrapper">
                    <section id="framsyningar_vindeyga_tekst"></section>
                </div>
            </section>
            <section id="preview_window">Undans&yacute;ningarvindeyga
                <div id="preview_window_wrapper">
                    <section id="preview_window_text"></section>
                </div>
            </section>
            
        </section>
    </div>
    
    <footer></footer>
</body>

</html>