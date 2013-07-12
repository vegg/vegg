var akkordSkipan = {
    vers : -1,
    ollOrdini : [],
    ordSumErMarkerad : null,
    ordSumErMinkad : null,
    ordSumHevurAkkord : null,
    bokstavurSumErMarkeradur : null,
    bokstavamongIMinkadumOrdi : null,
    markeringByrjan : null,
    markeringEndi : null,
    akkordir1 : ["A","Bb","H","C","C#","D","D#","E","F","F#","G","G#"],
    akkordir2 : ["m", "7", "m7", "maj7", "m-maj7", "sus2", "sus4", "dimm", "aug"],
    akkordir3 : ["/A","/Bb","/H","/C","/C#","/D","/D#","/E","/F","/F#","/G","/G#"],
    akkordirISangi : {},
    akkordUndirGerd : {},
    
    // 1. Funktiónir til at legga sangin inná GUI
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
        
        //um hesi ikki verða nullaði, kunnu tey skapa óendalig loops í óvæntaðum støðum.
        this.ollOrdini = [];
        this.ordSumErMarkerad = null;
        this.ordSumErMinkad = null;
        this.ordSumHevurAkkord = null;
        this.bokstavurSumErMarkeradur = null;
        this.bokstavamongIMinkadumOrdi = null;
        this.markeringByrjan = null;
        this.markeringEndi = null;
        this.akkordirISangi = {};
        
        sangPlass = document.createElement("div");
        sangPlass.setAttribute("id","sangPlass");
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
            //Set ein akkordhaldara frammanfyri hvørt orð
            /* Tað er ikki neyðugt at byrja við at hava akkordhaldara fyri hvørt orð
            akkordHaldari = document.createElement("span");
            akkordHaldari.setAttribute("id", "akk"+(i+1));
            akkordHaldari.setAttribute("style","position:absolute;");
            sangPlass.appendChild(akkordHaldari.cloneNode());
            */
            
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
            
            /* Tað er ikki neyðugt at byrja við at hava akkordhaldara fyri hvørt millumrúm
            akkordHaldari.setAttribute("id","akkm"+(i+1));
            sangPlass.appendChild(akkordHaldari.cloneNode());
            */
            
            //Ger eitt millumrúm aftaná hvørt orð
            millumrum = document.createElement("span");
            millumrumTekstur = document.createTextNode("\u00A0");
            millumrum.appendChild(millumrumTekstur);
            
            millumrum.setAttribute("id", "m" + (i+1) + "-" + 1);
            millumrum.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'m"+(i+1)+"\',1);");
            millumrum.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara(\'m"+(i+1)+"\',1,1)");
            
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
                
                //Hetta er ikki brúkt meira. Far til else ístaðin.
                if(value['s'] && value['s'] != "0") {
                    /*akkordSkipan.ordSumErMinkad = index;
                    
                    //Ger placeholders
                    if(!(akkordSkipan.akkordirISangi[versId])) {
                        akkordSkipan.akkordirISangi[versId] = {"zyz":"zyz"};
                    }
                    if(!(akkordSkipan.akkordirISangi[versId][akkordSkipan.ordSumErMinkad+""])) {
                        akkordSkipan.akkordirISangi[versId][akkordSkipan.ordSumErMinkad+""] = {};
                    }
                    
                    //Deil orðið sundur
                    akkordSkipan.akkordirISangi[versId][akkordSkipan.ordSumErMinkad+""]["s"] = value['s'];
                    akkordSkipan.deilOrdSundur();
                    
                    //Rudda upp
                    if(akkordSkipan.akkordirISangi[versId] && akkordSkipan.akkordirISangi[versId][1] && akkordSkipan.akkordirISangi[versId]["zyz"] == "zyz") {
                        delete akkordSkipan.akkordirISangi[versId]["zyz"];
                    }
                    akkordSkipan.ordSumErMinkad = 0;*/
                }
                else {
                    $.each(value, function(key, val) {
                        akkordSkipan.markeringByrjan = key;
                        akkordSkipan.koyrAkkIdomOgAkkObj(val);
                        akkordSkipan.markeringByrjan = null;
                    });
                    
                    //akkordSkipan.koyrAkkIdomOgAkkObj(value);
                }
            });
            akkordSkipan.ordSumErMarkerad = 0;
        }
    },
    
    pettaSangSundurIOrd : function(UISangId,versId) {
        var i;
        var setningar = skra.songKeeper[UISangId].sang.sang_innihald['vers'+versId].split('<br>');
        var sundurSkildOrd = [];
        
        //petta setningarnar sundur í orð, koyr teir saman í eitt array við <br> ímillum hvønn einstakan.
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
            '<a href="#" onclick="akkordSkipan.vidkaMarkering(\''+ordId+'\', '+bokstavId+')" ><img src="grafikkur/pluss.png" style="z-index:2"></a><a href="#" onclick="akkordSkipan.minkaMarkering(\''+ordId+'\','+bokstavId+')"><img src="grafikkur/minus.png" style="z-index:2"></a>';
    },

    // 2. Funktiónir til at markera orð og stilla markeringina
    
    markeraOrd: function(ordId, bokstavId) {
        var i = 0;
        var j = 1;
        var halvMarkering = Math.floor(this.bokstavamongIMinkadumOrdi / 2);
        var bakkilongd = halvMarkering;
        var markeringByrjan;
        
        //Strika alla fyrrverandi markering.
        if(this.ordSumErMarkerad) {
            this.strikaMarkering(this.ordSumErMarkerad);
            this.ordSumErMarkerad = 0;
        }
        
        if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][ordId]) {
            document.getElementById(ordId+"-"+bokstavId).setAttribute('class', 'musYvir');
            this.markeringByrjan = bokstavId;
            
            if(document.getElementById("akk" + ordId+"-"+bokstavId +"-innan")) {
                document.getElementById("akk" + ordId +"-"+ bokstavId + "-innan").setAttribute('class', 'akkordMusYvir');
            }
        }
        else if(ordId == this.ordSumErMinkad) {
            if(document.getElementById(ordId + "-" + (bokstavId-bakkilongd))) { //Um markeringin heldur seg innanfyri orðið á vinstru síðu.
                j = bokstavId-bakkilongd;
                this.markeringByrjan = j;
                if(document.getElementById(ordId + "-" + (j + this.bokstavamongIMinkadumOrdi-1))) { //Um markeringin heldur seg innanfyri orðið á høgru síðu.
                    this.markeringEndi = j + this.bokstavamongIMinkadumOrdi - 1;
                    while(i < this.bokstavamongIMinkadumOrdi) {
                        document.getElementById(ordId + "-" + j).setAttribute('class', 'musYvir');
                        if(document.getElementById("akk" + ordId+"-innan")) {
                            document.getElementById("akk" + ordId+"-innan").setAttribute('class', 'akkordMusYvir');
                        }
                        i++;
                        j++;
                    }
                }
                else {
                    //flyt alla markeringina so nógv pláss til vinstru sum er neyðugt.
                    this.markeraOrd(ordId, bokstavId - ((j + this.bokstavamongIMinkadumOrdi) - this.telBokstavirIOrdi(ordId)));
                }
            }
            else if(bokstavId - bakkilongd <= 0) {
                //flyt alla markeringina so nógv pláss til høgru sum er neyðugt.
                if(bokstavId-bakkilongd == 0) {
                    this.markeraOrd(ordId, ((bokstavId-bakkilongd)*-1) + (bokstavId)+1);
                }
                else {
                    this.markeraOrd(ordId, ((bokstavId-bakkilongd)*-1) + bokstavId);
                }
            }
        }
        else {
            while(document.getElementById(ordId + "-" + j)) {
                document.getElementById(ordId + "-" + j).setAttribute('class', 'musYvir');
                if(document.getElementById("akk" + ordId+"-innan")) {
                    document.getElementById("akk" + ordId+"-innan").setAttribute('class', 'akkordMusYvir');
                }
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
            if(document.getElementById("akk" + ordId+"-"+this.bokstavurSumErMarkeradur+"-innan")) {
                document.getElementById("akk" + ordId+"-"+this.bokstavurSumErMarkeradur+"-innan").setAttribute('class', 'akkord');
            }
            i++;
        }
    },
    
    vidkaMarkering : function(ordId, bokstvId) {
        var bokstavatal = this.telBokstavirIOrdi(ordId);
        
        //Um man trýstir á + á eitt nýtt orð, gloymist markering av fyrrvr. orðið.
        if(akkordSkipan.ordSumErMinkad != akkordSkipan.ordSumErMarkerad) {
            akkordSkipan.ordSumErMinkad = ordId;
            akkordSkipan.bokstavamongIMinkadumOrdi = bokstavatal;
            //akkordSkipan.bokstavamongIMinkadumOrdi = this.telBokstavirIOrdi(ordId);
        }
        else {
            if(akkordSkipan.bokstavamongIMinkadumOrdi < bokstavatal) {
                akkordSkipan.bokstavamongIMinkadumOrdi++;
                this.markeraOrd(ordId, bokstvId);
            }
            
            if(akkordSkipan.bokstavamongIMinkadumOrdi == bokstavatal) {
                this.ordSumErMinkad = null;
                this.bokstavamongIMinkadumOrdi = null;
                this.markeringByrjan = null;
                this.markeringEndi = null;
            }
        }
    },
    
    minkaMarkering : function(ordId, bokstvId) {
        if(akkordSkipan.ordSumErMinkad != akkordSkipan.ordSumErMarkerad) {
            //hetta koyrir valda orðið í røttu variablarnar
            akkordSkipan.ordSumErMinkad = ordId;
            akkordSkipan.bokstavamongIMinkadumOrdi = this.telBokstavirIOrdi(ordId);
            
            if(akkordSkipan.bokstavamongIMinkadumOrdi > 1) {
                akkordSkipan.bokstavamongIMinkadumOrdi--;
            }
        }
        else {
            //nú er orðið valt, og eftir er bara at minka.
            if(akkordSkipan.bokstavamongIMinkadumOrdi > 1) {
                akkordSkipan.bokstavamongIMinkadumOrdi--;
            }
            
            this.markeraOrd(ordId, bokstvId);
        }
    },
    
    telBokstavirIOrdi: function(ordId) {
        var bokstavur = 1;
        
        while(document.getElementById(ordId + "-" + bokstavur)) {
            bokstavur++;
        }
        
        return bokstavur-1;
    },
    
    // 3. Funktiónir til at velja akkord og seta hana inn í tekstin
    
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
        
        this.byggAkkordLista(akkordListi,akkordMenu);
        
        document.getElementById("jFylg").innerHTML = "";
        
        document.getElementById("jFylg").appendChild(akkordListi);
    },
    
    byggAkkordLista : function(akkordListi, akkMenu) {
        var akkord, akkordLink, i, tempAkkordir, strika, strikaLink;
        
        if(akkMenu == 1) {
            tempAkkordir = this.akkordir1;
        }
        else if(akkMenu == 2) {
            tempAkkordir = this.akkordir2;
        }
        
        for(i=0; i<tempAkkordir.length; i++) {
            akkordLink = document.createElement("a");
            akkordLink.setAttribute("href","#");
            akkordLink.setAttribute("class", "akkord_link");
            akkordLink.setAttribute("onclick", "akkordSkipan.velAkkord("+i+", "+akkMenu+");");
            
            akkord = document.createElement("li");
            akkord.appendChild(document.createTextNode(tempAkkordir[i]));
            
            akkordLink.appendChild(akkord);
            akkordListi.appendChild(akkordLink);
        }
        
        //Um ein akkord finst á orðinum, ger møguleika at strika hana.
        if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]) {
            strikaLink = document.createElement("a");
            strikaLink.setAttribute("href", "#");
            strikaLink.setAttribute("class", "akkord_link");
            strikaLink.setAttribute("onclick", "akkordSkipan.strikaAkkord();");
            
            strika = document.createElement("li");
            strika.appendChild(document.createTextNode("Strika"));
            
            strikaLink.appendChild(strika);
            akkordListi.appendChild(strikaLink);
        }
    },
    
    velAkkord : function(akkordNr, akkordMenu) {
        var akkordHaldari;
        var akkordTekstur;
        var akkord = {};
        var tempAkkord = {};
        var i;
        var tempP;
        
        document.getElementById("jFylg").innerHTML = "";
        
        if(akkordMenu == 1) {
            this.akkordUndirGerd = {};
        }
        
        this.akkordUndirGerd[akkordMenu] = akkordNr;
        
        if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]) {
            
        }
        else if(this.ordSumErMarkerad != this.ordSumErMinkad) {
            this.markeringByrjan = 1;
        }
        
        //Um akkordin verður koyrd á eitt millumrúm
        if(this.ordSumErMarkerad[0] == "m") {
            if(!this.akkordirISangi[this.vers] || !this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]) {
                this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                this.gerMillumrumGrannar();
            }
            else {
                this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
            }
        }
        else {
            this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
        }
        
        this.innsetAkkordVeljara(this.ordSumErMarkerad, this.bokstavurSumErMarkeradur, 2);
    },
    
    gerMillumrumGrannar : function() {
        var nyttMillumrumFyrr, nyttMillumrumEftir;
        var haegstaBokstavsId = 1;
        
        //finn tað størsta bókstavs-id í valda orðinum
        if(this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]) {
            $.each(this.akkordirISangi[this.vers][this.ordSumErMarkerad+""], function(key, val) {
                if(key > haegstaBokstavsId) {
                    haegstaBokstavsId = key;
                }
            });
        }
        
        nyttMillumrumFyrr = document.createElement("span");
        nyttMillumrumFyrr.appendChild(document.createTextNode("\u00A0"));
        nyttMillumrumFyrr.setAttribute("id", this.ordSumErMarkerad + "-" + (haegstaBokstavsId+1));
        nyttMillumrumFyrr.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'"+this.ordSumErMarkerad+"\',\'"+(haegstaBokstavsId+1)+"\')");
        nyttMillumrumFyrr.setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara(\'"+this.ordSumErMarkerad+"\', \'"+(haegstaBokstavsId+1)+"\',1)");
        
        nyttMillumrumEftir = document.createElement("span");
        nyttMillumrumEftir.appendChild(document.createTextNode("\u00A0"));
        nyttMillumrumEftir.setAttribute("id", this.ordSumErMarkerad + "-" + (haegstaBokstavsId+2));
        nyttMillumrumEftir.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'"+this.ordSumErMarkerad+"\',\'"+(haegstaBokstavsId+2)+"\')");
        nyttMillumrumEftir.setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara(\'"+this.ordSumErMarkerad+"\',\'"+(haegstaBokstavsId+2)+"\',1)");
        
        $(nyttMillumrumFyrr).insertBefore('#' + this.ordSumErMarkerad + '-' + this.bokstavurSumErMarkeradur);
        $(nyttMillumrumEftir).insertAfter('#' + this.ordSumErMarkerad + '-' + this.bokstavurSumErMarkeradur);
    },
    
    koyrAkkIdomOgAkkObj : function(akkordir) {
        var akkordHaldari, uttariAkkordHaldari;
        var nyAkkordHaldariFyrr, nyAkkordHaldariEftir;
        var tempAkk;
        var akkordTekstur = "";
        var nyttAkkPlassFyrr, nyttAkkPlassEftir;
        var i = 1;
        var p=-1,q=-1;
        var fOrd=1,aOrd=1,eOrd=1;
        var fyrraMillumrum, seinnaMillumrum;
        var fyrrimAkkordHaldari, seinnimAkkordHaldari;
        var fyrriAkkordhaldari, seinniAkkordHaldari;
        var prefix;
        var akkPrefix = "";
        var eAkkord;
        
        //bygg akkord-objekt upp
        if(!this.akkordirISangi[this.vers]) {
            this.akkordirISangi[this.vers] = {};
        }
        
        if(!this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]) {
            this.akkordirISangi[this.vers][this.ordSumErMarkerad+""] = {"xyz":"xyz"};
        }
        
        //Koyr akkordir í akkord-objektið
        this.akkordirISangi[this.vers][this.ordSumErMarkerad+""][this.markeringByrjan+""] = akkordir;
        
        //rudda upp
        if(this.akkordirISangi[this.vers][this.ordSumErMarkerad]["xyz"] == "xyz") {
            delete this.akkordirISangi[this.vers][this.ordSumErMarkerad]["xyz"];
        }
        
        //Koyr akkordir í DOM
        akkordHaldari = document.createElement("span");
        akkordHaldari.setAttribute("class","akkord");
        akkordHaldari.setAttribute("id","akk"+this.ordSumErMarkerad+"-"+this.markeringByrjan+"-innan");
        
        if(akkordir[1] | akkordir[1] == "0") {
            tempAkk = this.akkordir1[akkordir[1]];
        }
        if(akkordir[2] | akkordir[2] == "0") {
            tempAkk += this.akkordir2[akkordir[2]] + "";
        }
        
        akkordHaldari.appendChild(document.createTextNode(tempAkk));
        
        //bygg akkordhaldara
        if(!document.getElementById("akk"+this.ordSumErMarkerad+'-'+this.markeringByrjan)) {
            uttariAkkordHaldari = document.createElement("span");
            uttariAkkordHaldari.setAttribute("style","position:absolute;");
            uttariAkkordHaldari.setAttribute("id", "akk"+this.ordSumErMarkerad + '-' + this.markeringByrjan);
            
            $(uttariAkkordHaldari).insertBefore('#' + this.ordSumErMarkerad + "-" + this.markeringByrjan);
        }
        
        //Koyr akkord í akkordhaldara.
        document.getElementById("akk"+this.ordSumErMarkerad+'-'+this.markeringByrjan).innerHTML = "";
        document.getElementById("akk"+this.ordSumErMarkerad+'-'+this.markeringByrjan).appendChild(akkordHaldari);
    },
    
    deilOrdSundur : function() {
        var s;
        var fOrd=1,aOrd=1,eOrd=1;
        var millumrum;
        var mAkkordHaldari;
        var prefix;
        var i = 1;
        
        if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]['s']) {
            s = this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]['s'];
            
            while(document.getElementById(this.ordSumErMarkerad + "-" + i)) {
            
                //Fyrsta orðið aftaná uppdeilingina er prefixað við f
                if(i < s) {
                    document.getElementById(this.ordSumErMinkad + "-" + i).setAttribute("onmouseover", "akkordSkipan.markeraOrd('f"+ this.ordSumErMinkad +"', "+fOrd+"); akkordSkipan.innsetMinkaraOgStorrara('f"+ this.ordSumErMinkad +"', "+fOrd+")");
                    document.getElementById(this.ordSumErMinkad + "-" + i).setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara('f"+this.ordSumErMinkad+"', "+fOrd+",1)");
                    document.getElementById(this.ordSumErMinkad + "-" + i).setAttribute("id", "f"+this.ordSumErMinkad + "-" + fOrd);
                    fOrd++;
                }
                //Annað orðið er prefixað við e
                else if(i >= s) {
                    document.getElementById(this.ordSumErMinkad + "-" + i).setAttribute("onmouseover", "akkordSkipan.markeraOrd('e"+ this.ordSumErMinkad +"', "+eOrd+"); akkordSkipan.innsetMinkaraOgStorrara('e"+ this.ordSumErMinkad +"', "+eOrd+")");
                    document.getElementById(this.ordSumErMinkad + "-" + i).setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara('e"+this.ordSumErMinkad+"', "+eOrd+",1)");
                    document.getElementById(this.ordSumErMinkad + "-" + i).setAttribute("id", "e"+this.ordSumErMinkad + "-" + eOrd);
                    eOrd++;
                }
                i++;
            }
            
            prefix = "e";
            
            millumrum = document.createElement("span");
            millumrum.appendChild(document.createTextNode("\u00A0"));
            millumrum.setAttribute("id", "m" +prefix+ this.ordSumErMarkerad + "-1");
            millumrum.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'m"+prefix+this.ordSumErMarkerad+"\',1);");
            millumrum.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara(\'m"+prefix+this.ordSumErMarkerad+"\',1,1)");
            
            mAkkordHaldari = document.createElement("span");
            mAkkordHaldari.setAttribute("style","position:absolute;");
            mAkkordHaldari.setAttribute("id", "akkm"+prefix+this.ordSumErMarkerad);
            
            $(mAkkordHaldari).insertBefore("#"+prefix + this.ordSumErMarkerad + '-1');
            $(millumrum).insertBefore("#"+prefix + this.ordSumErMarkerad + '-1');
            
            //nýggan akkordhaldara til nýggja orðið
            
            //rætta fyrsta akkordhaldaranavnið
            document.getElementById("akk"+this.ordSumErMarkerad).setAttribute("id", "akkf"+this.ordSumErMarkerad);
            
            //Og ger eitt nýtt pláss
            fyrriAkkordhaldari = document.createElement("span");
            fyrriAkkordhaldari.setAttribute("style","position:absolute;");
            fyrriAkkordhaldari.setAttribute("id", "akk"+prefix+this.ordSumErMarkerad);
            $(fyrriAkkordhaldari).insertBefore("#" + prefix + this.ordSumErMarkerad + '-1');
            
            this.markeringByrjan = null;
            this.markeringEndi = null;
        }
    },
    
    koyrSkildOrdSaman : function(upprunaOrd) {
        var i = 1;
        var j = 1;
        
        var sangPlass = document.getElementById("sangPlass");
        sangPlass.removeChild(document.getElementById("akkme"+upprunaOrd));
        sangPlass.removeChild(document.getElementById("akke"+upprunaOrd));
        
        document.getElementById("akkf"+upprunaOrd).setAttribute("id","akk"+upprunaOrd);
        
        sangPlass.removeChild(document.getElementById("me"+upprunaOrd+"-1"));
        
        while(document.getElementById("f"+upprunaOrd+"-"+i)) {
            document.getElementById("f"+upprunaOrd+"-"+i).setAttribute("onmouseover","akkordSkipan.markeraOrd('"+ upprunaOrd +"', "+i+"); akkordSkipan.innsetMinkaraOgStorrara('"+ upprunaOrd +"', "+i+")");
            document.getElementById("f"+upprunaOrd+"-"+i).setAttribute("onclick","akkordSkipan.innsetAkkordVeljara('"+ upprunaOrd +"', "+i+",1);");
            document.getElementById("f"+upprunaOrd+"-"+i).setAttribute("id",upprunaOrd + "-" + i);
            i++;
        }
        while(document.getElementById("e"+upprunaOrd+"-"+j)) {
            document.getElementById("e"+upprunaOrd+"-"+j).setAttribute("onmouseover","akkordSkipan.markeraOrd('"+ upprunaOrd +"', "+i+"); akkordSkipan.innsetMinkaraOgStorrara('"+ upprunaOrd +"', "+i+")");
            document.getElementById("e"+upprunaOrd+"-"+j).setAttribute("onclick","akkordSkipan.innsetAkkordVeljara('"+ upprunaOrd +"', "+i+",1);");
            document.getElementById("e"+upprunaOrd+"-"+j).setAttribute("id",upprunaOrd + "-" + i);
            i++;
            j++;
        }
        
        this.ordSumErMinkad = null;
        this.markeringByrjan = null;
        this.markeringEndi = null;
    },
    
    strikaAkkord : function() {
        var stringMarkerad = this.ordSumErMarkerad + "";
        var prefix = stringMarkerad.substring(0,1);
        var ord = stringMarkerad.substring(1,stringMarkerad.length);
        var i;
        var hevurAkkordir = false;
        
        if(prefix == "e") {
            delete this.akkordirISangi[this.vers]["e"+ord];
            
            //um ongin akkord er millum helvtirnar.
            if(!(document.getElementById("me" + ord + "f-1"))) { // Um me1f-1 er til, finnast ein ella fleiri millumrúm akkordir.
                
                //um f hevur eina akkord
                if(this.akkordirISangi[this.vers]["f"+ord]) {
                    //kopiera f1 til 1 og sletta f1
                    this.akkordirISangi[this.vers][ord][1] = this.akkordirISangi[this.vers]["f"+ord][1];
                    
                    if(this.akkordirISangi[this.vers]["f"+ord][2] || this.akkordirISangi[this.vers]["f"+ord][2] == "0") {
                        this.akkordirISangi[this.vers][ord][2] = this.akkordirISangi[this.vers]["f"+ord][2];
                    }
                    
                    delete this.akkordirISangi[this.vers]["f"+ord];
                }
                
                delete this.akkordirISangi[this.vers][ord]["s"];
                
                //Koyr orð saman aftur í DOM
                this.koyrSkildOrdSaman(ord);
            }
            else {
                //Sletta akkord í DOM og ger onki annað
            }
        }
        else if(prefix == "f") {
            if(this.akkordirISangi[this.vers]["e"+ord]) {
                delete this.akkordirISangi[this.vers]["f"+ord];
                //sletta akkord í DOM og ger onki annað.
            }
        }
        else if(prefix == "m") {
            
        }
        else {
            delete this.akkordirISangi[this.vers][this.ordSumErMarkerad+""];
            document.getElementById("akk"+this.ordSumErMarkerad).removeChild(document.getElementById("akk"+this.ordSumErMarkerad+"-innan"));
        }
    },
    
    // 4. Aðrar funktiónir
    goymAkkordir : function() {
        var sendastTilDB = "";
        
        if(skra.songKeeper[undansyning.VALDUR_SANGUR]) {
            skra.songKeeper[undansyning.VALDUR_SANGUR].sang.sang_akkordir[this.vers] = this.akkordirISangi[this.vers];
        }
        
        sendastTilDB = JSON.stringify(skra.songKeeper[undansyning.VALDUR_SANGUR].sang.sang_akkordir);
        
        $.post("innskrivaakk.php",{"sang_id":undansyning.valdur_sangurDB,"akkordir":sendastTilDB});
    }
}