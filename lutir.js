dokumentLutur = {
    menuOpin: false,
    menuId : ""
};

//Heldur skil á øllum sum hevur við leitikassan at gera
searchBox = function() {
    //VARIABLAR
    this.isClean = false;
    
    //FUNKTIÓNIR
    //sendir eitt query til php-scriptið uppskot.php og fær sang tittulin aftur sum JSON
    this.sendQuery = function() {
        //this.search = document.getElementById("search").value;
        var search = document.getElementById("search").value;
        /*
        //eg má finna onkran máta reinsa input uppá ein fornuftigan máta, so ikki allar databasin verður dumped í einum
        //if(this.search.length > 0) {
            $('#autocomplete-list').html('');
            
            $.getJSON('uppskot.php?key=' + search + '',
                function(output) {
                    $.each(output, function(key,val) {
                        $('#autocomplete-list').append('<a href="#" onclick="skra.fetchSong('+key+');"><li>'+val['sang_tittul']+'</li></a>');
                        $('#searchsuggestiondropdown').attr('class', 'searchsuggestiondropdown-open');
                    });
                });
       // }
        */
        
        $('#autocomplete-list').html('');
        $.ajax({
            url:"databasi.php",
            type:"post",
            data:{key:search,slag:"leita"},
            success:function(output){
                $.each(output, function(key,val) {
                        $('#autocomplete-list').append('<a href="#" onclick="skra.fetchSong('+key+');"><li>'+val['sang_tittul']+'</li></a>');
                        $('#searchsuggestiondropdown').attr('class', 'searchsuggestiondropdown-open');
                    });
            },
            dataType:"json"
       });
    };
    
    //Ruddar leitikassan tá trýst verður á hann
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
    
    //FUNKTIÓNIR
    fetchSong : function(songId) {
        /*
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
        
        */
        
        $.ajax({
            url:"databasi.php",
            type:"post",
            data:{key:songId,slag:"takting"},
            success:function(output) {
                $.each(output, function(key,val) {
                    var songKey = "lis" + skra.songMenuNum;
                    skra.songKeeper.push(output);
                    
                    $('#list-list').append('<li id="'+songKey+'"><a id="'+songKey+'_lnk" href="#" onclick="undansyning.sendTilUndansyning(\''+
                                           songKey+'\');">'+val['sang_tittul']+'</a> - <a href="#" onclick="skra.strikaILista(\''+songKey+
                                           '\');">X</a><a href="#" onclick="framsyning.koyrIFramsyning('+skra.songMenuNum+
                                           ')"><img src="grafikkur/kanon.bmp" style="position:relative;top:5px;left:5px;"></a></li>');
                    skra.songMenuNum++;
                });
            },
            dataType:"json"
        });
        
        //Tøm leitikassan
        document.getElementById("search").value = "";
        document.getElementById("autocomplete-list").innerHTML = "";
        $('#searchsuggestiondropdown').attr('class', 'searchsuggestiondropdown-closed');
    },
    
    strikaILista : function(id) { 
        $("#"+id).remove();
        delete skra.songKeeper[id[3]];
        
        //Koyr sangin vekk úr framsýning
        if(framsyning.UI_SANG_NR_I_BRUKI == id[3]) {
            framsyning.ruddaFramsyning();
            framsyning.ruddaStorskyggja();
        }
        
        //Koyr sangin vekk úr undansýning.
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
        sangNr = parseInt(sangNr[3]); //3, tí talið er char nr 3 í stronginum
        
        this.skapaFramsynKnott(sangNr);
        this.skapaBroytKnott(sangNr);
        //this.skapaAkkordKnott(sangNr);
        
        //koyr versini inná undansýning
        for(var key in skra.songKeeper[sangNr]['sang']['sang_innihald']) {
            fullSong +=
            "<p id='us_vers"+i+"' onclick='undansyning.sendToPreviewWindow(\""+i+"\",\"fast\");'>"
                + skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+i]+
            "</p>" +
            '<a href="#" onclick="akkordSkipan.tendra(\'skra\',\''+sangNr+'\',\''+i+'\');">Akkordir</a>';
            
            i++;
            this.VERS_NOGD++;
        }
        document.getElementById("undansyning_tekst").innerHTML = fullSong;
        
        this.VALDUR_SANGUR = sangNr;
        this.valdur_sangurDB = skra.songKeeper[sangNr]['sang']['sang_id'];
    },
    
    sendToPreviewWindow : function(versNummar, stoda) {
        var sang;
        //Hetta kemur frá undansýning har eg IKKI eri í ferð við at broyta nakað.
        if(stoda == "fast") {
            sang = document.getElementById("us_vers"+versNummar).innerHTML;            
            sang = sang.replace(/\n/g, "<br>");
            
            document.getElementById("preview_window_text").innerHTML = sang;
        }
        //Hetta kemur frá undansýning tá eg eri í ferð við at broyta okkurt
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
        
        //Stytt tekstin fyri hvørt vers í framsýning
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
    
    //Tel hvussu nógv reglubrot eru í versinum og stilla hæddina á kassanum eftir tí
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
        
        //Sundurdeil um markørurin IKKI er fremst ella aftast í versinum. T.e. tað er okkurt at deila.
        if(pos > 0 && pos != vers.length) {
            
            //uppdatera versnummari fyri eftirfylgjandi versum, um tað er nakað.
            if(UIVersNr != this.VERS_NOGD) {
                
                //GG. Tað byrjar við seinasta versinum!
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
            
            //Deil versið sundur í tveir partar.
            fyrstiPartur = vers.substring(0,pos);
            seinniPartur = vers.substring(pos,vers.length);
            
            //legg ein kassa aftrat tí sundurskilda versinum
            $('<li id="vers_uttan'+(UIVersNr+1)+'"><textarea id="ns_vers'+(UIVersNr+1)+'" class="sang_innihald" onclick="undansyning.sendToPreviewWindow('+(UIVersNr+1)+',\'broytiligt\')" onkeyup="undansyning.sendToPreviewWindow('+(UIVersNr+1)+',\'broytiligt\')">'+seinniPartur+'</textarea>'+
                '<p style="float:right;margin-top:0px;margin-right:15px;"><a id="vers_samanlegg'+(UIVersNr+1)+
                    '" href="#" onclick="undansyning.samanleggVersUppeftir('+(UIVersNr+1)+
                    ')">+</a><br><a id="vers_deil'+(UIVersNr+1)+'" href="#" onclick="undansyning.sundurDeilVers('+(UIVersNr+1)+
                    ')"><></a></p></li>').insertAfter("#vers_uttan"+UIVersNr+"");
            
            
            this.stillaBroytingarKassaHaedd(UIVersNr+1);
            
            //endurnýggja innihald í "gamla" kassanum
            document.getElementById("ns_vers"+UIVersNr).value = fyrstiPartur;
            this.stillaBroytingarKassaHaedd(UIVersNr);
            
            this.VERS_NOGD++;
        }//SUNDURDEILING LIÐUG.
    },

    samanleggVersUppeftir : function(UIVersNr) {
        var nidaraVers = document.getElementById("ns_vers"+UIVersNr).value;
        var fyribilsVersNr = UIVersNr+1;
        
        if(document.getElementById("ns_vers"+(UIVersNr-1))) {
            document.getElementById("ns_vers"+(UIVersNr-1)).value = document.getElementById("ns_vers"+(UIVersNr-1)).value + "\n" + nidaraVers;
            this.stillaBroytingarKassaHaedd(UIVersNr-1);
            
            $('#vers_uttan'+UIVersNr).remove();
            
            //broyt id á eftirfylgjandi versum
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
        }//SAMANLEGGING LIÐUG
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
    
    //stytt versini soleiðis at bara 80 chars eru víst
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
        $.post("feed.php", {"slag":"skrivafeed","innihald":sang});
    },
    
    koyrIAkkFeed : function(sangNr, versNr) {
        var sang = {};
        var akkordir = skra.songKeeper[sangNr]['sang']['sang_akkordir'],
        sang_id_db;
        
        $.each(akkordir, function(index, value) {
            if(typeof value !== "undefined") {
                sang[index] = skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+index];
            }
        });
        
        akkordir = JSON.stringify(akkordir);
        
        sang_id_db = skra.songKeeper[sangNr]['sang']['sang_id'];
        sang['sangid'] = sang_id_db;
        
        sang = JSON.stringify(sang);
        
        if(akkordir) {
            $.post("feed.php", {"slag":"skrivaakkfeed", "innihald":sang, "akkordir":akkordir});
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
    
    //Koyr eina broytisíðu í undansýning kassan saman við einum sangi.
    //Argumentir: UI-Sangnummari á tí valda sanginum.
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
        
        //Skriva versini inn, hvørt í sín tekstkassa
        for(var key in skra.songKeeper[sangNr]['sang']['sang_innihald']) {
            vers = skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+i];
            
            //broyt øll html break til reglubrot.
            vers = vers.replace(/<br>/g, "\n");
            
            //Stillar eitt "((vers))" ímillum hvørt vers (Ikki brúkt meira!)
            /*if(skra.songKeeper[sangNr]['sang']['sang_innihald']['vers'+(i+1)]) {
                vers += "\n((vers))\n";
            }*/
            
            //Koyr tekstkassan saman við tí rætta versinum inná DOM.
            document.getElementById("vers_haldari").innerHTML +=
            '<li id="vers_uttan'+i+'">'+
                '<textarea id="ns_vers'+i+'" wrap="hard" class="sang_innihald" onclick="undansyning.sendToPreviewWindow('+i+',\'broytiligt\')" onkeyup="undansyning.stillaBroytingarKassaHaedd('+i+');undansyning.sendToPreviewWindow('+i+',\'broytiligt\')">' + vers + '</textarea>' +
                '<br><a id="vers_samanlegg'+i+'" href="#" onclick="undansyning.samanleggVersUppeftir('+i+
                    ')">+</a> - <a id="vers_deil'+i+'" href="#" onclick="undansyning.sundurDeilVers('+i+
                    ')" onmouseover="undansyning.broytBakgrundsLitAEinumBroytiTekstkassa(\'true\',\'ns_vers'+i+
                    '\')" onmouseout="undansyning.broytBakgrundsLitAEinumBroytiTekstkassa(\'false\',\'ns_vers'+i+'\')"><></a> '+
                    '<a href="#" onclick="akkordSkipan.tendra(\'skra\',\''+sangNr+'\',\''+i+'\')" onmouseover="undansyning.broytBakgrundsLitAEinumBroytiTekstkassa(\'true\',\'ns_vers'+i+
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
        
        //uppdatera sangin í DB
        for(i = 1; i<=undansyning.VERS_NOGD; i++) {
            innihald += (i != undansyning.VERS_NOGD) ? document.getElementById("ns_vers" + i).value + "((vers))" : document.getElementById("ns_vers" + i).value;
        }
        
        //$.post("innskriva.php", {"sang_id":DBsang_id, "yvirskrift":yvirskrift, "innihald":innihald, "gerd":gerd});
        $.post("databasi.php", {slag:"innskriva",sang_id:DBsang_id, yvirskrift:yvirskrift, innihald:innihald, gerd:gerd});
        
        //uppdatera sangin í UI, um talan er um eina broyting
        if(gerd=="broyt") {
            skra.songKeeper[UIsangId].sang.sang_tittul = yvirskrift;
            
            //í tí føri at brúkarin vil sletta eitt vers, koyr allan sangin vekk fyri fyrst
            skra.songKeeper[UIsangId].sang.sang_innihald = {};
            
            for(j=1;j<=undansyning.VERS_NOGD;j++) {
                fyribils_vers = document.getElementById("ns_vers"+j).value;
                
                fyribils_vers = fyribils_vers.replace(/\n/g, "<br>");
                
                skra.songKeeper[UIsangId].sang['sang_innihald']['vers'+j] = fyribils_vers;
            }
            
            document.getElementById("lis"+UIsangId+"_lnk").innerHTML = yvirskrift;
        }
        
        //lat sangin upp av nýggjum
        if(gerd == "broyt") {
            undansyning.sendTilUndansyning('lis'+UIsangId);
        }
    }
}

//tendra document event handlaran
$(document).ready(function() {
    $(document).click(function() {
        if(dokumentLutur.menuOpin) {
            if(dokumentLutur.menuId === "akkordVeljiListi") {
                document.getElementById("jFylg").innerHTML = "";
                dokumentLutur.menuOpin = false;
                dokumentLutur.menuId = "";
            }
        }
    });
});