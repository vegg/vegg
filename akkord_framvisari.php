<!DOCTYPE html>
<html>
<head>
    <title>Akkordframs&yacute;ning</title>
    <script src="jquery.min.js"></script>
    <script src="akkordskipan.js"></script>
    
    
    <meta charset="utf-8" />
    <style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-size: 1.5em;
        }
        
        .akkord {
            position:absolute;
            top:-1em;
            z-index:-1;
        }
    </style>
</head>
<body>
    <script>
    
    $(document).ready(function(){
        akkordSkipan.tendra("akkfeed");
    });
    /*
    //http://techoctave.com/c7/posts/60-simple-long-polling-example-with-javascript-and-jquery
        $(document).ready(function(){
            framvisari_akkordSkipan.forceHeinta();
            framvisari_akkordSkipan.heinta();
        });
        
        var framvisari_akkordSkipan = {
            ollOrdini : [],
            akkordirISangi : {},
            dataFraFeed : "",
            ordSumErMarkerad : -1,
            fAkkord : {},
            fSangtekst : "",
            valdaVers : 1,
            akkordir1 : ["A","Bb","H","C","C#","D","D#","E","F","F#","G","G#"],
            akkordir2 : ["m", "7", "m7", "maj7", "m-maj7", "sus2", "sus4", "dimm", "aug"],
            akkordir3 : ["/A","/Bb","/H","/C","/C#","/D","/D#","/E","/F","/F#","/G","/G#"],
            transponering : 0,
            
            ruddaSkerm : function() {
                document.getElementById("sang").innerHTML = "";
            },
            
            heinta : function() {
                $.ajax({
                    url:"lesAkkFeed.php",
                    type: "post",
                    success:function(data) {
                        if(data != "") {
                            framvisari_akkordSkipan.ruddaSkerm();
                            $.each(data.sang, function(index, value) {
                                framvisari_akkordSkipan.valdaVers = index;
                                framvisari_akkordSkipan.fSangtekst = data.sang;
                                framvisari_akkordSkipan.fAkkord = data.akkordir;
                                framvisari_akkordSkipan.innVidSangi();
                            });
                        }
                    }, dataType: "json", complete: framvisari_akkordSkipan.heinta, timeout: 30000 });
            },
            
            forceHeinta : function() {
                $.ajax({
                    url:"forceLesAkkFeed.php",
                    
                    success:function(data) {
                        if(data != "") {
                            framvisari_akkordSkipan.ruddaSkerm();
                            $.each(data.sang, function(index, value) {
                                framvisari_akkordSkipan.valdaVers = index;
                                framvisari_akkordSkipan.fSangtekst = data.sang;
                                framvisari_akkordSkipan.fAkkord = data.akkordir;
                                framvisari_akkordSkipan.innVidSangi();
                            });
                        }
                    }, dataType: "json" });
            },
            
            innVidSangi : function() {
                var sangPlass;
                var undansyning_tekst;
                var i;
                var j;
                var bokstavurTilDOM;
                var bokstavsTekstur;
                var reglubrot;
                var millumrum;
                var millumrumTekstur;
                var allirBokstavirIOrdi = [];
                var akkordHaldari;
                
                //um hesi ikki verða nullaði, kunnu tey skapa óendalig loops í óvæntaðum støðum.
                this.ollOrdini = [];
                this.akkordirISangi = {};
                //document.getElementById("sang").innerHTML = "";
                
                sangPlass = document.createElement("div");
                sangPlass.setAttribute("class","sangPlass");
                
                this.pettaSangSundurIOrd();
                
                for(i=0; i<this.ollOrdini.length; i++) {
                    //Set ein akkordhaldara frammanfyri hvørt orð
                    akkordHaldari = document.createElement("span");
                    akkordHaldari.setAttribute("id", "akk"+this.valdaVers+"-"+(i+1));
                    akkordHaldari.setAttribute("style","position:absolute;");
                    sangPlass.appendChild(akkordHaldari.cloneNode());
                    
                    if(this.ollOrdini[i] == "<br>") {
                        reglubrot = document.createElement("br");
                        sangPlass.appendChild(reglubrot);
                        sangPlass.appendChild(reglubrot.cloneNode());
                    }
                    else {
                        allirBokstavirIOrdi = this.ollOrdini[i].split('');
                        for(j=0; j<allirBokstavirIOrdi.length; j++) {
                            bokstavurTilDOM = document.createElement("span");
                            bokstavsTekstur = document.createTextNode(allirBokstavirIOrdi[j]);
                            
                            bokstavurTilDOM.appendChild(bokstavsTekstur);
                            
                            bokstavurTilDOM.setAttribute("id", this.valdaVers + "-" + (i+1) + "-" + (j+1));
                            
                            sangPlass.appendChild(bokstavurTilDOM);
                            
                        }
                    }
                    
                    //Ger eitt millumrúm aftaná hvørt orð
                    millumrum = document.createElement("span");
                    millumrumTekstur = document.createTextNode(" ");
                    
                    millumrum.appendChild(millumrumTekstur);
                    
                    sangPlass.appendChild(millumrum);
                    
                    document.getElementById("sang").appendChild(sangPlass);
                }
                
                this.innVidAkkordum();
            },
            
            pettaSangSundurIOrd : function() {
                var i;
                var setningar = this.fSangtekst[framvisari_akkordSkipan.valdaVers].split('<br>');
                var sundurSkildOrd = [];
                
                //petta setningarnar sundur í orð, koyr teir saman í eitt array við <br> ímillum hvønn einstakan.
                for(i=0; i<setningar.length; i++) {
                    sundurSkildOrd = setningar[i].split(' ');
                    this.ollOrdini = this.ollOrdini.concat(sundurSkildOrd, '<br>');
                }
            },
            
            innVidAkkordum : function() {
                var versOgAkkordir = [];
                var akkordir = [];
                var einAkkord = [];
                var ordId;
                var akkordId;
                var i;
                
                if(this.akkordirISangi) {
                    $.each(this.fAkkord[this.valdaVers], function(index,value) {
                        framvisari_akkordSkipan.ordSumErMarkerad = index;
                        
                        framvisari_akkordSkipan.koyrAkkIdomOgAkkObj(value);
                    });
                    this.ordSumErMarkerad = 0;
                }
            },
            
            koyrAkkIdomOgAkkObj : function(akkordir) {
                var akkordHaldari;
                var tempAkk;
                var akkordTekstur = "";
                var vVers;
                var vOrd;
                
                //Koyr akkordir í DOM
                akkordHaldari = document.createElement("span");
                akkordHaldari.setAttribute("style","position:absolute;top:-1em;");
                
                if(akkordir[1] | akkordir[1] == "0") {
                    tempAkk = this.akkordir1[((akkordir[1] + framvisari_akkordSkipan.transponering)+(12*12)) % 12];
                }
                if(akkordir[2] | akkordir[2] == "0") {
                    tempAkk += this.akkordir2[akkordir[2]] + "";
                }
                
                akkordHaldari.appendChild(document.createTextNode(tempAkk));
                
                vVers = framvisari_akkordSkipan.valdaVers;
                vOrd = framvisari_akkordSkipan.ordSumErMarkerad;
                
                document.getElementById("akk"+vVers+"-"+vOrd).innerHTML = "";
                document.getElementById("akk"+vVers+"-"+vOrd).appendChild(akkordHaldari);
                
                //document.getElementById("akk"+"-"+framvisari_akkordSkipan.valdaVers+framvisari_akkordSkipan.ordSumErMarkerad).innerHTML = "";
                //document.getElementById("akk"+"-"+framvisari_akkordSkipan.valdaVers+framvisari_akkordSkipan.ordSumErMarkerad).appendChild(akkordHaldari);
            },
            
            transponera : function(uppEllaNidur) {
                if(uppEllaNidur == "+") {
                    framvisari_akkordSkipan.transponering++;
                }
                if(uppEllaNidur == "-") {
                    framvisari_akkordSkipan.transponering--;
                }
                
                framvisari_akkordSkipan.ruddaSkerm();
                framvisari_akkordSkipan.forceHeinta();
            },
            
            nullstillaTransponering : function() {
                framvisari_akkordSkipan.transponering = 0;
                framvisari_akkordSkipan.ruddaSkerm();
                framvisari_akkordSkipan.forceHeinta();
            }
        }
    */
    
    
    
    </script>
    
    <p id="sang"></p>
    <p>Transponera: <a href="#" onclick="akkordSkipan.transponera('upp')">+</a>
    <a href="#" onclick="akkordSkipan.transponera('nidur')">-</a>
    <a href="#" onclick="akkordSkipan.transponera('nullstilla')">0</a></p>
</body>
</html>