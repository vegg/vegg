//Heldur skil � �llum sum hevur vi� leitikassan at gera
searchBox = function() {
    //VARIABLAR
    this.isClean = false;
    
    //FUNKTI�NIR
    //sendir eitt query til php-scripti� uppskot.php og f�r sang tittulin aftur sum JSON
    this.sendQuery = function() {
        this.search = document.getElementById("search").value;
        
        //eg m� finna onkran m�ta reinsa input upp� ein fornuftigan m�ta, so ikki allar databasin ver�ur dumped � einum
        //if(this.search.length > 0) {
            $('#autocomplete-list').html('');
            
            $.getJSON('uppskot.php?key=' + this.search + '',
                function(output) {
                    $.each(output, function(key,val) {
                        $('#autocomplete-list').append('<a href="#" onclick="skra.fetchSong('+key+');"><li>'+val['sang_tittul']+'</li></a>');
                        $('#searchsuggestiondropdown').attr('class', 'searchsuggestiondropdown-open');
                    });
                });
       // }
    };
    
    //Ruddar leitikassan t� tr�st ver�ur � hann
    this.clearBox = function() {
        if(!this.isClean) {
            document.getElementById("search").value = "";
            this.isClean = true;
        }
    };
};


var skra = {
    //VARIABLAR
    songKeeper : [], //http://blog.jcoglan.com/2007/07/23/writing-a-linked-list-in-javascript/
    songMenuNum : 0,
    
    //FUNKTI�NIR
    fetchSong : function(songId) {
        $.getJSON('finnsang.php?key=' + songId+ '',
        function(output) {
            $.each(output, function(key,val) {
                var songKey = "lis" + skra.songMenuNum;
                skra.songKeeper.push(output);
                
                $('#list-list').append('<li id="'+songKey+'"><a id="'+songKey+'_lnk" href="#" onclick="undansyning.sendTilUndansyning(\''+
                                       songKey+'\');">'+val['sang_tittul']+'</a> - <a href="#" onclick="skra.strikaILista(\''+songKey+
                                       '\');">X</a><a href="#" onclick="framsyning.koyrIFramsyning('+skra.songMenuNum+
                                       ')"><img src="grafikkur/kanon.bmp" style="position:relative;top:5px;left:5px;"></a></li>');
                skra.songMenuNum++;
            });
        });
        //T�m leitikassan
        document.getElementById("search").value = "";
        document.getElementById("autocomplete-list").innerHTML = "";
        $('#searchsuggestiondropdown').attr('class', 'searchsuggestiondropdown-closed');
    },
    
    strikaILista : function(id) { 
        $("#"+id).remove();
        delete skra.songKeeper[id[3]];
        
        //Koyr sangin vekk �r frams�ning
        if(framsyning.UI_SANG_NR_I_BRUKI == id[3]) {
            framsyning.ruddaFramsyning();
            framsyning.ruddaStorskyggja();
        }
        
        //Koyr sangin vekk �r undans�ning.
        if(undansyning.VALDUR_SANGUR == id[3]) {
            undansyning.skapaUndansyning();
            undansyning.ruddaUndansyningarvindeyga();
        }
    }
};


var searcher = new searchBox();

