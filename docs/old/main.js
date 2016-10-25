var baseUrl = location.hostname + ":" + location.port;

var $format = function (fmt, a) {
    var rep_fn = undefined;

    if (typeof a == "object") {
        rep_fn = function (m, k) {
            return a[k];
        }
    }
    else {
        var args = arguments;
        rep_fn = function (m, k) {
            return args[parseInt(k) + 1];
        }
    }

    return fmt.replace(/\{(\w+)\}/g, rep_fn);
}

var Saves = new Object();

tabInit = $(function () {
    var jsonDir = 'main.json';
    var tabdir = '.tabs';
    var tabcompdir = '.tabcomp';

    $(tabdir).html("");
    $(tabcompdir).html("");

    $.getJSON(jsonDir, function (data) {
        $(data.tabs).each(function () {
            var tab = this.name;
            $($format("<a class=\"tab-select\" onclick=\'ChangeTab\(\"{0}\"\);\'>{0}</a>", tab))
                .appendTo(tabdir);
            $($format("<div id=\"{0}\" class=\"tab-component\"> <p>{1}</p> </div>", tab, this.description))
                .appendTo(tabcompdir);
            Saves[tab] = this.save;
        });
        $("<form name=\"SetCo\" id=\"SetCo\" style='margin: 10px; padding: 10px;'> " +
            "<input type=\"text\" id=\"CoText\"/> " +
            "<input type=\"button\" value=\"Set\" onclick=\"setCookie(\'ViewPex\', getText(\'CoText\'), 3)\"/> " +
            "<input type=\"button\" value=\"Check\" onclick=\"alert(getCookie(\'ViewPex\'))\"/> " +
            "</form>")
            .appendTo("#Settings");
    });
});

function ChangeTab(tabname) {
    c_tab(tabname);
    c_form(tabname);
    if(tabname == "Top" || tabname == "Settings") return;
    getUnitSales(tabname);
}

function c_tab(tabname) {
    var list = document.getElementsByClassName('tab-component');
    for (var i = 0; i < list.length; i++) {
        list[i].style.display = 'none';
    }
    document.getElementById(tabname).style.display = 'block';
}

function c_form(tabname) {
    var form = document.forms.MainForm;
    form.TabName.value = tabname;
    form.Unit.value = 0;
    form.Age.value = 0;
    if (Saves[tabname].age == false || Saves[tabname].age == undefined) { document.getElementById("AgeField").style.display = 'none';
    } else { document.getElementById("AgeField").style.display = 'block'; }
    $("#Taste").html("");
    if (Saves[tabname].taste == false || Saves[tabname].taste == undefined) { document.getElementById("TasteField").style.display = 'none';
    } else {
        $(Saves[tabname].tastes).each(function () {
           $($format("<option>{0}</option>", this.toString())).appendTo("#Taste");
        });
        document.getElementById("TasteField").style.display = 'block';
    }
    form.style.display = ((getCookie("ViewPex").indexOf(Saves[tabname].key) !== -1) ? 'block' : 'none');
}

function setCookie(c_name,value,expiredays){
    var path = location.pathname;
    var paths = new Array();
    paths = path.split("/");
    if(paths[paths.length-1] != ""){
        paths[paths.length-1] = "";
        path = paths.join("/");
    }
    var extime = new Date().getTime();
    var cltime = new Date(extime + (60*60*24*1000*expiredays));
    var exdate = cltime.toUTCString();
    var s="";
    s += c_name +"="+ escape(value);
    s += "; path="+ path;
    if(expiredays){
        s += "; expires=" +exdate+"; ";
    }else{
        s += "; ";
    }
    document.cookie=s;
}

function getText(compId) {
    return document.SetCo.CoText.value;
}

function getCookie(c_name){
    var st="";
    var ed="";
    if(document.cookie.length>0){
        // クッキーの値を取り出す
        st=document.cookie.indexOf(c_name + "=");
        if(st!=-1){
            st=st+c_name.length+1;
            ed=document.cookie.indexOf(";",st);
            if(ed==-1) ed=document.cookie.length;
            // 値をデコードして返す
            return unescape(document.cookie.substring(st,ed));
        }
    }
    return "";
}

function getUnitSales(tabname) {
    return HTMLGet(baseUrl + '/units?group=' + tabname, function (json) {
        document.getElementById('UnitSales').value = ('0000' + json.Units).slice(-4);
    });
}

function setUnitSales() {
    var form = document.forms.MainForm;
    var tab = form.TabName.value;
    if(form.Unit.value <= 0) return;
    var url = baseUrl + '/units?group=' + tab
    + "&units=" + form.Unit.value;
    if(Saves[tab].age == true) url += "&age=" + form.Age.value;
    if(Saves[tab].taste == true) {
        var select = form.Taste;
        url += "&taste=" + select.options[select.selectedIndex].text;
    }
    HTMLPost(url);
}

function deleteLastUnit() {
    var tab = document.forms.MainForm.TabName.value;
    var url = baseUrl + "/units/del?group=" + tab;
    console.log(url);
    HTMLPost(url);
}

function HTMLGet(url, func) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "jsonp",
        success: func
    });
}

function HTMLPost(url) {
    $.ajax({
        type: 'POST',
        url: url
    });
}