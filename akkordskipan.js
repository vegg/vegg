var akkord = function(akk1, akk2, akk3) {
    var akkordir1 = ["","A","Bb","H","C","C#","D","D#","E","F","F#","G","G#"],
        akkordir2 = ["","m", "7", "m7", "maj7", "m-maj7", "sus2", "sus4", "dimm", "aug"],
        akkordir3 = ["","/A","/Bb","/H","/C","/C#","/D","/D#","/E","/F","/F#","/G","/G#"],
        akkUndirGerd = ["", "", ""];
        akkJSON = {};
    
    akkJSON[1] = akk1 || undefined;
    akkJSON[2] = akk2 || undefined;
    akkJSON[3] = akk3 || undefined;
    
    akkUndirGerd[0] = akkordir1[akk1] || "";
    akkUndirGerd[1] = akkordir2[akk2] || "";
    akkUndirGerd[2] = akkordir3[akk3] || "";
    
    return {
        addAkk : function(akkNr,akkList) {
            if(akkList === 1) {
                akkUndirGerd[0] = akkordir1[akkNr];
                akkJSON[1] = akkNr;
            }
            else if(akkList === 2) {
                akkUndirGerd[1] = akkordir2[akkNr];
                akkJSON[2] = akkNr;
            }
            else if(akkList === 3) {
                akkUndirGerd[2] = akkordir3[akkNr];
                akkJSON[3] = akkNr;
            }
        },
        removeAkk : function(akkList) {
            akkUndirGerd[akkList-1] = "";
            akkJSON[akkList] = undefined;
        },
        toString: function() {
            return akkUndirGerd[0] + akkUndirGerd[1] + akkUndirGerd[2];
        },
        toJSON : function() {
            return {
                1 : akkJSON[1] || undefined,
                2 : akkJSON[2] || undefined,
                3 : akkJSON[3] || undefined
            };
        }
    };
};