var undansyning = {
    VERS_NOGD : 0,
    VALDUR_SANGUR : -1,
    valdur_sangurDB : 0,
    
    sendTilUndansyning : function (sangNr) {
        this.VERS_NOGD = 0;
        
        if(!document.getElementById("undansyning_tekst")) {
            this.skapaUndansyning();
        }
        
        var i = 1;
        var fullSong = "";
        sangNr = parseInt(sangNr[3]); //3, t� tali� er char nr 3 � stronginum
        
        this.skapaFramsynKnott(sangNr);
        this.skapaBroytKnott(sangNr);
        //this.skapaAkkordKnott(sangNr);
        
        //koyr versini inn� undans�ning
        for(var key in skra.songKeeper[sangNr]['sang']['sang_innihald']) {
            fullSong += "<p id='us_vers"+i+"' onclick='undansyning.sendToPreviewWindow(\""+i+"\",\"fast\");'>" + skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+i]+ "</p>";
            i++;
            this.VERS_NOGD++;
        }
        document.getElementById("undansyning_tekst").innerHTML = fullSong;
        
        this.VALDUR_SANGUR = sangNr;
        this.valdur_sangurDB = skra.songKeeper[sangNr]['sang']['sang_id'];
    },
    
    sendToPreviewWindow : function(versNummar, stoda) {
        var sang;
        //Hetta kemur fr� undans�ning har eg IKKI eri � fer� vi� at broyta naka�.
        if(stoda == "fast") {
            sang = document.getElementById("us_vers"+versNummar).innerHTML;            
            sang = sang.replace(/\n/g, "<br>");
            
            document.getElementById("preview_window_text").innerHTML = sang;
        }
        //Hetta kemur fr� undans�ning t� eg eri � fer� vi� at broyta okkurt
        if(stoda == "broytiligt") {
            sang = document.getElementById("ns_vers"+versNummar).value;
            sang = sang.replace(/\n/g, "<br>");
            
            document.getElementById("preview_window_text").innerHTML = sang;
        }
    },
    
    ruddaUndansyningarvindeyga : function() {
        document.getElementById("preview_window_text").innerHTML = "";
    },
    
    skapaFramsynKnott : function(sangNr) {
        document.getElementById("framsynKnott").innerHTML = '<a href="#" onclick="framsyning.koyrIFramsyning(\''+sangNr+'\')">Frams&yacute;n</a> - ';
    },
    
    skapaBroytKnott : function(sangNr) {
        document.getElementById("broytKnott").innerHTML = '<a href="#" onclick="sangInnskrivari.byggSangBroytara(\''+sangNr+'\');">Broyt sangtekst - </a>';
    },
    
    skapaAkkordKnott : function(sangNr) {
        document.getElementById("akkordKnott").innerHTML = '<a href="#" onclick="akkordSkipan.innVidSangi(\''+sangNr+'\');">Akkordir</a>';
    },
    
    skapaUndansyning : function() {
        var undansyning = 'Undans&yacute;ning<span id="framsynKnott"></span><span id="broytKnott"></span><span id="akkordKnott"></span><section id="undansyning_tekst"></section>';
        document.getElementById("undansyning").innerHTML = undansyning;
        this.endurskapaGomluStodd();
    },
    
    gevPlassFyriSkriving : function() {
        document.getElementById("undansyning").style.width = "410px";
        document.getElementById("actual").style.width = "190px";
        
        //Stytt tekstin fyri hv�rt vers � frams�ning
        framsyning.styttOllVers();
    },
    
    endurskapaGomluStodd : function() {
        document.getElementById("undansyning").style.width = "300px";
        document.getElementById("actual").style.width = "300px";
        
        framsyning.endurskapaOllVers();
    },
    
    broytBakgrundsLitAEinumBroytiTekstkassa : function(aktiveradur, vers_nr) {
        if(aktiveradur == "true") {
            document.getElementById(vers_nr).style.backgroundColor = "#ABABAB";
        }
        if(aktiveradur == "false") {
            document.getElementById(vers_nr).style.backgroundColor = "#FFFFFF";
        }
    },
    
    //Tel hvussu n�gv reglubrot eru � versinum og stilla h�ddina � kassanum eftir t�
    stillaBroytingarKassaHaedd : function(kassi) {
        var reglubrotNogd;
        var vers = document.getElementById("ns_vers"+kassi).value;
        
        reglubrotNogd = vers.match(/\n/g);
        
        reglubrotNogd = reglubrotNogd ? reglubrotNogd.length : 1;
        
        document.getElementById("ns_vers"+kassi).removeAttribute("style");
        
        document.getElementById("ns_vers"+kassi).setAttribute("rows",reglubrotNogd);
    },
    
    sundurDeilVers : function(UIVersNr) {
        var pos = document.getElementById("ns_vers"+UIVersNr).selectionEnd;
        var vers = document.getElementById("ns_vers"+UIVersNr).value;
        var fyribilsVersNr = this.VERS_NOGD;
        var fyrstiPartur;
        var seinniPartur;
        
        //Sundurdeil um mark�rurin IKKI er fremst ella aftast � versinum. T.e. ta� er okkurt at deila.
        if(pos > 0 && pos != vers.length) {
            
            //uppdatera versnummari fyri eftirfylgjandi versum, um ta� er naka�.
            if(UIVersNr != this.VERS_NOGD) {
                
                //GG. Ta� byrjar vi� seinasta versinum!
                while(fyribilsVersNr > UIVersNr) {
                    document.getElementById("ns_vers"+fyribilsVersNr).setAttribute("onkeyup","undansyning.sendToPreviewWindow("+(fyribilsVersNr+1)+",'broytiligt')");
                    document.getElementById("ns_vers"+fyribilsVersNr).setAttribute("onclick","undansyning.sendToPreviewWindow("+(fyribilsVersNr+1)+",'broytiligt')");
                    
                    document.getElementById("ns_vers"+fyribilsVersNr).setAttribute("id","ns_vers"+(fyribilsVersNr+1));
                    document.getElementById("vers_uttan"+fyribilsVersNr).setAttribute("id","vers_uttan"+(fyribilsVersNr+1));
                    
                    document.getElementById("vers_samanlegg"+fyribilsVersNr).setAttribute("onclick","undansyning.samanleggVersUppeftir("+(fyribilsVersNr+1)+")");
                    document.getElementById("vers_samanlegg"+fyribilsVersNr).setAttribute("id","vers_samanlegg"+(fyribilsVersNr+1));
                    
                    document.getElementById("vers_deil"+fyribilsVersNr).setAttribute("onclick","undansyning.sundurDeilVers("+(fyribilsVersNr+1)+")");
                    document.getElementById("vers_deil"+fyribilsVersNr).setAttribute("id","vers_deil"+(fyribilsVersNr+1));
                    
                    fyribilsVersNr--;
                }
            }
            
            //Deil versi� sundur � tveir partar.
            fyrstiPartur = vers.substring(0,pos);
            seinniPartur = vers.substring(pos,vers.length);
            
            //legg ein kassa aftrat t� sundurskilda versinum
            $('<li id="vers_uttan'+(UIVersNr+1)+'"><textarea id="ns_vers'+(UIVersNr+1)+'" class="sang_innihald" onclick="undansyning.sendToPreviewWindow('+(UIVersNr+1)+',\'broytiligt\')" onkeyup="undansyning.sendToPreviewWindow('+(UIVersNr+1)+',\'broytiligt\')">'+seinniPartur+'</textarea>'+
                '<p style="float:right;margin-top:0px;margin-right:15px;"><a id="vers_samanlegg'+(UIVersNr+1)+
                    '" href="#" onclick="undansyning.samanleggVersUppeftir('+(UIVersNr+1)+
                    ')">+</a><br><a id="vers_deil'+(UIVersNr+1)+'" href="#" onclick="undansyning.sundurDeilVers('+(UIVersNr+1)+
                    ')"><></a></p></li>').insertAfter("#vers_uttan"+UIVersNr+"");
            
            
            this.stillaBroytingarKassaHaedd(UIVersNr+1);
            
            //endurn�ggja innihald � "gamla" kassanum
            document.getElementById("ns_vers"+UIVersNr).value = fyrstiPartur;
            this.stillaBroytingarKassaHaedd(UIVersNr);
            
            this.VERS_NOGD++;
        }//SUNDURDEILING LI�UG.
    },

    samanleggVersUppeftir : function(UIVersNr) {
        var nidaraVers = document.getElementById("ns_vers"+UIVersNr).value;
        var fyribilsVersNr = UIVersNr+1;
        
        if(document.getElementById("ns_vers"+(UIVersNr-1))) {
            document.getElementById("ns_vers"+(UIVersNr-1)).value = document.getElementById("ns_vers"+(UIVersNr-1)).value + "\n" + nidaraVers;
            this.stillaBroytingarKassaHaedd(UIVersNr-1);
            
            $('#vers_uttan'+UIVersNr).remove();
            
            //broyt id � eftirfylgjandi versum
            while(fyribilsVersNr <= this.VERS_NOGD) {
                document.getElementById("ns_vers"+fyribilsVersNr).setAttribute("onkeyup","undansyning.sendToPreviewWindow("+(fyribilsVersNr-1)+",'broytiligt')");
                document.getElementById("ns_vers"+fyribilsVersNr).setAttribute("onclick","undansyning.sendToPreviewWindow("+(fyribilsVersNr-1)+",'broytiligt')");
                
                document.getElementById("ns_vers"+fyribilsVersNr).setAttribute("id","ns_vers"+(fyribilsVersNr-1))
                document.getElementById("vers_uttan"+fyribilsVersNr).setAttribute("id","vers_uttan"+(fyribilsVersNr-1))
                
                document.getElementById("vers_samanlegg"+fyribilsVersNr).setAttribute("onclick","undansyning.samanleggVersUppeftir("+(fyribilsVersNr-1)+")");
                document.getElementById("vers_samanlegg"+fyribilsVersNr).setAttribute("id","vers_samanlegg"+(fyribilsVersNr-1));
                
                document.getElementById("vers_deil"+fyribilsVersNr).setAttribute("onclick","undansyning.sundurDeilVers("+(fyribilsVersNr-1)+")");
                document.getElementById("vers_deil"+fyribilsVersNr).setAttribute("id","vers_deil"+(fyribilsVersNr-1));
                
                fyribilsVersNr++;
            }
            
            this.VERS_NOGD--;
        }//SAMANLEGGING LI�UG
    }
};

