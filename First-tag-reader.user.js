// ==UserScript==
// @name         First-tag-reader
// @namespace    https://github.com/piomar123/
// @version      0.4
// @description  Oldest tag notification reader for wykop.pl
// @author       piomar123
// @match        http://www.wykop.pl/*
// @grant        none
// ==/UserScript==
// Bullet style by krejd
// Na razie obsługuje tylko pierwszą stronę unread

$('div#nav ul.clearfix:last > li.notification.m-tag').last().before($('<li/>', {
    id: 'firstTag',
    html: '<a id="firstTagButton" class="dropdown-show hashtag" href="#"><b id="firstTagBullet" style="background:#80FF80; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-tag piomar-firsttag",
    title: "Najstarszy nieprzeczytany tag",
    alt: "Najstarszy nieprzeczytany tag"
}));

$("#firstTagButton").click(function(event){
    event.preventDefault();
    $.ajax("http://www.wykop.pl/powiadomienia/tagi/")
    .done(function(html){
        url = $('#content ul.menu-list li.type-light-warning a[href*="pl/wpis/"]', html).last().attr("href");
        if(!url){
            alert("Brak nowszych wpisów");
            return;
        }
        window.location.href = url;
    })
    .fail(function(jqXHR, textStatus, err){
        alert(textStatus + ": " + err);
    });
});

