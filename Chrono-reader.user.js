// ==UserScript==
// @name         Chrono-reader
// @namespace    https://github.com/piomar123/
// @version      0.81
// @description  Przeglądanie powiadomień na wykop.pl w kolejności chronologicznej
// @author       piomar123
// @match        http://www.wykop.pl/*
// @grant        none
// @name:en         Chrono-reader
// @description:en  Chronological tag notification reader for wykop.pl
// ==/UserScript==
// Badge bullet style by krejdd

$('div#nav ul.clearfix:last > li.notification.m-tag').last().before($('<li/>', {
    id: 'firstTag',
    html: '<a id="firstTagButton" class="dropdown-show hashtag" href="#"><b id="firstTagBullet" style="background:#0080FF; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-tag piomar-firsttag",
    title: "Najstarszy nieprzeczytany tag",
    alt: "Najstarszy nieprzeczytany tag"
}));

$("#firstTagButton").click(function(event){
    event.preventDefault();
    var tagiURL = "http://www.wykop.pl/powiadomienia/tagi/";
    var notificationSelector = '#content ul.menu-list li.type-light-warning a[href*="pl/wpis/"]';
	var emptyPageAlertSelector = "#content ul.menu-list li.type-alert p.empty";
    var lastPage = 3;
    var unreadCount = 0;
    var notifications = [];
    var currentTotal = 0;
    var oldestUrl = null;
    $.ajax(tagiURL)
        .done(firstPageDownloaded)
        .fail(handleFail);

    function firstPageDownloaded(html){
        unreadCount = Number($('#hashtagsNotificationsCount', html).html());
        notifications = $(notificationSelector, html);
        currentTotal = notifications.length;
        oldestUrl = notifications.last().attr("href");
        if(currentTotal < unreadCount){
            downloadPage(2);
            return;
        }
        if(unreadCount === 0){
            alert("Wszystko przeczytane");
            return;
        }
        if(!oldestUrl){
            alert("Nie znalazłem nowszych wpisów");
            return;
        }
        window.location.href = oldestUrl;
    }

    function downloadPage(page){
        $.ajax(tagiURL + "strona/" + page + "/")
            .done(nextPageDownloaded(page))
            .fail(handleFail);
    }

    function nextPageDownloaded(page){
        return function(html){
            //unreadCount = Number($('#hashtagsNotificationsCount', html).html());
            notifications = $(notificationSelector, html);
            // possible race condition
			currentTotal += notifications.length;
            if(page < lastPage && currentTotal < unreadCount){
                downloadPage(page+1);
                return;
            }
            oldestUrl = notifications.last().attr("href") || oldestUrl;
            if(!oldestUrl){
                alert("Nie znalazłem nowszych wpisów");
                return;
            }
            window.location.href = oldestUrl;
        };
    }

    function handleFail(jqXHR, textStatus, err){
        alert(textStatus + ": " + err);
    }
});