var framsyning = {
    hevurInnihald : false,
    UI_SANG_NR_I_BRUKI : -1,
    
    koyrIFramsyning : function(sangNr) {
        var i = 1;
        var fullSong = "";
        
        for(var key in skra.songKeeper[sangNr]['sang']['sang_innihald']) {
            fullSong += "<p id='fs_vers"+i+"' onclick='framsyning.koyrAStorskyggja(\""+sangNr+"\",\""+i+"\")'>" + skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+i]+ "</p>";
            i++;
        }
        document.getElementById("framsyning_tekst").innerHTML = fullSong;
        
        this.hevurInnihald = true;
        this.UI_SANG_NR_I_BRUKI = sangNr;
    },
    
    ruddaFramsyning : function() {
        document.getElementById("framsyning_tekst").innerHTML = "";
        this.hevurInnihald = false;
        this.UI_SANG_NR_I_BRUKI = -1;
    },
    
    //stytt versini solei�is at bara 80 chars eru v�st
    styttOllVers : function() {
        var i = 1;
        var fullSong = "";
            
        if(this.hevurInnihald) {
            for(var key in skra.songKeeper[this.UI_SANG_NR_I_BRUKI]['sang']['sang_innihald']) {
                fullSong += "<p id='fs_vers"+i+"' onclick='framsyning.koyrAStorskyggja(\""+this.UI_SANG_NR_I_BRUKI+"\",\""+i+"\")'>"
                    + skra.songKeeper[this.UI_SANG_NR_I_BRUKI]['sang']['sang_innihald']['vers'+i].substring(0,80) + "..." + "</p>";
                i++;
            }
            document.getElementById("framsyning_tekst").innerHTML = fullSong;
        }
    },
    
    endurskapaOllVers : function() {
        var i = 1;
        var fullSong = "";
            
        if(this.hevurInnihald) {
            for(var key in skra.songKeeper[this.UI_SANG_NR_I_BRUKI]['sang']['sang_innihald']) {
                fullSong += "<p id='fs_vers"+i+"' onclick='framsyning.koyrAStorskyggja(\""+this.UI_SANG_NR_I_BRUKI+"\",\""+i+"\")'>"
                    + skra.songKeeper[this.UI_SANG_NR_I_BRUKI]['sang']['sang_innihald']['vers'+i] + "</p>";
                i++;
            }
            document.getElementById("framsyning_tekst").innerHTML = fullSong;
        }
    },
    
    koyrAStorskyggja : function(sangNr, versNr) {
        this.koyrIJSFeed(sangNr,versNr);
        this.koyrIAkkFeed(sangNr,versNr);
        this.koyrIFramsyningarVindeyga(sangNr,versNr);
    },
    
    ruddaStorskyggja : function() {
        this.ruddaJSFeed();
        this.ruddaFramsyningarVindeyga();
    },
    
    koyrIJSFeed : function(sangNr, versNr) {
        var sang = skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+versNr];
        
        //sang = sang.replace("\n", /<br>/g);
        
        //Skriva til databasa
        $.post("innskrivafeed.php", {"innihald":sang});
    },
    
    koyrIAkkFeed : function(sangNr, versNr) {
        //var sang = skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+versNr];
        var sang = {};
        var akkordir = skra.songKeeper[sangNr]['sang']['sang_akkordir'];
        
        $.each(akkordir, function(index, value) {
            //sang[index] = akkordir[index];
            sang[index] = skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+index];
        });
        
        akkordir = JSON.stringify(akkordir);
        sang = JSON.stringify(sang);
        
        if(akkordir) {
            $.post("innskrivaakkfeed.php", {"innihald":sang, "akkordir":akkordir});
        }
    },
    
    ruddaJSFeed : function() {
        $.post("innskrivafeed.php", {"innihald":""});
    },
    
    koyrIFramsyningarVindeyga : function(sangNr, versNr) {
        var sang = skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+versNr];
        
        sang = sang.replace(/\n/g, "<br>");
        
        document.getElementById("framsyningar_vindeyga_tekst").innerHTML = sang;
    },
    
    ruddaFramsyningarVindeyga : function() {
        document.getElementById("framsyningar_vindeyga_tekst").innerHTML = "";
    }
}