var akkordSkipan = {
    vers : -1,
    sangIdDb: undefined,
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
    chordUndirGerd : undefined,
    sangTekstKelda : undefined,
    akkordKelda : undefined,
    kelduSlag : "",
    transponering : 143,
    akkordListiUppi : false,
    opinAkkListi : 0,
    sangurinErNyggjur : true,
    
    tendra : function(kelduSlag, UISangId, versId) {
        //Heintar frá skra objektinum í lutir.js
        if(kelduSlag === "skra") {
            this.vers = versId;
            this.sangTekstKelda = skra.songKeeper[UISangId].sang.sang_innihald['vers'+versId];
            if(skra.songKeeper[UISangId] !== "undefined" && skra.songKeeper[UISangId].sang.sang_akkordir[versId] !== "undefined") {
                this.akkordKelda = skra.songKeeper[UISangId].sang.sang_akkordir[versId];
            }
            
            this.kelduSlag = "skra";
            
            this.innVidSangi(UISangId, versId);
        }
        //Heintar via long-polling frá databasanum
        else if(kelduSlag === "akkfeed") {
            this.heintaEinaferd();
            this.heinta();
        }
    },
    
    heintaEinaferd : function() {
        $.ajax({
            url:"feed.php",
            type: "post",
            data: {slag:"akkfeed1"},
            success:function(data) {
                if(data != "") {
                    
                    akkordSkipan.sangurinErNyggjur = akkordSkipan.sangIdDb != data.sang.sangid;
                    
                    akkordSkipan.sangIdDb = data.sang.sangid;
                    delete data.sang.sangid;
                    
                    document.getElementById("sang").innerHTML = "";
                    $.each(data.sang, function(index, value) {
                        akkordSkipan.vers = index;
                        akkordSkipan.sangTekstKelda = data.sang[index];
                        akkordSkipan.akkordKelda = data.akkordir[index];
                        akkordSkipan.innVidSangi(0, index, "akkfeed");
                    });
                    akkordSkipan.kelduSlag = "akkfeed";
                    
                    if(!akkordSkipan.sangurinErNyggjur) {
                        akkordSkipan.transponera(akkordSkipan.transponering);
                    }
                    else {
                        akkordSkipan.transponera("nullstilla");
                    }
                }
            }, dataType: "json"
        });
    },
    
    heinta: function() {
        $.ajax({
            url:"feed.php",
            type: "post",
            data: {slag:"akkfeed+"},
            success:function(data) {
                if(data != "") {
                    akkordSkipan.sangurinErNyggjur = akkordSkipan.sangIdDb != data.sang.sangid;
                    
                    akkordSkipan.sangIdDb = data.sang.sangid;
                    delete data.sang.sangid;
                    
                    document.getElementById("sang").innerHTML = "";
                    $.each(data.sang, function(index, value) {
                        akkordSkipan.vers = index;
                        akkordSkipan.sangTekstKelda = data.sang[index];
                        akkordSkipan.akkordKelda = data.akkordir[index];
                        akkordSkipan.innVidSangi(0, index, "akkfeed");
                    });
                    akkordSkipan.kelduSlag = "akkfeed";
                    
                    if(!akkordSkipan.sangurinErNyggjur) {
                        akkordSkipan.transponera(akkordSkipan.transponering);
                    }
                    else {
                        akkordSkipan.transponera("nullstilla");
                    }
                }
            }, dataType: "json", complete: akkordSkipan.heinta, timeout: 30000
        });
    },
    
    // 1. Funktiónir til at legga sangin inná GUI
    innVidSangi : function(UISangId, versId, kelduSlag) {
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
        var tempAkkId;
        
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
        this.chordUndirGerd = undefined;
        
        if(typeof kelduSlag === "undefined") {
            kelduSlag = "";
        }
        
        sangPlass = document.createElement("div");
        //sangPlass.setAttribute("id","sangPlass");
        //sangPlass.setAttribute("class","sangPlass");
        sangPlass.setAttribute("id","sangPlass" + versId);
        sangPlass.setAttribute("class","sangPlass");
        
        if(kelduSlag !== "akkfeed") {
            if(document.getElementById("undansyning_tekst")) {
                document.getElementById("undansyning_tekst").innerHTML = "";
            }
            else {
                undansyning.skapaUndansyning();
            }
        }
        /*else {
            document.getElementById("sang").innerHTML = "";
        }*/
        
        if(kelduSlag !== "akkfeed") {
            goymLink = document.createElement("a");
            goymLink.setAttribute("href","#");
            goymLink.setAttribute("onclick","akkordSkipan.goymAkkordir();");
            goymLink.appendChild(document.createTextNode("Goym"));
            document.getElementById("akkordKnott").innerHTML = "";
            document.getElementById("akkordKnott").appendChild(goymLink);
        }
        
        jFylg = document.createElement("div");
        jFylg.setAttribute("id","jFylg");
        sangPlass.appendChild(jFylg);
        
        this.pettaSangSundurIOrd(/*UISangId,versId*/);
        
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
                    
                    //bokstavurTilDOM.setAttribute("id", (i+1) + "-" + (j+1));
                    bokstavurTilDOM.setAttribute("id", this.vers + "-" + (i+1) + "-" + (j+1));
                    bokstavurTilDOM.setAttribute("class", "musIkkiYvir");
                    
                    if(kelduSlag !== "akkfeed") {
                        //bokstavurTilDOM.setAttribute("onmouseover", "akkordSkipan.markeraOrd("+(i+1)+","+(j+1)+"); akkordSkipan.innsetMinkaraOgStorrara("+(i+1)+","+(j+1)+")");
                        //bokstavurTilDOM.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara("+(i+1)+","+(j+1)+",1)");
                        
                        bokstavurTilDOM.setAttribute("onmouseover", "akkordSkipan.markeraOrd("+versId+ "," +(i+1)+","+(j+1)+"); akkordSkipan.innsetMinkaraOgStorrara("+versId+ ","+(i+1)+","+(j+1)+")");
                        //bokstavurTilDOM.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara("+versId+","+(i+1)+","+(j+1)+",1)");
                    }
                    
                    sangPlass.appendChild(bokstavurTilDOM);
                    
                    /*$(bokstavurTilDOM).click(function() {
                        alert(j);
                    });*/
                }
            }
            
            //Ger eitt millumrúm aftaná hvørt orð
            
            
            millumrum = document.createElement("span");
            millumrumTekstur = document.createTextNode("\u00A0");
            millumrum.appendChild(millumrumTekstur);
            
            
            millumrum.setAttribute("id", versId+ "-m" + (i+1) + "-" + 1);
            if(kelduSlag !== "akkfeed") {   
                millumrum.setAttribute("onmouseover", "akkordSkipan.markeraOrd("+versId+ ",\'m"+(i+1)+"\',1);");
               //millumrum.setAttribute("onclick","akkordSkipan.innsetAkkordVeljara("+versId+ ",\'m"+(i+1)+"\',1,1)");
            }
            
            sangPlass.appendChild(millumrum);
            
            if(kelduSlag !== "akkfeed") {
                document.getElementById("undansyning_tekst").appendChild(sangPlass);
            }
            else {
                document.getElementById("sang").appendChild(sangPlass);
            }
        }
        
        if(kelduSlag !== "akkfeed") {
            this.eventHandlersABokstavar(versId);
        }
        
        this.innVidAkkordum(/*UISangId, versId*/);
        
    },
    
    eventHandlersABokstavar : function(versId) {
        $("div.sangPlass > [id*='"+versId+"-']").click(function(e) {
            var idPettir;
            
            if(!dokumentLutur.menuOpin && dokumentLutur.menuId !== "akkordVeljiListi") {
                if(e.preventDefault)
                    e.preventDefault(); //Mozilla
                else
                    e.returnValue = false; //IE
                
                //alt annað enn IE8 og eldri
                if('bubbles' in e) {
                    if(e.bubbles) {
                        e.stopPropagation();
                    }
                }
                //IE8 og eldri
                else {
                    e.cancelBubble = true;
                }
                
                idPettir = $(this).attr('id').split('-');
                
                dokumentLutur.menuOpin = true;
                dokumentLutur.menuId = "akkordVeljiListi";
                
                akkordSkipan.innsetAkkordVeljara(idPettir[0],idPettir[1],idPettir[2],1);
            
            }
            
        });
    },
    
    innVidAkkordum : function(/*UISangId, versId*/) {
        var versOgAkkordir = [];
        var akkordir = [];
        var einAkkord = [];
        //var akkord = {};
        var ordId;
        var akkordId;
        var i;
        var e = 0;
        var n = 0;
        var storstaBokstId = 0;
        var fyrstaAkkord;
        var peikarA = false;
        var talAvAkk = 0;
        var chord;
        
        if(typeof this.akkordKelda !== "undefined") {
            $.each(this.akkordKelda, function(index,value) {
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
                    talAvAkk = 0;
                    $.each(value, function(k, v) {
                        talAvAkk++;
                    });
                    
                    //Far ígjøgnum linkaða listan og koyr akkordir í skipanina
                    akkordSkipan.ordSumErMarkerad = index;
                    akkordSkipan.bokstavurSumErMarkeradur = 1;
                    /*
                    akkordSkipan.velAkkord(value[fyrstaAkkord][1],1);
                    
                    if(typeof value[fyrstaAkkord][2] !== "undefined") {
                        akkordSkipan.velAkkord(value[fyrstaAkkord][2],2);
                    }*/
                    
                    chord = akkord(value[fyrstaAkkord][1], value[fyrstaAkkord][2], value[fyrstaAkkord][3]);
                    akkordSkipan.velAkkord(chord,10);
                    
                    
                    if(talAvAkk > 1) {
                        while(typeof value[n] !== "undefined" && typeof value[n]['n'] !== "undefined") {
                            akkordSkipan.bokstavurSumErMarkeradur = akkordSkipan.bokstavurSumErMarkeradur + 2;
                            akkordSkipan.markeringByrjan = akkordSkipan.bokstavurSumErMarkeradur;
                            
                            /*
                            akkordSkipan.velAkkord(value[n][1],1);
                            
                            if(typeof value[n][2] !== "undefined") {
                                akkordSkipan.velAkkord(value[n][2],2);
                            }
                            */
                            
                            chord = akkord(value[n][1], value[n][2], value[n][3]);
                            akkordSkipan.velAkkord(chord,10);
                            
                            n = value[n]['n'];
                        }
                        //Síðsta virði kemur ikki við í loopið
                        akkordSkipan.bokstavurSumErMarkeradur = akkordSkipan.bokstavurSumErMarkeradur + 2;
                        akkordSkipan.markeringByrjan = akkordSkipan.bokstavurSumErMarkeradur;
                        
                        /*
                        akkordSkipan.velAkkord(value[n][1],1);
                        
                        if(typeof value[n][2] !== "undefined") {
                            akkordSkipan.velAkkord(value[n][2],2);
                        }
                        
                        */
                        
                        chord = akkord(value[n][1], value[n][2], value[n][3]);
                        akkordSkipan.velAkkord(chord,10);
                    }
                }
                
                //vanligar akkordir
                else {
                    $.each(value, function(key, val) {
                        akkordSkipan.bokstavurSumErMarkeradur = key;
                        akkordSkipan.markeringByrjan = key;
                        
                        /*
                        akkordSkipan.velAkkord(val[1],1);
                        if(typeof val[2] !== "undefined") {
                            akkordSkipan.velAkkord(val[2],2);
                        }
                        */
                        
                        chord = akkord(val[1], val[2], val[3]);
                        akkordSkipan.velAkkord(chord,10);
                        
                        akkordSkipan.markeringByrjan = null;
                    });
                }
            });
            akkordSkipan.ordSumErMarkerad = 0;
        }
    },
    
    pettaSangSundurIOrd : function(/*UISangId,versId*/) {
        var i;
        //var setningar = skra.songKeeper[UISangId].sang.sang_innihald['vers'+versId].split('<br>');
        var setningar = this.sangTekstKelda.split('<br>')
        var sundurSkildOrd = [];
        
        //petta setningarnar sundur í orð, koyr teir saman í eitt array við <br> ímillum hvønn einstakan.
        for(i=0; i<setningar.length; i++) {
            sundurSkildOrd = setningar[i].split(' ');
            this.ollOrdini = this.ollOrdini.concat(sundurSkildOrd, '<br>');
        }
    },
    
    innsetMinkaraOgStorrara : function(vId, ordId, bokstavId) {
        if(!dokumentLutur.menuOpin/*!this.akkordListiUppi*/) {
            var p = $("#"+ vId+ "-" + ordId+ "-" +bokstavId);
            var position = p.position();
            
            var vinstra = position.left-10;
            var ovara = position.top+20;
            
            document.getElementById("jFylg").style.position = "absolute";
            document.getElementById("jFylg").style.top = ovara + "px";
            document.getElementById("jFylg").style.left = vinstra + "px";
            document.getElementById("jFylg").innerHTML =
                '<a href="#" onclick="akkordSkipan.vidkaMarkering(\''+ordId+'\', '+bokstavId+')" ><img src="grafikkur/pluss.png" style="z-index:2"></a><a href="#" onclick="akkordSkipan.minkaMarkering(\''+ordId+'\','+bokstavId+')"><img src="grafikkur/minus.png" style="z-index:2"></a>';
                
        }
    },

    // 2. Funktiónir til at markera orð og stilla markeringina
    
    markeraOrd: function(vId, ordId, bokstavId) {
        var i = 0;
        var j = 1;
        var halvMarkering = Math.floor(this.bokstavamongIMinkadumOrdi / 2);
        var bakkilongd = halvMarkering;
        var markeringByrjan;
        
        if(!dokumentLutur.menuOpin/*!this.akkordListiUppi*/) {
        
            //Strika alla fyrrverandi markering.
            if(this.ordSumErMarkerad) {
                this.strikaMarkering(this.ordSumErMarkerad);
                this.ordSumErMarkerad = 0;
            }
            
            if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][ordId]) {
                document.getElementById(vId + "-" +ordId+"-"+bokstavId).setAttribute('class', 'musYvir');
                this.markeringByrjan = bokstavId;
                
                if(document.getElementById("akk"+ vId +"-"+ ordId+"-"+bokstavId +"-innan")) {
                    document.getElementById("akk" + vId +"-" + ordId +"-"+ bokstavId + "-innan").setAttribute('class', 'akkordMusYvir');
                }
            }
            else if(ordId == this.ordSumErMinkad) {
                if(document.getElementById(vId + "-"+ordId + "-" + (bokstavId-bakkilongd))) { //Um markeringin heldur seg innanfyri orðið á vinstru síðu.
                    j = bokstavId-bakkilongd;
                    this.markeringByrjan = j;
                    if(document.getElementById(vId +"-" +ordId + "-" + (j + this.bokstavamongIMinkadumOrdi-1))) { //Um markeringin heldur seg innanfyri orðið á høgru síðu.
                        this.markeringEndi = j + this.bokstavamongIMinkadumOrdi - 1;
                        while(i < this.bokstavamongIMinkadumOrdi) {
                            document.getElementById(vId + "-" + ordId + "-" + j).setAttribute('class', 'musYvir');
                            if(document.getElementById("akk"+vId +"-" + ordId+"-innan")) {
                                document.getElementById("akk" +vId + "-" + ordId+"-innan").setAttribute('class', 'akkordMusYvir');
                            }
                            i++;
                            j++;
                        }
                    }
                    else {
                        //flyt alla markeringina so nógv pláss til vinstru sum er neyðugt.
                        this.markeraOrd(vId, ordId, bokstavId - ((j + this.bokstavamongIMinkadumOrdi) - this.telBokstavirIOrdi(ordId)));
                    }
                }
                else if(bokstavId - bakkilongd <= 0) {
                    //flyt alla markeringina so nógv pláss til høgru sum er neyðugt.
                    if(bokstavId-bakkilongd == 0) {
                        this.markeraOrd(vId, ordId, ((bokstavId-bakkilongd)*-1) + (bokstavId)+1);
                    }
                    else {
                        this.markeraOrd(vId, ordId, ((bokstavId-bakkilongd)*-1) + bokstavId);
                    }
                }
            }
            else {
                while(document.getElementById(vId + "-"+ordId + "-" + j)) {
                    document.getElementById(vId + "-" +ordId + "-" + j).setAttribute('class', 'musYvir');
                    if(document.getElementById("akk" + vId + "-" + ordId+"-innan")) {
                        document.getElementById("akk" + vId + "-" + ordId+"-innan").setAttribute('class', 'akkordMusYvir');
                    }
                    j++;
                }
                
            }
            this.ordSumErMarkerad = ordId;
            this.bokstavurSumErMarkeradur = bokstavId;
        }
    },
    
    strikaMarkering : function(ordId) {
        var i = 1;
        while(document.getElementById(this.vers + "-" +ordId + "-" + i)) {
            document.getElementById(this.vers + "-"+ordId + "-" + i).setAttribute('class', 'musIkkiYvir');
            if(document.getElementById("akk" + this.vers+ "-" + ordId+"-"+this.bokstavurSumErMarkeradur+"-innan")) {
                document.getElementById("akk" + this.vers + "-" + ordId+"-"+this.bokstavurSumErMarkeradur+"-innan").setAttribute('class', 'akkord');
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
                this.markeraOrd(this.vers,ordId, bokstvId);
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
            
            this.markeraOrd(this.vers, ordId, bokstvId);
        }
    },
    
    telBokstavirIOrdi: function(ordId) {
        var bokstavur = 1;
        
        while(document.getElementById(this.vers+"-"+ordId + "-" + bokstavur)) {
            bokstavur++;
        }
        
        return bokstavur-1;
    },
    
    // 3. Funktiónir til at velja akkord og seta hana inn í tekstin
    
    innsetAkkordVeljara : function(vId, ordId, bokstvId, akkordMenu) {
        var i;
        var p = $("#"+vId + "-" + ordId + "-" + bokstvId);
        var position = p.position();
        
        var vinstra = position.left-7;
        var ovara = position.top+20;
        
        var akkordListi = document.createElement("div");
        var akkordLink;
        
        this.opinAkkListi = akkordMenu;
        
        document.getElementById("jFylg").style.position = "absolute";
        document.getElementById("jFylg").style.top = ovara + "px";
        document.getElementById("jFylg").style.left = vinstra + "px";
        
        //akkordListi.setAttribute("class", "akkordVeljiListi");
        
        //this.byggAkkordLista(akkordListi,akkordMenu);
        this.buildChordList(akkordListi);
        
        document.getElementById("jFylg").innerHTML = "";
        
        document.getElementById("jFylg").appendChild(akkordListi);
        
        //Um grundtónin er defineraður, ger ein akkord2-lista
        /*if(this.akkordirISangi[vId] &&
           this.akkordirISangi[vId][ordId] &&
           this.akkordirISangi[vId][ordId][bokstvId] &&
           this.akkordirISangi[vId][ordId][bokstvId][1]) {*/
        
        if(this.akkordirISangi[vId]) {
            //alert("vers id");
            if(this.akkordirISangi[vId][ordId]) {
                //alert("orð id");
                if(this.akkordirISangi[vId][ordId][bokstvId]) {
                    //alert("bókstav id");
                    if(this.akkordirISangi[vId][ordId][bokstvId][1]) {
                        //alert("akkordlið 1");
                        this.addMidEntries();
                        this.addDeleteEntry(2,"midtoni");
                        
                        $("a[id*='akkmid']").click(function(e) {
                            akkliPettir = $(this).attr('id').split('-');
                            akkordSkipan.velAkkord(akkliPettir[1],2);
                            
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                }
            }
        }
        
        this.addDeleteEntry(1,"grundtoni");
        this.addDeleteEntry(3,"basstoni");
        
        $("a[id*='akkroot']").click(function(e) {
            akkliPettir = $(this).attr('id').split('-');
            akkordSkipan.velAkkord(akkliPettir[1],1);
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        $("a[id*='akkbass']").click(function(e) {
            akkliPettir = $(this).attr('id').split('-');
            akkordSkipan.velAkkord(akkliPettir[1],3);
            
            e.preventDefault();
            e.stopPropagation();
        });
    },
    
    buildChordList : function(akkordListi) {
        var i, j, rootEntry, rootEntryLink, midEntry, midEntryLink, bassEntry, bassEntryLink;
        var menuBody = document.createElement("div");
        var grundToni = document.createElement("ul");
        var bassToni = document.createElement("ul");
        var midToni = document.createElement("ul");
        
        grundToni.setAttribute("class","note");
        grundToni.setAttribute("id","grundtoni");
        midToni.setAttribute("class", "note");
        bassToni.setAttribute("class","note");
        bassToni.setAttribute("id","basstoni");
        
        for(i=1; i<this.akkordir1.length; i++) {
            rootEntry = document.createElement("li");
            bassEntry = document.createElement("li");
            
            rootEntryLink = document.createElement("a");
            rootEntryLink.setAttribute("href","#");
            rootEntryLink.setAttribute("id", "akkroot-"+i);
            rootEntryLink.setAttribute("class", "akkord_link");
            rootEntryLink.appendChild(document.createTextNode(this.akkordir1[i]));
            
            bassEntryLink = document.createElement("a");
            bassEntryLink.setAttribute("href","#");
            bassEntryLink.setAttribute("id", "akkbass-"+i);
            bassEntryLink.setAttribute("class", "akkord_link");
            bassEntryLink.appendChild(document.createTextNode("/"+this.akkordir1[i]));
            
            rootEntry.appendChild(rootEntryLink);
            grundToni.appendChild(rootEntry);
            
            bassEntry.appendChild(bassEntryLink);
            bassToni.appendChild(bassEntry);
        }
        
        menuBody.setAttribute("id", "menu-body");
        menuBody.setAttribute("class","menu-body");
        menuBody.appendChild(grundToni);
        
        menuBody.appendChild(bassToni);
        
        akkordListi.setAttribute("class","chord-menu");
        akkordListi.appendChild(menuBody);
    },
    
    addMidEntries : function() {
        var midEntries, midEntry, midEntryLink,j;
        
        midEntries = document.createElement("ul");
        midEntries.setAttribute("id","midtoni");
        midEntries.setAttribute("class","note");
        
        for(j=1; j<this.akkordir2.length; j++) {
            midEntry = document.createElement("li");
            midEntryLink = document.createElement("a");
            midEntryLink.setAttribute("href","#");
            midEntryLink.setAttribute("id", "akkmid-"+j);
            midEntryLink.setAttribute("class", "akkord_link");
            midEntryLink.appendChild(document.createTextNode(this.akkordir2[j]));
            
            midEntry.appendChild(midEntryLink);
            midEntries.appendChild(midEntry);
        }
        
        document.getElementById("menu-body").insertBefore(midEntries, document.getElementById("basstoni"));
    },
    
    addDeleteEntry : function(chordList, target) {
        var deleter = document.createElement("li"),
        deleterLink = document.createElement("a");
        
        deleterLink.setAttribute("id","delakk"+chordList);
        deleterLink.setAttribute("href","#");
        
        deleterLink.appendChild(document.createTextNode("Strika"));
        deleter.appendChild(deleterLink);
        
        document.getElementById(target).appendChild(deleter);
        
        $('#delakk'+chordList).click(function(e) {
            var countChords = 0, tempN, tempH;
            
            e.preventDefault();
            e.stopPropagation();
            
            if(akkordSkipan.markeringByrjan == 1) {
                akkordSkipan.bokstavurSumErMarkeradur = 1;
            }
            
            //tel hvussu nógvar akkordir eru í orðinum
            $.each(akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad+""][akkordSkipan.bokstavurSumErMarkeradur], function(key, val) {
                if(key == 1 || key == 2 || key == 3) {
                    if(val) {
                        countChords++;
                    }
                }
            });
            
            if(countChords === 1) {
                akkordSkipan.strikaAkkord(akkordSkipan.vers, akkordSkipan.ordSumErMarkerad, akkordSkipan.bokstavurSumErMarkeradur);
            }
            else if(countChords > 1) {
                
                //So at h og n ikki fara vekk.
                if(typeof akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad][akkordSkipan.bokstavurSumErMarkeradur]['n'] !== "undefined") {
                    tempN = akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad][akkordSkipan.bokstavurSumErMarkeradur]['n'];
                }
                tempH = akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad][akkordSkipan.bokstavurSumErMarkeradur]['h'];
                
                akkordSkipan.chordUndirGerd = akkord();
                for(j=1; j<=3; j++) {
                    if(akkordSkipan.akkordirISangi[akkordSkipan.vers] &&
                       akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad+""] &&
                       akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad+""][akkordSkipan.bokstavurSumErMarkeradur] &&
                       akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad+""][akkordSkipan.bokstavurSumErMarkeradur][j]) {
                        akkordSkipan.chordUndirGerd.addAkk(akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad+""][akkordSkipan.bokstavurSumErMarkeradur][j], j);
                    }
                }
                
                akkordSkipan.chordUndirGerd.removeAkk(chordList);
                akkordSkipan.koyrAkkIdomOgAkkObj(akkordSkipan.chordUndirGerd);
                
                if(typeof tempN !== "undefined") {
                    akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad][akkordSkipan.bokstavurSumErMarkeradur]['n'] = tempN;
                }
                akkordSkipan.akkordirISangi[akkordSkipan.vers][akkordSkipan.ordSumErMarkerad][akkordSkipan.bokstavurSumErMarkeradur]['h'] = tempH;
            }
            akkordSkipan.innsetAkkordVeljara(akkordSkipan.vers, akkordSkipan.ordSumErMarkerad, akkordSkipan.bokstavurSumErMarkeradur,1);
        });
        
        //vId, markeraOrd, markeradurbokstv, akkordLid
    },
    
    byggAkkordLista : function(akkordListi, akkMenu) {
        var akkord, akkordLink, i, tempAkkordir, strika, strikaLink, akkliPettir;
        
        if(akkMenu == 1) {
            tempAkkordir = this.akkordir1;
            //this.opinAkkListi = 2;
        }
        else if(akkMenu == 2) {
            tempAkkordir = this.akkordir2;
            //this.opinAkkListi = 3;
        }
        
        for(i=1; i<tempAkkordir.length; i++) {
            akkord = document.createElement("li");
            
            akkordLink = document.createElement("a");
            akkordLink.setAttribute("id", "akkli-"+i);
            akkordLink.setAttribute("href","#");
            akkordLink.setAttribute("class", "akkord_link");
            //akkordLink.setAttribute("onclick", "akkordSkipan.velAkkord("+i+", "+akkMenu+");");
            akkordLink.appendChild(document.createTextNode(tempAkkordir[i]));
            
            akkord.appendChild(akkordLink);
            
            //akkordLink.appendChild(akkord);
            akkordListi.appendChild(akkord);
        }
        
        //Um ein akkord finst á orðinum, ger møguleika at strika hana.
        if(this.akkordirISangi[this.vers] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""] && this.akkordirISangi[this.vers][this.ordSumErMarkerad+""][this.bokstavurSumErMarkeradur+""]) {
            strikaLink = document.createElement("a");
            strikaLink.setAttribute("href", "#");
            strikaLink.setAttribute("class", "akkord_link");
            strikaLink.setAttribute("onclick", "akkordSkipan.strikaAkkord("+this.vers+",'"+this.ordSumErMarkerad+"','"+this.bokstavurSumErMarkeradur+"');");
            strikaLink.appendChild(document.createTextNode("Strika"));
            
            strika = document.createElement("li");
            //strika.appendChild(document.createTextNode("Strika"));
            
            strika.appendChild(strikaLink);
            akkordListi.appendChild(strika);
            //strikaLink.appendChild(strika);
            //akkordListi.appendChild(strikaLink);
        }
    },
    
    velAkkord : function(akkordNr, akkordMenu) {
        var akkordHaldari,
        akkordTekstur,
        //akkord = {},
        tempAkkord = {},
        i,j,
        tempP,
        akkordTilVinstru,
        akkordTilHogru,
        akkordNavn,
        okkurtPeikarA = false,
        fyrstaAkkord,
        tempN, tempH,
        markOrd = this.ordSumErMarkerad,
        markBokstv = this.bokstavurSumErMarkeradur,
        temp,
        chordCount = 0;
        
        
        if(this.kelduSlag === "skra") {
            //document.getElementById("jFylg").innerHTML = "";
        }
        /*
        if(akkordMenu == 1) {
            this.akkordUndirGerd = {}; // skal slettast skjótt
            this.chordUndirGerd = akkord();
        }
        else if(akkordMenu == 3 && (!this.akkordirISangi[this.vers] || !this.akkordirISangi[this.vers][markOrd+""] || !this.akkordirISangi[this.vers][markOrd+""][markBokstv])) {
            this.chordUndirGerd = akkord();
        }
        */
        
        //Hetta verður true tá akkordirnar verða heintaðar frá kelduni.
        if(akkordMenu == 10) {
            this.chordUndirGerd = akkordNr;
        }
        /*
        this.akkordUndirGerd[akkordMenu] = akkordNr; // skal slettast skjótt
        this.chordUndirGerd.addAkk(akkordNr, akkordMenu);
        */
        
        //Hetta er true, tá ein akkord verður vald av brúkaranum
        else {
            //if(!this.chordUndirGerd) {
                this.chordUndirGerd = akkord();
            //}
            
            
            this.chordUndirGerd.addAkk(akkordNr, akkordMenu);
            
            if(this.markeringByrjan == 1) {
                markBokstv = 1;
            }

            for(j=1; j<=3; j++) {
                if(this.akkordirISangi[this.vers] &&
                   this.akkordirISangi[this.vers][markOrd+""] &&
                   this.akkordirISangi[this.vers][markOrd+""][markBokstv] &&
                   this.akkordirISangi[this.vers][markOrd+""][markBokstv][j]) {
                    if(akkordMenu != j) {
                        this.chordUndirGerd.addAkk(this.akkordirISangi[this.vers][markOrd+""][markBokstv][j], j);
                    }
                }
            }
        }
        
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
                //this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                this.koyrAkkIdomOgAkkObj(this.chordUndirGerd);
                
                //Ger broytingar í akkord objektinum soleiðis at ein linkaður listi verður bygdur
                
                //Er ein akkord á vinstru síðu?
                $.each(this.akkordirISangi[this.vers][markOrd+""], function(key, val){
                    if(val['h'] == markBokstv+"") {
                        akkordTilVinstru = key;
                    }
                });
                
                //Er ein akkord á høgru síðu?
                if($('#'+this.vers+"-"+markOrd+"-"+markBokstv).next()[0].outerHTML !== "<br>" && $('#'+this.vers+"-"+markOrd+"-"+markBokstv).next().attr('id').substring(0,3) === 'akk') {
                    akkordNavn = $('#'+this.vers+"-"+markOrd+"-"+markBokstv).next().attr('id').split('-');
                    
                    akkordTilHogru = akkordNavn[2];
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
                //sikra fyri at h og n ikki fara burtur
                if(typeof this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['n'] !== "undefined") {
                    tempN = this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['n'];
                }
                tempH = this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['h'];
                
                //this.koyrAkkIdomOgAkkObj(this.akkordUndirGerd);
                this.koyrAkkIdomOgAkkObj(this.chordUndirGerd);
                
                //if(typeof this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['n'] !== "undefined") {
                if(typeof tempN !== "undefined") {
                    this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['n'] = tempN;
                }
                this.akkordirISangi[this.vers][this.ordSumErMarkerad][this.bokstavurSumErMarkeradur]['h'] = tempH;
            }
        }
        else {
            this.koyrAkkIdomOgAkkObj(this.chordUndirGerd);
        }
        
        if(this.kelduSlag === "skra") {
            /*if(this.opinAkkListi === 0) {
                dokumentLutur.menuOpin = true;
                dokumentLutur.menuId = "akkordVeljiListi";
                this.innsetAkkordVeljara(this.vers,this.ordSumErMarkerad, this.bokstavurSumErMarkeradur, 1);
            }
            else if(this.opinAkkListi === 1) {
                dokumentLutur.menuOpin = true;
                dokumentLutur.menuId = "akkordVeljiListi";
                this.innsetAkkordVeljara(this.vers,this.ordSumErMarkerad, this.bokstavurSumErMarkeradur, 2);
            }
            else if(this.opinAkkListi === 2) {
                dokumentLutur.menuOpin = false;
                dokumentLutur.menuId = ""; 
            }*/
            if(akkordMenu != 10) {
                this.innsetAkkordVeljara(this.vers, markOrd, this.markeringByrjan, 1);
            }
        }
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
        nyttMillumrumFyrr.setAttribute("id",this.vers + "-" + mOrd + "-" + haegstaBokstavsId);
        if(this.kelduSlag === "skra") {
            nyttMillumrumFyrr.setAttribute("onmouseover", "akkordSkipan.markeraOrd("+this.vers+",\'"+mOrd+"\',\'"+haegstaBokstavsId+"\')");
            //nyttMillumrumFyrr.setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara("+this.vers+",\'"+mOrd+"\', \'"+haegstaBokstavsId+"\',1)");
        }
        
        //fortel foreldrinum til vinstru hvat nýtt barn tað eigur á sínu høgru síðu
        $.each(this.akkordirISangi[this.vers][mOrd+""], function(lykil, virdi) {
            if(virdi && virdi['h'] == mBokstv) {
                virdi['h'] = haegstaBokstavsId;
            }
        });
        
        haegstaBokstavsId++;
        nyttMillumrumEftir = document.createElement("span");
        nyttMillumrumEftir.appendChild(document.createTextNode("\u00A0"));
        nyttMillumrumEftir.setAttribute("id", this.vers +"-"+ mOrd + "-" + haegstaBokstavsId);
        if(this.kelduSlag === "skra") {
            nyttMillumrumEftir.setAttribute("onmouseover", "akkordSkipan.markeraOrd("+this.vers+",\'"+mOrd+"\',\'"+haegstaBokstavsId+"\')");
            //nyttMillumrumEftir.setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara("+this.vers+",\'"+mOrd+"\',\'"+haegstaBokstavsId+"\',1)");
        }
        
        //Fortel hesum foreldrinum hvat fyri barn tað eigur á sínu høgru síðu
        this.akkordirISangi[this.vers][mOrd+""][mBokstv+""]["h"] = haegstaBokstavsId;
        
        $(nyttMillumrumFyrr).insertBefore('#akk'+ this.vers + "-" + mOrd + '-' + mBokstv);
        $(nyttMillumrumEftir).insertAfter('#' +this.vers + "-" + mOrd + '-' + mBokstv);
        
        if(this.kelduSlag !== "akkfeed") {
            this.eventHandlersABokstavar(this.vers);
        }
    },
    
    koyrAkkIdomOgAkkObj : function(akkordir) {
        var akkordHaldari, uttariAkkordHaldari;
        //var nyAkkordHaldariFyrr, nyAkkordHaldariEftir;
        var tempAkk;
        //var akkordTekstur = "";
        //var nyttAkkPlassFyrr, nyttAkkPlassEftir;
        //var i = 1;
        //var p=-1,q=-1;
        //var fOrd=1,aOrd=1,eOrd=1;
        //var fyrraMillumrum, seinnaMillumrum;
        //var fyrrimAkkordHaldari, seinnimAkkordHaldari;
        //var fyrriAkkordhaldari, seinniAkkordHaldari;
        //var prefix;
        //var akkPrefix = "";
        //var eAkkord;
        var bokst;
        var vinstraAkk;
        var akkPettir;
        var ordOgBokst;
        
        //bygg akkord-objekt upp
        if(!this.akkordirISangi[this.vers]) {
            this.akkordirISangi[this.vers] = {};
        }
        
        if(!this.akkordirISangi[this.vers][this.ordSumErMarkerad+""]) {
            this.akkordirISangi[this.vers][this.ordSumErMarkerad+""] = {"xyz":"xyz"};
        }
        
        this.akkordirISangi[this.vers][this.ordSumErMarkerad+""][this.markeringByrjan+""] = akkordir.toJSON();
        
        //rudda upp
        if(this.akkordirISangi[this.vers][this.ordSumErMarkerad]["xyz"] == "xyz") {
            delete this.akkordirISangi[this.vers][this.ordSumErMarkerad]["xyz"];
        }
        
        //Koyr akkordir í DOM
        akkordHaldari = document.createElement("span");
        akkordHaldari.setAttribute("class","akkord");
        akkordHaldari.setAttribute("id","akk"+this.vers+"-"+this.ordSumErMarkerad+"-"+this.markeringByrjan+"-innan");
        /*
        if(akkordir[1] | akkordir[1] == "0") {
            tempAkk = this.akkordir1[akkordir[1]];
        }
        if(akkordir[2] | akkordir[2] == "0") {
            tempAkk += this.akkordir2[akkordir[2]] + "";
        }
        */
        tempAkk = akkordir.toString();
        
        akkordHaldari.appendChild(document.createTextNode(tempAkk));
        
        //bygg akkordhaldara
        if(!document.getElementById("akk"+this.vers+"-"+this.ordSumErMarkerad+'-'+this.markeringByrjan)) {
            uttariAkkordHaldari = document.createElement("span");
            uttariAkkordHaldari.setAttribute("style","position:absolute;");
            uttariAkkordHaldari.setAttribute("id", "akk"+this.vers+"-"+this.ordSumErMarkerad + '-' + this.markeringByrjan);
            
            $(uttariAkkordHaldari).insertBefore('#'+this.vers+"-" + this.ordSumErMarkerad + "-" + this.markeringByrjan);
        }
        
        //Koyr akkord í akkordhaldara.
        document.getElementById("akk"+this.vers+"-"+ this.ordSumErMarkerad+'-'+this.markeringByrjan).innerHTML = "";
        document.getElementById("akk"+this.vers+"-"+ this.ordSumErMarkerad+'-'+this.markeringByrjan).appendChild(akkordHaldari);
        
        //Tilpassa akkordirnar so tær ikki verða viklaðar saman
        this.flytTekstFyriAkk(tempAkk,this.ordSumErMarkerad, this.markeringByrjan);
        
        //bakka til fyrrverandi akkord og tilpassa eisini hesa
        bokst = $('#'+this.vers+"-"+this.ordSumErMarkerad+"-"+this.markeringByrjan);
        bokst = $(bokst).prev();
        do {
            bokst = $(bokst).prev();
        } while(bokst.attr("id") !== "jFylg" && bokst[0].outerHTML !== "<br>" && bokst.attr("id").substring(0,3) !== "akk");
        
        vinstraAkk = bokst.attr("id");
        
        if(vinstraAkk && vinstraAkk.substring(0,3) === "akk") {
            akkPettir = vinstraAkk.split("akk");
            ordOgBokst = akkPettir[1].split("-");
            tempAkk = document.getElementById(vinstraAkk + "-innan").innerHTML;
            
            this.flytTekstFyriAkk(tempAkk, ordOgBokst[1], ordOgBokst[2]);
        }
    },

    flytTekstFyriAkk : function(akkord, ord, bokst/*, akkString*/) {
        var tekinIAkk;
        var i;
        var valdiBokst;
        var akkPettir;
        var ordOgBokst;
        var akkordFunnin = false;
        
        /*if(typeof akkString !== "undefined" && akkString !== "jFylg") {
            akkPettir = akkString.split("akk");
            ordOgBokst = akkPettir[1].split("-");
            
            ord = ordOgBokst[0];
            bokst = ordOgBokst[1];
            akkord = document.getElementById(akkString + "-innan").innerHTML;
            
            //this.ordSumErMarkerad = ord;
            //this.bokstavurSumErMarkeradur = bokst;
        }
        */
        
        tekinIAkk = akkord.length;
        
        valdiBokst = $('#'+this.vers+"-"+ord+"-"+bokst);
        
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
        //finn útav um ein akkord stendur í vegin
        //leggi helvtina aftrat fyri at gera i meira følsamt
        if((i*1.5)<tekinIAkk) {
            //document.getElementById(this.ordSumErMarkerad+"-"+this.bokstavurSumErMarkeradur).setAttribute("style", "margin-right:"+(tekinIAkk/2)+"em");
            document.getElementById(this.vers+"-"+ord+"-"+bokst).setAttribute("style", "margin-right:"+((tekinIAkk/2)*1.1)+"em");
        }
        else {
            document.getElementById(this.vers+"-"+ord+"-"+bokst).removeAttribute("style");
        }
    },
    
    transponera : function(uppEllaNidur) {
        var tempAkk = "";
        
        if(uppEllaNidur === "upp") {
            this.transponering = this.transponering + 1;
        }
        else if(uppEllaNidur === "nidur") {
            this.transponering = this.transponering - 1;
        }
        else if(uppEllaNidur === "nullstilla") {
            this.transponering = 143;
        }
        else if(typeof uppEllaNidur === "number") {
            this.transponering = uppEllaNidur;
        }
        
        if(!jQuery.isEmptyObject(this.akkordirISangi[this.vers])) {
            $.each(this.akkordirISangi[this.vers],function(key, val) {
                $.each(akkordSkipan.akkordirISangi[akkordSkipan.vers][key], function(k,v) {
                    var bass = "",
                    grundToni = "";
                    
                    tempAkk = "";
                    
                    if(typeof v[1] !== "undefined") {
                        grundToni = akkordSkipan.akkordir1[((parseInt(v[1])+akkordSkipan.transponering) % 12)+1]
                    }
                    if(typeof v[2] !== "undefined") {
                        tempAkk = akkordSkipan.akkordir2[v[2]];
                    }
                    if(typeof v[3] !== "undefined") {
                        bass = akkordSkipan.akkordir3[((parseInt(v[3])+akkordSkipan.transponering) % 12)+1];
                    }
                    
                    tempAkk = grundToni + tempAkk + bass;
                    document.getElementById("akk"+akkordSkipan.vers+"-"+key+"-"+k+"-innan").innerHTML = tempAkk;
                    akkordSkipan.flytTekstFyriAkk(tempAkk, key,k);
                });
            });
        }

    },
    
    strikaAkkord : function(vId, markeraOrd, markeradurbokstv, akkordLid) {
        var stringMarkerad = this.ordSumErMarkerad + "";
        var prefix = stringMarkerad.substring(0,1);
        var ord = stringMarkerad.substring(1,stringMarkerad.length);
        var i;
        var hevurAkkordir = false;
        var talAvAkkordum = 0;
        var peikarAHesa;
        var akkordTilHogru;
        var talAvAkkordLidum = 0;
        
        if(!akkordLid) { //Um vit ikki vita hvønn part av akkordini, vit skulu sletta, sletta so alla akkordina.
            if(prefix === "m") {
                //viðlíkahaldsarbeiði fyri at fáa linkaða listan at hanga saman
                
                //kanna akkordlistan í hesum orðinum.
                $.each(this.akkordirISangi[this.vers][markeraOrd+""], function(lykil, virdi) {
                    talAvAkkordum++;
                    if(virdi['n'] === parseInt(markeradurbokstv)) {
                        peikarAHesa = lykil;
                    }
                });
                if(typeof this.akkordirISangi[this.vers][markeraOrd+""][markeradurbokstv]['n'] !== "undefined") {
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
                document.getElementById("sangPlass"+vId).removeChild(document.getElementById(vId+"-"+markeraOrd+"-"+this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv]['h']));
                
                //sletta hesa akkordina
                document.getElementById("akk"+vId+"-"+markeraOrd+"-"+markeradurbokstv).removeChild(document.getElementById("akk"+vId+"-"+markeraOrd+"-"+markeradurbokstv+"-innan"));
                document.getElementById("sangPlass"+vId).removeChild(document.getElementById("akk"+vId+"-"+markeraOrd+"-"+markeradurbokstv));
                if(talAvAkkordum > 1) {
                    document.getElementById("sangPlass"+vId).removeChild(document.getElementById(vId + "-"+markeraOrd+"-"+markeradurbokstv));
                }
                else if(talAvAkkordum === 1) {
                    $('#'+vId+"-"+markeraOrd+"-"+markeradurbokstv).prev().remove();
                }
                delete this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv];
                
                if(talAvAkkordum === 2) {
                    //Um bert ein akkord eftir sletting; broyt bókstavsID til 1
                    $.each(this.akkordirISangi[this.vers][markeraOrd], function(lyk, vir) {
                        if(lyk !== "1") {
                            document.getElementById(vId+"-"+markeraOrd+"-"+lyk).setAttribute("onmouseover", "akkordSkipan.markeraOrd("+vId+",'"+markeraOrd+"',1)");
                            document.getElementById(vId+"-"+markeraOrd+"-"+lyk).setAttribute("onclick", "akkordSkipan.innsetAkkordVeljara("+vId+",'"+markeraOrd+"',1,1)");
                            document.getElementById(vId+"-"+markeraOrd+"-"+lyk).setAttribute("id",vId+"-"+markeraOrd+"-1");
                            
                            document.getElementById("akk"+vId+"-"+markeraOrd+"-"+lyk+"-innan").setAttribute("id", "akk"+vId+"-"+markeraOrd+"-1-innan");
                            document.getElementById("akk"+vId+"-"+markeraOrd+"-"+lyk).setAttribute("id", "akk"+vId+"-"+markeraOrd+"-1");
                            
                            akkordSkipan.akkordirISangi[akkordSkipan.vers][markeraOrd][1] = vir;
                            delete akkordSkipan.akkordirISangi[akkordSkipan.vers][markeraOrd][lyk];
                        }
                    });
                }
            }
            else {
                delete this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv];
                document.getElementById("akk"+vId+"-"+markeraOrd+"-"+markeradurbokstv).removeChild(document.getElementById("akk"+vId+"-"+markeraOrd+"-"+markeradurbokstv+"-innan"));
                document.getElementById("sangPlass"+vId).removeChild(document.getElementById("akk"+vId+"-"+markeraOrd+"-"+markeradurbokstv));
            }
        }
        else {
            $.each(this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv], function(key, value) {
                talAvAkkordLidum++;
            });
            
            if(talAvAkkordLidum > 1) {
                delete this.akkordirISangi[this.vers][markeraOrd][markeradurbokstv][akkordLid];
            }
            else if(talAvAkkordLidum == 1) {
                this.strikaAkkord(vId,markeraOrd,markeradurbokstv);
            }
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
        
        //$.post("innskrivaakk.php",{"sang_id":undansyning.valdur_sangurDB,"akkordir":sendastTilDB});
        $.post("databasi.php",{slag:"akkinnskriva","sang_id":undansyning.valdur_sangurDB,"akkordir":sendastTilDB});
    }
};