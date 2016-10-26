/**
 * Created by syuchan on 2016/10/23.
 */
var baseUrl = document.location.protocol + "//" + location.hostname + ":" + location.port;
var pageObject;
var hash;

var unitForm = document.getElementById("unit");

var ageForm = document.getElementById("ageSelect");

var tasteForm = document.getElementById("tasteSelect");

var listForm = document.getElementById("list");

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

    document.getElementById("delete").addEventListener("click", selectDelete, false);
}

function keyPressUnit(event) {
    var number = event.which - 48;
    if (0 <= number && number <= 9) return;
    event.preventDefault();
}


function selectSubmit(mouseEvent) {
    var unit = unitForm.value;
    if (unit == undefined || unit == 0) return;
    if (window.confirm("送信しますか？")) {
        setUnitSales(hash, unit, ageForm.value, tasteForm.value);
    }
}

function selectDelete(mouseEvent) {
    var selection = listForm.value;
    if (selection == undefined || selection == "") return;
    selection = selection.split(":")[0];
    if (window.confirm("削除しますか？")) {
        deleteUnit(hash, selection);
    }
}


function setUnitSales(tab, unit, age, taste) {
    var url = baseUrl + '/school/v1/units?group=' + tab + "&units=" + unit;
    if (age != undefined) url += "&age=" + age;
    if (taste != undefined) url += "&taste=" + taste;
    HTMLPost(url, function (jsontxt) {
        var json = JSON.parse(jsontxt);
        var element = document.createElement("option");
        element.innerHTML = json.ID + ":" + unit + ":" + age + ":" + taste;
        element.setAttribute("id", json.ID);
        listForm.appendChild(element);
    });
}

function deleteUnit(tab, id) {
    HTMLPost(baseUrl + "/school/v1/units/del?group=" + tab + "&id=" + id,
        function () {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
        });
}


function HTMLGet(url, func) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "jsonp",
        success: func
    });
}

function HTMLPost(url, func) {
    $.ajax({
        type: 'POST',
        url: url,
        success: func
    });
}