var sangInnskrivari = {
    byggSangInnskrivan : function() {
        var i=1;
        var sangInnskrivan = '<div id="sang-innskrivan">Innskriva n&yacute;ggjan sang <span id="goymSangHaldari"><a href="#" onclick="sangInnskrivari.innskrivaSang(\'nytt\');">Goym sang</a></span>'+
                                '<ul>'+
                                    'Navn<br><input id="sang_yvirskrift">' +
                                '</ul>'+
                                '<ul>'+
                                    'Sangtekstur<br><div id="sang_innihald"></div>' +
                                '</ul>'+
                             '</div>';
        
        undansyning.gevPlassFyriSkriving();
        
        document.getElementById("undansyning").innerHTML = sangInnskrivan;
        document.getElementById("sang_innihald").innerHTML = '<ul id="vers_haldari"></ul>';
        
        document.getElementById("vers_haldari").innerHTML +=
            '<li id="vers_uttan'+i+'">'+    
                '<textarea id="ns_vers'+i+'" wrap="hard" class="sang_innihald" onclick="undansyning.sendToPreviewWindow('+i+',\'broytiligt\')" onkeyup="undansyning.stillaBroytingarKassaHaedd('+i+');undansyning.sendToPreviewWindow('+i+',\'broytiligt\')"></textarea>' +
                '<p style="float:right;margin-top:0px;margin-right:15px;"><a id="vers_samanlegg'+i+'" href="#" onclick="undansyning.samanleggVersUppeftir('+i+
                    ')">+</a><br><a id="vers_deil'+i+'" href="#" onclick="undansyning.sundurDeilVers('+i+')"><></a></p>'+
            '</li>';
        
        undansyning.VERS_NOGD = 1;
    },
    
    //Koyr eina broytis��u � undans�ning kassan saman vi� einum sangi.
    //Argumentir: UI-Sangnummari � t� valda sanginum.
    byggSangBroytara : function(sangNr) {
        var i=1;
        var vers;
        var reglubrotNogd;
        var dbas_id = skra.songKeeper[sangNr].sang.sang_id;
        var sangBroytari =  '<div id="sang-broytari">Broyt sang <span><a href="#" onclick="sangInnskrivari.innskrivaSang(\'broyt\',\''+sangNr+'\');">Goym broyting</a></span>'+
                                '<ul><input id="databasu_id" type="hidden" value="'+dbas_id+'">' +
                                    '<li>Navn<br><input id="sang_yvirskrift" type="text"></li>' +
                                    '<li>Sangtekstur<br>' +
                                    '<div id="sang_innihald"></div>' +
                                '</ul>' +
                            '</div>';
        
        undansyning.gevPlassFyriSkriving();
        document.getElementById("undansyning").innerHTML = sangBroytari;
        
        document.getElementById("sang_yvirskrift").value = skra.songKeeper[sangNr]['sang']['sang_tittul'];
        
        document.getElementById("sang_innihald").innerHTML = '<ul id="vers_haldari"></ul>';
        
        //Skriva versini inn, hv�rt � s�n tekstkassa
        for(var key in skra.songKeeper[sangNr]['sang']['sang_innihald']) {
            vers = skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+i];
            
            //broyt �ll html break til reglubrot.
            vers = vers.replace(/<br>/g, "\n");
            
            //Stillar eitt "((vers))" �millum hv�rt vers (Ikki br�kt meira!)
            /*if(skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+(i+1)]) {
                vers += "\n((vers))\n";
            }*/
            
            //Koyr tekstkassan saman vi� t� r�tta versinum inn� DOM.
            document.getElementById("vers_haldari").innerHTML +=
            '<li id="vers_uttan'+i+'">'+
                '<textarea id="ns_vers'+i+'" wrap="hard" class="sang_innihald" onclick="undansyning.sendToPreviewWindow('+i+',\'broytiligt\')" onkeyup="undansyning.stillaBroytingarKassaHaedd('+i+');undansyning.sendToPreviewWindow('+i+',\'broytiligt\')">' + vers + '</textarea>' +
                '<br><a id="vers_samanlegg'+i+'" href="#" onclick="undansyning.samanleggVersUppeftir('+i+
                    ')">+</a> - <a id="vers_deil'+i+'" href="#" onclick="undansyning.sundurDeilVers('+i+
                    ')" onmouseover="undansyning.broytBakgrundsLitAEinumBroytiTekstkassa(\'true\',\'ns_vers'+i+
                    '\')" onmouseout="undansyning.broytBakgrundsLitAEinumBroytiTekstkassa(\'false\',\'ns_vers'+i+'\')"><></a> '+
                    '<a href="#" onclick="akkordSkipan.innVidSangi(\''+sangNr+'\',\''+i+'\')" onmouseover="undansyning.broytBakgrundsLitAEinumBroytiTekstkassa(\'true\',\'ns_vers'+i+
                    '\')" onmouseout="undansyning.broytBakgrundsLitAEinumBroytiTekstkassa(\'false\',\'ns_vers'+i+'\')">Akkordir</a>' +
            '</li>';
            
            undansyning.stillaBroytingarKassaHaedd(i);
            
            i++;
        }
    },
    
    innskrivaSang : function(gerd,UIsangId) {
        var yvirskrift = document.getElementById("sang_yvirskrift").value;
        var innihald = "";
        var i = 1;
        var j = 1;
        var fyribils_vers;
        
        if(gerd == "broyt") {
            var DBsang_id = document.getElementById("databasu_id").value;
        }
        
        //uppdatera sangin � DB
        for(i = 1; i<=undansyning.VERS_NOGD; i++) {
            innihald += (i != undansyning.VERS_NOGD) ? document.getElementById("ns_vers" + i).value + "((vers))" : document.getElementById("ns_vers" + i).value;
        }
        
        $.post("innskriva.php", {"sang_id":DBsang_id, "yvirskrift":yvirskrift, "innihald":innihald, "gerd":gerd});
        
        //uppdatera sangin � UI, um talan er um eina broyting
        if(gerd=="broyt") {
            skra.songKeeper[UIsangId].sang.sang_tittul = yvirskrift;
            
            //� t� f�ri at br�karin vil sletta eitt vers, koyr allan sangin vekk fyri fyrst
            skra.songKeeper[UIsangId].sang.sang_innihald = {};
            
            for(j=1;j<=undansyning.VERS_NOGD;j++) {
                fyribils_vers = document.getElementById("ns_vers"+j).value;
                
                fyribils_vers = fyribils_vers.replace(/\n/g, "<br>");
                
                skra.songKeeper[UIsangId].sang['sang_innihald']['vers'+j] = fyribils_vers;
            }
            
            document.getElementById("lis"+UIsangId+"_lnk").innerHTML = yvirskrift;
        }
        
        //lat sangin upp av n�ggjum
        if(gerd == "broyt") {
            undansyning.sendTilUndansyning('lis'+UIsangId);
        }
    }
}

