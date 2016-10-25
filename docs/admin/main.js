/**
 * Created by syuchan on 2016/10/23.
 */
var baseUrl = document.location.protocol + "//" + location.hostname + ":" + location.port + location.pathname;
var pageObject;
var hash;

var unitForm = document.getElementById("unit");

var ageForm = document.getElementById("ageSelect");

var tasteForm = document.getElementById("tasteSelect");

if (location.hash == "") location.hash = "None";

hash = location.hash.substring(1);

$.when(
    $.getJSON('./../resources/main.json', function (data) {
        $(data.tabs).each(function () {
            if (this.name == hash) pageObject = this;
        })
    })
).done(function () {
    init();
});

function init() {
    $(window).on('touchmove.noScroll', function(e) {
        e.preventDefault();
    });

    if (pageObject == undefined) {
        pageObject = new Object();
        pageObject.age = false;
        pageObject.taste = false;
    }

    unitForm.addEventListener("keypress", keyPressUnit, false);

    if (!pageObject.age) {
        ageForm.style.display = "none";
    } else {
        var element = document.getElementById("zero");
        element.parentNode.removeChild(element);
    }

    if (!pageObject.age) document.getElementById("Age").style.display = "none";

    if (pageObject.taste) {
        var tastes = pageObject.tastes;
        for (var i in tastes) {
            var element = document.createElement("option");
            element.innerHTML = tastes[i];
            tasteForm.appendChild(element);
        }
    } else {
        document.getElementById("Taste").style.display = "none";
    }

    document.getElementById("submit").addEventListener("click", selectSubmit, false);
}

function keyPressUnit(event) {
    var number = event.which - 48;
    if (0 <= number && number <= 9) return;
    event.preventDefault();
}


function selectSubmit(mouseEvent) {
    if (window.confirm("送信しますか？")) {
        setUnitSales(hash, unitForm.value, ageForm.value, tasteForm.value);
    }
}


function setUnitSales(tab, unit, age, taste) {
    if (unit == undefined || unit == 0) return;
    var url = baseUrl + '/units?group=' + tab + "&units=" + unit;
    if (age != undefined) url += "&age=" + age;
    if (taste != undefined) url += "&taste=" + taste;
    HTMLPost(url);
}

function deleteLastUnit(tab) {
    HTMLPost(baseUrl + "/units/del?group=" + tab);
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