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
            //Set ein akkordhaldara frammanfyri hvørt orð
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
            
            akkordHaldari.setAttribute("id","akkm"+(i+1));
            sangPlass.appendChild(akkordHaldari.cloneNode());
            
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
                
                
                if(value['s'] && value['s'] != "0") {
                    akkordSkipan.ordSumErMinkad = index;
                    
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
                    akkordSkipan.ordSumErMinkad = 0;
                }
                else {
                    akkordSkipan.koyrAkkIdomOgAkkObj(value);
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
        
        if(ordId == this.ordSumErMinkad) {
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
            if(document.getElementById("akk" + ordId+"-innan")) {
                document.getElementById("akk" + ordId+"-innan").setAttribute('class', 'akkord');
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
        var tempAkkord = {};
        var i;
        var tempP;
        
        document.getElementById("jFylg").innerHTML = "";
        
        if(akkordMenu == 1) {
            this.akkordUndirGerd = {};
        }
        
        this.akkordUndirGerd[akkordMenu] = akkordNr;
        
        if(this.ordSumErMarkerad == this.ordSumErMinkad) {
            if(!(this.akkordirISangi[this.vers])) {
                this.akkordirISangi[this.vers] = {"zyz":"zyz"};
            }
            
            //Okkurt finst vinstrumegin markeringina
            if(document.getElementById(this.ordSumErMinkad + "-" + (this.markeringByrjan-1))) {
                if(!(this.akkordirISangi[this.vers][this.ordSumErMinkad+""])) {
                    this.akkordirISangi[this.vers][this.ordSumErMinkad+""] = {};
                }
                this.akkordirISangi[this.vers][this.ordSumErMinkad+""]["s"] = this.markeringByrjan;
                
                //Um ein akkord longu er á orðinum.
                if(this.akkordirISangi[this.vers][this.ordSumErMinkad+""][1] || this.akkordirISangi[this.vers][this.ordSumErMinkad+""][1] == "0") {
                    //Koyr orðið sundur og koyr nýggju akkordina á seinna partin av orðinum.
                    this.deilOrdSundur();
                    this.ordSumErMarkerad = "e"+this.ordSumErMarkerad;
                    this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                    
                    //Flyt gomlu akkordina til fyrra partin av orðinum.
                    this.ordSumErMarkerad = "f"+this.ordSumErMarkerad.substring(1,this.ordSumErMarkerad.length);
                    
                    tempAkkord[1] = this.akkordirISangi[this.vers][this.ordSumErMinkad+""][1];
                    if(this.akkordirISangi[this.vers][this.ordSumErMinkad+""][2] || this.akkordirISangi[this.vers][this.ordSumErMinkad+""][2] == "0") {
                        tempAkkord[2] = this.akkordirISangi[this.vers][this.ordSumErMinkad+""][2];
                    }
                    
                    this.koyrAkkIdomOgAkkObj(tempAkkord);
                    
                    delete this.akkordirISangi[this.vers][this.ordSumErMinkad+""][1];
                    if(this.akkordirISangi[this.vers][this.ordSumErMinkad+""][2] || this.akkordirISangi[this.vers][this.ordSumErMinkad+""][2] == "0") {
                        delete this.akkordirISangi[this.vers][this.ordSumErMinkad+""][2];
                    }
                }
                else {
                    this.deilOrdSundur();
                    this.ordSumErMarkerad = "e"+this.ordSumErMarkerad;
                    this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                }
                
            }
            else {
                this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                this.innsetAkkordVeljara(this.ordSumErMarkerad, this.bokstavurSumErMarkeradur, 2);
            }
        
            //Rudda upp
            if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][1] && this.akkordirISangi[this.vers]["zyz"] == "zyz") {
                delete this.akkordirISangi[this.vers]["zyz"];
            }
        }
        else {
            this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
            
            this.innsetAkkordVeljara(this.ordSumErMarkerad, this.bokstavurSumErMarkeradur, 2);
        }
    },
    
    koyrAkkIdomOgAkkObj : function(akkordir) {
        var akkordHaldari;
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
        
        //Koyr akkordir í akkord-objektið
        if(!this.akkordirISangi[this.vers]) {
            this.akkordirISangi[this.vers] = {};
        }
        
        this.akkordirISangi[this.vers][this.ordSumErMarkerad+""] = akkordir;
        
        //Koyr akkordir í DOM
        akkordHaldari = document.createElement("span");
        akkordHaldari.setAttribute("class","akkord");
        akkordHaldari.setAttribute("id","akk"+this.ordSumErMarkerad+"-innan");
        
        if(akkordir[1] | akkordir[1] == "0") {
            tempAkk = this.akkordir1[akkordir[1]];
        }
        if(akkordir[2] | akkordir[2] == "0") {
            tempAkk += this.akkordir2[akkordir[2]] + "";
        }
        
        akkordHaldari.appendChild(document.createTextNode(tempAkk));
        
        //Um valda plássið er eitt millumrúm
        if(this.ordSumErMarkerad[0] == "m") {
            
            //Ger tvey pláss til nýggjar akkordir á ávikavist høgru og vinstru síðu, men bert um ongin akkord longu er.
            //Um tað longu er ein akkord skal hon yvirskrivast og onki meira skal henda.
            if(document.getElementById('akk'+this.ordSumErMarkerad).innerHTML == '') {
                nyttAkkPlassFyrr = document.createElement("span");
                nyttAkkPlassFyrr.appendChild(document.createTextNode("\u00A0"));
                nyttAkkPlassFyrr.setAttribute("id", this.ordSumErMarkerad + "f" + "-1");
                nyttAkkPlassFyrr.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'"+this.ordSumErMarkerad+"f"+"\',1);");
                nyttAkkPlassFyrr.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara(\'"+this.ordSumErMarkerad+"f"+"\',1,1)");
                
                nyAkkordHaldariFyrr = document.createElement("span");
                nyAkkordHaldariFyrr.setAttribute("style","position:absolute;");
                nyAkkordHaldariFyrr.setAttribute("id", "akk"+this.ordSumErMarkerad+"f");
                
                $(nyAkkordHaldariFyrr).insertBefore('#akk' + this.ordSumErMarkerad);
                $(nyttAkkPlassFyrr).insertBefore('#akk' + this.ordSumErMarkerad);
                
                nyttAkkPlassEftir = document.createElement("span");
                nyttAkkPlassEftir.appendChild(document.createTextNode("\u00A0"));
                nyttAkkPlassEftir.setAttribute("id", this.ordSumErMarkerad + "e" + "-1");
                nyttAkkPlassEftir.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'"+this.ordSumErMarkerad+"e"+"\',1);");
                nyttAkkPlassEftir.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara(\'"+this.ordSumErMarkerad+"e"+"\',1,1)");
                
                nyAkkordHaldariEftir = document.createElement("span");
                nyAkkordHaldariEftir.setAttribute("style","position:absolute;");
                nyAkkordHaldariEftir.setAttribute("id", "akk"+this.ordSumErMarkerad+"e");
                
                $(nyttAkkPlassEftir).insertAfter('#' + this.ordSumErMarkerad + "-1");
                $(nyAkkordHaldariEftir).insertAfter('#' + this.ordSumErMarkerad + "-1");
                
            }
        }
        
        //Koyr akkord í akkordhaldara.
        document.getElementById("akk"+this.ordSumErMarkerad).innerHTML = "";
        document.getElementById("akk"+this.ordSumErMarkerad).appendChild(akkordHaldari);
        
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
            
            //this.ordSumErMinkad = null;
            this.markeringByrjan = null;
            this.markeringEndi = null;
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