var akkordSkipan = {
    vers : -1,
    ollOrdini : [],
    ordSumErMarkerad : null,
    ordSumErMinkad : null,
    bokstavurSumErMarkeradur : null,
    bokstavamongIMinkadumOrdi : null,
    markeringByrjan : null,
    markeringEndi : null,
    akkordir1 : ["A","Bb","H","C","C#","D","D#","E","F","F#","G","G#"],
    akkordir2 : ["m", "7", "m7", "maj7", "m-maj7", "sus2", "sus4", "dimm", "aug"],
    akkordir3 : ["/A","/Bb","/H","/C","/C#","/D","/D#","/E","/F","/F#","/G","/G#"],
    akkordirISangi : {},
    akkordUndirGerd : {},
    
    // 1. Funkti�nir til at legga sangin inn� GUI
    innVidSangi : function(UISangId, versId) {
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
        var jFylg;
        var akkordHaldari;
        var goymLink;
        
        //um hesi ikki ver�a nulla�i, kunnu tey skapa �endalig loops � �v�nta�um st��um.
        this.ollOrdini = [];
        this.ordSumErMarkerad = null;
        this.ordSumErMinkad = null;
        this.bokstavurSumErMarkeradur = null;
        this.bokstavamongIMinkadumOrdi = null;
        this.markeringByrjan = null;
        this.markeringEndi = null;
        this.akkordirISangi = {};
        
        sangPlass = document.createElement("div");
        sangPlass.setAttribute("class","sangPlass");
        
        if(document.getElementById("undansyning_tekst")) {
            document.getElementById("undansyning_tekst").innerHTML = "";
        }
        else {
            undansyning.skapaUndansyning();
        }
        
        goymLink = document.createElement("a");
        goymLink.setAttribute("href","#");
        goymLink.setAttribute("onclick","akkordSkipan.goymAkkordir();");
        goymLink.appendChild(document.createTextNode("Goym"));
        document.getElementById("akkordKnott").innerHTML = "";
        document.getElementById("akkordKnott").appendChild(goymLink);
        
        jFylg = document.createElement("div");
        jFylg.setAttribute("id","jFylg");
        sangPlass.appendChild(jFylg);
        
        this.pettaSangSundurIOrd(UISangId,versId);
        
        for(i=0; i<this.ollOrdini.length; i++) {
            //Set ein akkordhaldara frammanfyri hv�rt or�
            akkordHaldari = document.createElement("span");
            akkordHaldari.setAttribute("id", "akk"+(i+1));
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
                    
                    bokstavurTilDOM.setAttribute("id", (i+1) + "-" + (j+1));
                    bokstavurTilDOM.setAttribute("class", "musIkkiYvir");
                    bokstavurTilDOM.setAttribute("onmouseover", "akkordSkipan.markeraOrd("+(i+1)+","+(j+1)+"); akkordSkipan.innsetMinkaraOgStorrara("+(i+1)+","+(j+1)+")");
                    bokstavurTilDOM.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara("+(i+1)+","+(j+1)+",1)");
                    
                    sangPlass.appendChild(bokstavurTilDOM);
                    
                }
            }
            
            //Ger eitt millumr�m aftan� hv�rt or�
            millumrum = document.createElement("span");
            millumrumTekstur = document.createTextNode(" ");
            
            millumrum.appendChild(millumrumTekstur);
            
            sangPlass.appendChild(millumrum);
            
            document.getElementById("undansyning_tekst").appendChild(sangPlass);
            
            this.vers = versId;
        }
        
        this.innVidAkkordum(UISangId, versId);
    },
    
    innVidAkkordum : function(UISangId, versId) {
        var versOgAkkordir = [];
        var akkordir = [];
        var einAkkord = [];
        var ordId;
        var akkordId;
        var i;
        
        if(skra.songKeeper[UISangId] && skra.songKeeper[UISangId].sang.sang_akkordir[versId]) {
            $.each(skra.songKeeper[UISangId].sang.sang_akkordir[versId], function(index,value) {
                akkordSkipan.ordSumErMarkerad = index;
                /*if(value[1] + "") {
                    akkordSkipan.velAkkord(value[1]+"", 1);
                }
                if(value[2] + "") {
                    akkordSkipan.velAkkord(value[2]+"", 2);
                }*/
                
                akkordSkipan.koyrAkkIdomOgAkkObj(value);
            });
            akkordSkipan.ordSumErMarkerad = 0;
        }
    },
    
    pettaSangSundurIOrd : function(UISangId,versId) {
        var i;
        var setningar = skra.songKeeper[UISangId].sang.sang_innihald['vers'+versId].split('<br>');
        var sundurSkildOrd = [];
        
        //petta setningarnar sundur � or�, koyr teir saman � eitt array vi� <br> �millum hv�nn einstakan.
        for(i=0; i<setningar.length; i++) {
            sundurSkildOrd = setningar[i].split(' ');
            this.ollOrdini = this.ollOrdini.concat(sundurSkildOrd, '<br>');
        }
    },
    
    innsetMinkaraOgStorrara : function(ordId, bokstavId) {
        var p = $("#"+ ordId+ "-" +bokstavId);
        var position = p.position();
        
        var vinstra = position.left-10;
        var ovara = position.top+20;
        
        document.getElementById("jFylg").style.position = "absolute";
        document.getElementById("jFylg").style.top = ovara + "px";
        document.getElementById("jFylg").style.left = vinstra + "px";
        document.getElementById("jFylg").innerHTML =
            '<a href="#" onclick="akkordSkipan.vidkaMarkering('+ordId+', '+bokstavId+')" ><img src="grafikkur/pluss.png" style="z-index:2"></a><a href="#" onclick="akkordSkipan.minkaMarkering('+ordId+','+bokstavId+')"><img src="grafikkur/minus.png" style="z-index:2"></a>';
    },
    
    // 2. Funkti�nir til at markera or� og stilla markeringina
    
    markeraOrd: function(ordId, bokstavId) {
        var i = 1;
        var j = 1;
        var halvMarkering = Math.floor(this.bokstavamongIMinkadumOrdi / 2);
        var bakkilongd = halvMarkering;
        var markeringByrjan;
        
        //Strika alla fyrrverandi markering.
        if(this.ordSumErMarkerad) {
            this.strikaMarkering(this.ordSumErMarkerad);
            this.ordSumErMarkerad = 0;
        }
        
        if(ordId == this.ordSumErMinkad) {
            if(document.getElementById(ordId + "-" + (bokstavId-bakkilongd))) { //Um markeringin heldur seg innanfyri or�i� � vinstru s��u.
                j = bokstavId-bakkilongd;
                this.markeringByrjan = j;
                if(document.getElementById(ordId + "-" + (j + this.bokstavamongIMinkadumOrdi-1))) { //Um markeringin heldur seg innanfyri or�i� � h�gru s��u.
                    this.markeringEndi = j + this.bokstavamongIMinkadumOrdi - 1;
                    while(i < this.bokstavamongIMinkadumOrdi) {
                        document.getElementById(ordId + "-" + j).setAttribute('class', 'musYvir');
                        i++;
                        j++;
                    }
                }
                else {
                    //flyt alla markeringina so n�gv pl�ss til vinstru sum er ney�ugt.
                    this.markeraOrd(ordId, bokstavId - ((j + this.bokstavamongIMinkadumOrdi) - this.telBokstavirIOrdi(ordId)));
                }
            }
            else if(bokstavId - bakkilongd < 0) {
                //flyt alla markeringina so n�gv pl�ss til h�gru sum er ney�ugt.
                this.markeraOrd(ordId, ((bokstavId-bakkilongd)*-1) + bokstavId);
            }
        }
        else {
            while(document.getElementById(ordId + "-" + j)) {
                document.getElementById(ordId + "-" + j).setAttribute('class', 'musYvir');
                j++;
            }
            
        }
        this.ordSumErMarkerad = ordId;
        this.bokstavurSumErMarkeradur = bokstavId;
    },
    
    strikaMarkering : function(ordId) {
        var i = 1;
        
        while(document.getElementById(ordId + "-" + i)) {
            document.getElementById(ordId + "-" + i).setAttribute('class', 'musIkkiYvir');
            i++;
        }
    },
    
    vidkaMarkering : function(ordId, bokstvId) {
        //Um man tr�stir � + � eitt n�tt or�, gloymist markering av fyrrvr. or�i�.
        if(akkordSkipan.ordSumErMinkad != akkordSkipan.ordSumErMarkerad) {
            akkordSkipan.ordSumErMinkad = ordId;
            akkordSkipan.bokstavamongIMinkadumOrdi = this.telBokstavirIOrdi(ordId);
        }
        else {
            if(akkordSkipan.bokstavamongIMinkadumOrdi < this.telBokstavirIOrdi(ordId)) {
                akkordSkipan.bokstavamongIMinkadumOrdi++;
                this.markeraOrd(ordId, bokstvId);
            }
        }
    },
    
    minkaMarkering : function(ordId, bokstvId) {
        if(akkordSkipan.ordSumErMinkad != akkordSkipan.ordSumErMarkerad) {
            //hetta koyrir valda or�i� � r�ttu variablarnar
            akkordSkipan.ordSumErMinkad = ordId;
            akkordSkipan.bokstavamongIMinkadumOrdi = this.telBokstavirIOrdi(ordId);
            
            if(akkordSkipan.bokstavamongIMinkadumOrdi > 1) {
                akkordSkipan.bokstavamongIMinkadumOrdi--;
            }
        }
        else {
            //n� er or�i� valt, og eftir er bara at minka.
            if(akkordSkipan.bokstavamongIMinkadumOrdi > 1) {
                akkordSkipan.bokstavamongIMinkadumOrdi--;
            }
            
            this.markeraOrd(ordId, bokstvId);
        }
    },
    
    telBokstavirIOrdi: function(ordId) {
        var bokstavur = 0;
        var valdiBokstavur = document.getElementById(ordId + "-"+bokstavur);
        
        while(document.getElementById(ordId + "-" + bokstavur)) {
            bokstavur++;
        }
        
        return bokstavur;
    },
    
    // 3. Funkti�nir til at velja akkord og seta hana inn � tekstin
    
    innsetAkkordVeljara : function(ordId, bokstvId, akkordMenu) {
        var i;
        var p = $("#" + ordId + "-" + bokstvId);
        var position = p.position();
        
        var vinstra = position.left-7;
        var ovara = position.top+20;
        
        var akkordListi = document.createElement("ul");
        var akkord;
        var akkordLink;
        
        document.getElementById("jFylg").style.position = "absolute";
        document.getElementById("jFylg").style.top = ovara + "px";
        document.getElementById("jFylg").style.left = vinstra + "px";
        
        akkordListi.setAttribute("class", "akkordVeljiListi");
        
        if(akkordMenu == 1) {
            this.byggAkkordLista1(akkordListi);
        }
        if(akkordMenu == 2) {
            this.byggAkkordLista2(akkordListi);
        }
        
        document.getElementById("jFylg").innerHTML = "";
        
        document.getElementById("jFylg").appendChild(akkordListi);
    },
    
    byggAkkordLista1 : function(akkordListi) {
        var akkord, akkordLink, i;
        
        for(i=0; i<this.akkordir1.length; i++) {
            akkordLink = document.createElement("a");
            akkordLink.setAttribute("href","#");
            akkordLink.setAttribute("class", "akkord_link");
            akkordLink.setAttribute("onclick", "akkordSkipan.velAkkord("+i+", 1);");
            
            akkord = document.createElement("li");
            akkord.appendChild(document.createTextNode(this.akkordir1[i]));
            
            akkordLink.appendChild(akkord);
            akkordListi.appendChild(akkordLink);
        }
    },
    
    byggAkkordLista2 : function(akkordListi) {
        var akkord, akkordLink, i;
        
        for(i=0; i<this.akkordir2.length; i++) {
            akkordLink = document.createElement("a");
            akkordLink.setAttribute("href","#");
            akkordLink.setAttribute("class", "akkord_link");
            akkordLink.setAttribute("onclick", "akkordSkipan.velAkkord("+i+", 2);");
            
            akkord = document.createElement("li");
            akkord.appendChild(document.createTextNode(this.akkordir2[i]));
            
            akkordLink.appendChild(akkord);
            akkordListi.appendChild(akkordLink);
        }
    },
    
    velAkkord : function(akkordNr, akkordMenu) {
        var akkordHaldari;
        var akkordTekstur;
        var akkord = {};
        
        if(this.ordSumErMarkerad == this.ordSumErMinkad) {
            //um markeringin er minka�
        }
        else {
            //Koyr sang � DOM
            document.getElementById("jFylg").innerHTML = "";
            
            if(akkordMenu == 1) {
                this.akkordUndirGerd = {};
            }
            
            this.akkordUndirGerd[akkordMenu] = akkordNr;
            
            this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
            
            this.innsetAkkordVeljara(this.ordSumErMarkerad, this.bokstavurSumErMarkeradur, 2);
        }
    },
    
    koyrAkkIdomOgAkkObj : function(akkordir) {
        var akkordHaldari;
        var tempAkk;
        var akkordTekstur = "";
        
        //Koyr akkordir � DOM
        
        akkordHaldari = document.createElement("span");
        akkordHaldari.setAttribute("style","position:absolute;top:-1em;z-index:-1;");
        
        if(akkordir[1] | akkordir[1] == "0") {
            tempAkk = this.akkordir1[akkordir[1]];
        }
        if(akkordir[2] | akkordir[2] == "0") {
            tempAkk += this.akkordir2[akkordir[2]] + "";
        }
        
        akkordHaldari.appendChild(document.createTextNode(tempAkk));
        
        document.getElementById("akk"+this.ordSumErMarkerad).innerHTML = "";
        document.getElementById("akk"+this.ordSumErMarkerad).appendChild(akkordHaldari);
        
        //Koyr akkordir � akkord-objekti�
        
        if(!this.akkordirISangi[this.vers]) {
            this.akkordirISangi[this.vers] = {};
        }
        
        this.akkordirISangi[this.vers][this.ordSumErMarkerad] = akkordir;

    },
    
    // 4. A�rar funkti�nir
    goymAkkordir : function() {
        var sendastTilDB = "";
        
        if(skra.songKeeper[undansyning.VALDUR_SANGUR]) {
            skra.songKeeper[undansyning.VALDUR_SANGUR].sang.sang_akkordir[this.vers] = this.akkordirISangi[this.vers];
        }
        
        sendastTilDB = JSON.stringify(skra.songKeeper[undansyning.VALDUR_SANGUR].sang.sang_akkordir);
        
        $.post("innskrivaakk.php",{"sang_id":undansyning.valdur_sangurDB,"akkordir":sendastTilDB});
    }
}