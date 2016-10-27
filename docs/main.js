/**
 * Created by syuchan on 2016/07/14.
 */
var baseUrl = document.location.protocol + "//" + location.hostname + ":" + location.port;
var Json = new Array();

function pageInit() {
    $.getJSON('resources/main.json', function (data) {
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
    var content = document.createElement("div");
    content.innerHTML = Json[tab].description;
    if (Json[tab].taste) {
        var list = document.createElement("ul");
        for (var c in Json[tab].tastes) {
            var element = document.createElement("li");
            element.innerHTML = Json[tab].tastes[c];
            list.appendChild(element)
        }
        content.appendChild(list);
    }
    $("#content").html(content);
    if (tab != "Top") {
        getUnitSales(tab);
        $(".unit-form").css('visibility', 'visible');
    } else {
        $(".unit-view").val('0000');
        $(".unit-form").css('visibility', 'hidden');
    }
}

function getUnitSales(tabname) {
    $.ajax({
        type: 'GET',
        url: baseUrl + '/school/v1/units?group=' + tabname,
        dataType: "jsonp",
        success: function (json) {
            console.info(json.Units);
            $(".unit-view").val(('000' + json.Units).slice(-4));
        }
    });
}