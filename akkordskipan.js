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
    akkordir1 : ["","A","Bb","H","C","C#","D","D#","E","F","F#","G","G#"],
    akkordir2 : ["","m", "7", "m7", "maj7", "m-maj7", "sus2", "sus4", "dimm", "aug"],
    akkordir3 : ["","/A","/Bb","/H","/C","/C#","/D","/D#","/E","/F","/F#","/G","/G#"],
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
        var akkord = {};
        var ordId;
        var akkordId;
        var i;
        var e = 0;
        var n = 0;
        var storstaBokstId = 0;
        var fyrstaAkkord;
        var peikarA = false;
        
        if(skra.songKeeper[UISangId] && skra.songKeeper[UISangId].sang.sang_akkordir[versId]) {
            $.each(skra.songKeeper[UISangId].sang.sang_akkordir[versId], function(index,value) {
                akkordSkipan.ordSumErMarkerad = index;
                
                //millumrúmsakkordir
                if(index[0] === 'm') {
                    //Finn akkord sum ongin onnur akkord peikar á
                    $.each(value, function(key, val) {
                        peikarA = false;
                        $.each(value, function(k, v) {
                            if(v['n'] == key) {
                                peikarA = true;
                            }
                        });
                        if(!peikarA) {
                            fyrstaAkkord = key;
                            n = val['n'];
                        }
                        return peikarA;
                    });
                    
                    //Far ígjøgnum linkaða listan og koyr akkordir í skipanina
                    akkordSkipan.ordSumErMarkerad = index;
                    akkordSkipan.bokstavurSumErMarkeradur = 1;
                    akkordSkipan.velAkkord(value[fyrstaAkkord][1],1);
                    
                    if(typeof value[fyrstaAkkord][2] !== "undefined") {
                        akkordSkipan.velAkkord(value[fyrstaAkkord][2],2);
                    }
                    
                    while(typeof value[n]['n'] !== "undefined") {
                        akkordSkipan.bokstavurSumErMarkeradur = akkordSkipan.bokstavurSumErMarkeradur + 2;
                        akkordSkipan.markeringByrjan = akkordSkipan.bokstavurSumErMarkeradur;
                        akkordSkipan.velAkkord(value[n][1],1);
                        
                        if(typeof value[n][2] !== "undefined") {
                            akkordSkipan.velAkkord(value[n][2],2);
                        }
                        
                        n = value[n]['n'];
                    }
                    //Síðsta virði kemur ikki við í loopið
                    akkordSkipan.bokstavurSumErMarkeradur = akkordSkipan.bokstavurSumErMarkeradur + 2;
                    akkordSkipan.markeringByrjan = akkordSkipan.bokstavurSumErMarkeradur;
                    akkordSkipan.velAkkord(value[n][1],1);
                    
                    if(typeof value[n][2] !== "undefined") {
                        akkordSkipan.velAkkord(value[n][2],2);
                    }
                }
                
                //vanligar akkordir
                else {
                    $.each(value, function(key, val) {
                        akkordSkipan.bokstavurSumErMarkeradur = key;
                        akkordSkipan.markeringByrjan = key;
                        akkordSkipan.velAkkord(val[1],1);
                        if(typeof val[2] !== "undefined") {
                            akkordSkipan.velAkkord(val[2],2);
                        }
                        
                        akkordSkipan.markeringByrjan = null;
                    });
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
        
        for(i=1; i<tempAkkordir.length; i++) {
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
        if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""][this.bokstavurSumErMarkeradur+""]) {
            strikaLink = document.createElement("a");
            strikaLink.setAttribute("href", "#");
            strikaLink.setAttribute("class", "akkord_link");
            strikaLink.setAttribute("onclick", "akkordSkipan.strikaAkkord('"+this.ordSumErMarkerad+"','"+this.bokstavurSumErMarkeradur+"');");
            
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
        var akkordTilVinstru;
        var akkordTilHogru;
        var akkordNavn;
        var okkurtPeikarA = false;
        var fyrstaAkkord;
        var tempE, tempH;
        var markOrd = this.ordSumErMarkerad,
        markBokstv = this.bokstavurSumErMarkeradur;
        
        document.getElementById("jFylg").innerHTML = "";
        
        if(akkordMenu == 1) {
            this.akkordUndirGerd = {};
        }
        
        this.akkordUndirGerd[akkordMenu] = akkordNr;
        
        //Um ein akkord longu er á orðinum.
        if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][markOrd+""]) {
        }
        else if(markOrd != this.ordSumErMinkad) {
            this.markeringByrjan = 1;
        }
        
        //Um akkordin verður koyrd á eitt millumrúm
        if(this.ordSumErMarkerad[0] == "m") {
            //Ger grannar um ongin akkord finst.
            if(!this.akkordirISangi[this.vers] || !this.akkordirISangi[this.vers][markOrd+""] || !this.akkordirISangi[this.vers][markOrd+""][markBokstv+""]) {
                this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                
                //Ger broytingar í akkord objektinum soleiðis at ein linkaður listi verður bygdur
                
                //Er ein akkord á vinstru síðu?
                $.each(this.akkordirISangi[this.vers][markOrd+""], function(key, val){
                    if(val['h'] == markBokstv+"") {
                        akkordTilVinstru = key;
                    }
                });
                
                //Er ein akkord á høgru síðu?
                if($('#'+markOrd+"-"+markBokstv).next().attr('id').substring(0,3) === 'akk') {
                    akkordNavn = $('#'+markOrd+"-"+markBokstv).next().attr('id').split('-');
                    
                    akkordTilHogru = akkordNavn[1];
                }
                
                if(typeof akkordTilVinstru !== "undefined") {
                    
                    if(typeof akkordTilHogru !== "undefined") {
                        this.akkordirISangi[this.vers][markOrd][markBokstv]['n'] = this.akkordirISangi[this.vers][markOrd][akkordTilVinstru]['n']
                    }
                    this.akkordirISangi[this.vers][markOrd][akkordTilVinstru]['n'] = markBokstv;
                }
                else {
                    if(typeof akkordTilHogru !== "undefined") {
                        this.akkordirISangi[this.vers][markOrd][markBokstv]['n'] = akkordTilHogru;
                    }
                }
                
                this.gerMillumrumGrannar(markOrd,markBokstv);
                
            }
            else {
                //sikra fyri at h og e ikki fara burtur
                if(typeof this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['e'] !== "undefined") {
                    tempE = this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['e'];
                }
                tempH = this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['h'];
                
                this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                
                if(typeof this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['e'] !== "undefined") {
                    this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['e'] = tempE;
                }
                this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['h'] = tempH;
            }
        }
        else {
            this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
        }
        
        this.innsetAkkordVeljara(this.ordSumErMarkerad, this.bokstavurSumErMarkeradur, 2);
    },
    
    gerMillumrumGrannar : function(mOrd, mBokstv) {
        var nyttMillumrumFyrr, nyttMillumrumEftir;
        var haegstaBokstavsId = 1;
        
        //finn tað størsta bókstavs-id í valda orðinum
        if(this.akkordirISangi[this.vers][mOrd+""]) {
            $.each(this.akkordirISangi[this.vers][mOrd+""], function(key, val) {
                if(val && val['h'] > haegstaBokstavsId) {
                    haegstaBokstavsId = val['h'];
                }
            });
        }
        
        haegstaBokstavsId++;
        nyttMillumrumFyrr = document.createElement("span");
        nyttMillumrumFyrr.appendChild(document.createTextNode("\u00A0"));
        nyttMillumrumFyrr.setAttribute("id", mOrd + "-" + haegstaBokstavsId);
        nyttMillumrumFyrr.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'"+mOrd+"\',\'"+haegstaBokstavsId+"\')");
        nyttMillumrumFyrr.setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara(\'"+mOrd+"\', \'"+haegstaBokstavsId+"\',1)");
        
        //fortel foreldrinum til vinstru hvat nýtt barn tað eigur á sínu høgru síðu
        $.each(this.akkordirISangi[this.vers][mOrd+""], function(lykil, virdi) {
            if(virdi && virdi['h'] == mBokstv) {
                virdi['h'] = haegstaBokstavsId;
            }
        });
        
        haegstaBokstavsId++;
        nyttMillumrumEftir = document.createElement("span");
        nyttMillumrumEftir.appendChild(document.createTextNode("\u00A0"));
        nyttMillumrumEftir.setAttribute("id", mOrd + "-" + haegstaBokstavsId);
        nyttMillumrumEftir.setAttribute("onmouseover", "akkordSkipan.markeraOrd(\'"+mOrd+"\',\'"+haegstaBokstavsId+"\')");
        nyttMillumrumEftir.setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara(\'"+mOrd+"\',\'"+haegstaBokstavsId+"\',1)");
        
        //Fortel hesum foreldrinum hvat fyri barn tað eigur á sínu høgru síðu
        this.akkordirISangi[this.vers][mOrd+""][mBokstv+""]["h"] = haegstaBokstavsId;
        
        $(nyttMillumrumFyrr).insertBefore('#akk' + mOrd + '-' + mBokstv);
        $(nyttMillumrumEftir).insertAfter('#' + mOrd + '-' + mBokstv);
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
        var bokst;
        var vinstraAkk;
        
        //bygg akkord-objekt upp
        if(!this.akkordirISangi[this.vers]) {
            this.akkordirISangi[this.vers] = {};
        }
        
        if(!this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]) {
            this.akkordirISangi[this.vers][this.ordSumErMarkerad+""] = {"xyz":"xyz"};
        }
        
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
        
        //Tilpassa akkordirnar so tær ikki verða viklaðar saman
        this.flytTekstFyriAkk(tempAkk,this.ordSumErMarkerad, this.markeringByrjan);
        
        bokst = $('#'+this.ordSumErMarkerad+"-"+this.markeringByrjan);
        bokst = $(bokst).prev();
        do {
            bokst = $(bokst).prev();
        } while(bokst.attr("id") !== "jFylg" && bokst[0].outerHTML !== "<br>" && bokst.attr("id").substring(0,3) !== "akk");
        
        
        vinstraAkk = bokst.attr("id");
        
        this.flytTekstFyriAkk("", "", "", vinstraAkk);
    },

    flytTekstFyriAkk : function(akkord, ord, bokst, akkString) {
        var tekinIAkk;
        var i;
        var valdiBokst;
        var akkPettir;
        var ordOgBokst;
        var akkordFunnin = false;
        
        if(typeof akkString !== "undefined" && akkString !== "jFylg") {
            akkPettir = akkString.split("akk");
            ordOgBokst = akkPettir[1].split("-");
            
            ord = ordOgBokst[0];
            bokst = ordOgBokst[1];
            akkord = document.getElementById(akkString + "-innan").innerHTML;
            
            this.ordSumErMarkerad = ord;
            this.bokstavurSumErMarkeradur = bokst;
        }
        
        tekinIAkk = akkord.length;
        
        valdiBokst = $('#'+ord+"-"+bokst);
        
        for(i=0; i<tekinIAkk; i++) {
            valdiBokst = $(valdiBokst).next();
            if(valdiBokst[0].outerHTML === "<br>") {
                break;
            }
            if(valdiBokst[0].childElementCount > 0) {
                akkordFunnin = true;
                break;
            }
        }
        //leggi helvtina aftrat fyri at gera i meira følsamt
        if((i*1.5)<tekinIAkk) {
            document.getElementById(this.ordSumErMarkerad+"-"+this.bokstavurSumErMarkeradur).setAttribute("style", "margin-right:"+(tekinIAkk/2)+"em");
        }
        else {
            document.getElementById(this.ordSumErMarkerad+"-"+this.bokstavurSumErMarkeradur).removeAttribute("style");
        }
    },
    
    strikaAkkord : function(markeraOrd, markeradurbokstv) {
        var stringMarkerad = this.ordSumErMarkerad + "";
        var prefix = stringMarkerad.substring(0,1);
        var ord = stringMarkerad.substring(1,stringMarkerad.length);
        var i;
        var hevurAkkordir = false;
        var talAvAkkordum = 0;
        var peikarAHesa;
        var akkordTilHogru;
        
        if(prefix === "m") {
            //viðlíkahaldsarbeiði fyri at fáa linkaða listan at hanga saman
            
            //kanna akkordlistan í hesum orðinum.
            $.each(this.akkordirISangi[this.vers][markeraOrd], function(lykil, virdi) {
                talAvAkkordum++;
                if(virdi['n'] === markeradurbokstv) {
                    peikarAHesa = lykil;
                }
            });
            if(typeof this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv]['n'] !== "undefined") {
                akkordTilHogru = this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv]['n'];
            }
            
            
            if(talAvAkkordum > 1) {
                //um ein akkord er til vinstru
                if(typeof peikarAHesa !== "undefined") {
                    //um ein akkord er til høgru
                    if(typeof akkordTilHogru !== "undefined") {
                        this.akkordirISangi[this.vers][markeraOrd][peikarAHesa]['n'] = this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv]['n'];
                    }
                    else {
                        this.akkordirISangi[this.vers][markeraOrd][peikarAHesa]['n'] = undefined;
                    }
                }
            }
            
            //sletta barnið til høgru
            document.getElementById("sangPlass").removeChild(document.getElementById(markeraOrd+"-"+this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv]['h']));
            
            //sletta hesa akkordina
            document.getElementById("akk"+markeraOrd+"-"+markeradurbokstv).removeChild(document.getElementById("akk"+markeraOrd+"-"+markeradurbokstv+"-innan"));
            document.getElementById("sangPlass").removeChild(document.getElementById("akk"+markeraOrd+"-"+markeradurbokstv));
            if(talAvAkkordum > 1) {
                document.getElementById("sangPlass").removeChild(document.getElementById(markeraOrd+"-"+markeradurbokstv));
            }
            else if(talAvAkkordum === 1) {
                $('#'+markeraOrd+"-"+markeradurbokstv).prev().remove();
            }
            delete this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv];
            
            if(talAvAkkordum === 2) {
                //Um bert ein akkord eftir sletting; broyt bókstavsID til 1
                $.each(this.akkordirISangi[this.vers][markeraOrd], function(lyk, vir) {
                    if(lyk !== "1") {
                        document.getElementById(markeraOrd+"-"+lyk).setAttribute("onmouseover", "akkordSkipan.markeraOrd('"+markeraOrd+"',1)");
                        document.getElementById(markeraOrd+"-"+lyk).setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara('"+markeraOrd+"',1,1)");
                        document.getElementById(markeraOrd+"-"+lyk).setAttribute("id",markeraOrd+"-1");
                        
                        document.getElementById("akk"+markeraOrd+"-"+lyk+"-innan").setAttribute("id", "akk"+markeraOrd+"-1-innan");
                        document.getElementById("akk"+markeraOrd+"-"+lyk).setAttribute("id", "akk"+markeraOrd+"-1");
                        
                        akkordSkipan.akkordirISangi[akkordSkipan.vers][markeraOrd][1] = vir;
                        delete akkordSkipan.akkordirISangi[akkordSkipan.vers][markeraOrd][lyk];
                    }
                });
            }
        }
        else {
            delete this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv];
            document.getElementById("akk"+markeraOrd+"-"+markeradurbokstv).removeChild(document.getElementById("akk"+markeraOrd+"-"+markeradurbokstv+"-innan"));
            document.getElementById("sangPlass").removeChild(document.getElementById("akk"+markeraOrd+"-"+markeradurbokstv));
        }
        
        if(jQuery.isEmptyObject(this.akkordirISangi[this.vers][markeraOrd])) {
            delete this.akkordirISangi[this.vers][markeraOrd];
        }
        if(jQuery.isEmptyObject(this.akkordirISangi[this.vers])) {
            delete this.akkordirISangi[this.vers];
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