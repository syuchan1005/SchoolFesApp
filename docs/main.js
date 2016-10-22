/**
 * Created by syuchan on 2016/07/14.
 */
var urlPrefix = (("https:" == document.location.protocol) ? "https://" : "http://");
var baseUrl = urlPrefix + location.hostname + ":" + location.port;

function no_scroll(){
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).on(scroll_event,function(e){e.preventDefault();});
    $(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
}

function pageInit() {
    $.getJSON('main.json', function (data) {
        $(data.tabs).each(function () {
            var name = this.name;
            Json[name] = this;
            $('<a onclick="changePage(\'' + name + '\')">' + name + '</a>')
                .appendTo(".overlay-content");
        });
        changePage("");
    });
}

function changePage(name) {
     if(location.hash == undefined || location.hash == "") {
         location.hash = Object.getOwnPropertyNames(Json)[1];
     } else if(!(name == "" && location.hash != "")){
         location.hash = name;
     }
     tab = location.hash.substring(1);
    $(".content").html(Json[tab].description);
    if (tab != "Top") {
        getUnitSales(tab);
        $(".unit-form").css('visibility', 'visible');
        $("#graph-area").css('visibility', 'visible');
    } else {
        $(".unit-view").val('0000');
        $(".unit-form").css('visibility', 'hidden');
        $("#graph-area").css('visibility', 'hidden');
    }
}

function getUnitSales(tabname) {
    var url = baseUrl + '/units?group=' + tabname;
    return HTMLGet(url, function (json) {
        console.info(json.Units);
        $(".unit-view").val(('000' + json.Units).slice(-4));
    });
}
/*
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
*/

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