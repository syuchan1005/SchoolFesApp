/**
 * Created by syuchan on 2016/10/23.
 */
var pageObject;
var hash;

var unitForm = document.getElementById("unit");
var keyPadButtons = document.getElementsByClassName("keyPad");

var ageForm = document.getElementById("Age");
var ageButtons = document.getElementsByClassName("ageSelect");

var tasteForm = document.getElementById("Taste");
var tasteButtons;

if (location.hash == "") location.hash = "None";

hash = location.hash.substring(1);

$.when(
    $.getJSON('./../resources/main.json', function (data) {
        $(data.tabs).each(function () {
            if (this.name == hash) {
                pageObject = this;
            }
        });
    })
).done(function () {
    $('<a onclick="changePage(\'' + hash + '\')">' + hash + '</a>')
        .appendTo(".overlay-content");
    if (!pageObject.age) {
        ageForm.style.display = "none";
    }
    if (pageObject.taste) {
        var tastes = pageObject.tastes;
        for (var i = 0; i < tastes.length; i++) {
            $('<button class="tasteSelect">' + tastes[i] + "</button>").appendTo(tasteForm);
        }
        tasteButtons = document.getElementsByClassName("tasteSelect");
        for (var i = 0; i < tasteButtons.length; i++) {
            tasteButtons[i].addEventListener("click", selectTaste, false);
        }
    } else {
        tasteForm.style.display = "none";
    }
});

for (var i = 0; i < keyPadButtons.length; i++) {
    keyPadButtons[i].addEventListener("click", selectKeyPad, false);
}

for (var i = 0; i < ageButtons.length; i++) {
    ageButtons[i].addEventListener("click", selectAge, false);
}

function selectKeyPad(mouseEvent) {
    var text = mouseEvent.srcElement.innerHTML;
    var value = unitForm.value;
    if (text == "<" || text == "&lt;") {
        unitForm.value = value.substring(0, value.length - 1);
    } else {
        unitForm.value = value + text;
    }
}

function selectAge(mouseEvent) {
    console.log(mouseEvent.srcElement.innerHTML);
}

function selectTaste(mouseEvent) {
    console.log(mouseEvent.srcElement.innerHTML);
}

document.getElementById("submit")
    .addEventListener("click", function (mouseEvent) {
    console.log(mouseEvent.srcElement.value);
});

function setUnitSales() {
    var form = document.forms.MainForm;
    var tab = form.TabName.value;
    if (form.Unit.value <= 0) return;
    var url = baseUrl + '/units?group=' + tab
        + "&units=" + form.Unit.value;
    if (Saves[tab].age == true) url += "&age=" + form.Age.value;
    if (Saves[tab].taste == true) {
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