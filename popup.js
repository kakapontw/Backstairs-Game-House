document.addEventListener('DOMContentLoaded', function(dcle) {
    var buttonMap=new Map();
    buttonMap.set("FBbutton", "https://www.facebook.com/YoBackstairs");
    buttonMap.set("Youtubebutton", "https://www.youtube.com/channel/UC_H6Ftt07JKBqqRPniByL8w");
    buttonMap.set("Discordbutton", "https://discord.com/invite/euEBd9Y");
    buttonMap.set("IGbutton", "https://www.instagram.com/backstairs.tw/");
    buttonMap.set("Shopbutton", "https://myship.7-11.com.tw/general/detail/GM2112080894808");
    buttonMap.set("Twitchbutton", "https://www.twitch.tv/slrabbit99");
    buttonMap.forEach((buttonUrl, buttonName)=>{
        var button = document.getElementById(buttonName);
        button.setAttribute("data-content", buttonUrl);
        button.addEventListener('click', function(ce) {
            chrome.tabs.create({ "url": this.getAttribute("data-content") });
        });
    });
});
//Message彈出
$(function() {
    $('[data-toggle="popover"]').popover()
})

chrome.storage.sync.get({
    ChatMessage: '{"Message":[]}'
}, function(items) {
    var messageArr = JSON.parse(items.ChatMessage);
    messageArr.Message.reverse();
    for (var i = 0; i < messageArr.Message.length; i++) {
        var key = Object.keys(messageArr.Message[i]);
        var value = messageArr.Message[i][key];
        if (value.indexOf("https://") > -1 || value.indexOf("http://") > -1) {
            var link = document.createElement("a");
            link.href = value;
            link.innerText = value.substring(0, 30) + " ...";
            link.onclick = function() { chrome.tabs.create({ "url": clearString(this.href) }) };
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).appendChild(link);
        } else if (value.length > 12) {
            document.getElementById("m" + (i + 1)).setAttribute("data-container", "body");
            document.getElementById("m" + (i + 1)).setAttribute("data-toggle", "popover");
            document.getElementById("m" + (i + 1)).setAttribute("data-placement", "top");
            document.getElementById("m" + (i + 1)).setAttribute("data-trigger", "hover");
            document.getElementById("m" + (i + 1)).setAttribute("data-content", value);
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).innerText = value.substring(0, 12) + " ...";
        } else {
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).innerText = value;
        }
    }
});

function clearString(s) {
    var pattern = new RegExp("[`~!@#$^*()|{}';',\\[\\]<>~！@#￥……*（）;|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs += s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

function checkOpen() {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5YhoeZYKzorLHn_YcmqMSPAZ3dZNM7Z5JYSRq9xlpNJr5eESDDrUwoyUgZeOJygGE1qflE2h9PY84/pub?output=csv", {
        method:'GET'
    })
    .then(function(res) {
        return res.text();
    }).then(result => {
        var csvData = Papa.parse(result)['data'];
        if (csvData != null) {
            csvData.forEach(function(data){
                var userId = data[0];
                var openStr = data[1];
                var gameName = data[2];
                var title = data[3];

                if (userId == 'Backstairs' && openStr == 'Open') {
                    document.getElementById("twitchbadge").innerText = "Live";
                    document.getElementById("twitchbadge2").innerText = gameName;
                }
            });
        }
    });
}
checkOpen()
