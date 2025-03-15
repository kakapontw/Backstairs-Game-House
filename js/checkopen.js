var notificationPoint = 0;
var alarmInfo = {
    delayInMinutes: 1,
    periodInMinutes: 1
};

chrome.alarms.clearAll();
chrome.alarms.onAlarm.addListener(function(alarm) {
    checkOpen();
});

//是否開啟聊天室選項
chrome.storage.sync.get({
    getOpen: true,
    OpenNotification: false
}, function(items) {
    if (items.getOpen) {
        chrome.alarms.create('openAlarm', alarmInfo);
        notificationPoint = 1;
        // chrome.action.setBadgeText({ text: "" });
        chrome.action.setIcon({path: "/img/j8.png"});
        chrome.storage.local.set({ "OpenNotification": false }, function() {});
        setTimeout(function() { checkOpen(); }, 2000);
    }
});

//變更聊天室選項事件
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.getOpen) {
        if (changes.getOpen.newValue) {
            chrome.alarms.create('openAlarm', alarmInfo);
            chrome.storage.local.set({ "OpenNotification": false }, function() {});
            checkOpen();
        } else {
            // chrome.action.setBadgeText({ text: "" });
            chrome.action.setIcon({path: "/img/j8.png"});
            chrome.alarms.clearAll();
        }
    } else if (changes.OpenNotification) {
        if (changes.OpenNotification.newValue && notificationPoint) {
            openNotification(notificationTitle, notificationMessage);
        }
    }
});

function checkOpen() {
    fetch("https://api.twitch.tv/kraken/streams/28990891", {
        method:'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': '630so911da4xpdikvv92t5nrke4h96'
        }
    })
    .then(function(res) {
        return res.json();
    }).then(result => {
        if (result != null) {
            if (result.stream != null) {
                chrome.action.setIcon({path: "/img/7.png"});
                notificationTitle = result.stream.channel.status;
                notificationMessage = "阿貝開台囉 點這前往實況台";
                chrome.storage.local.set({ "OpenNotification": true }, function() {});
            } else {
                chrome.action.setIcon({path: "/img/j8.png"});
                chrome.storage.local.set({ "OpenNotification": false }, function() {});
            }
        }
    });
}

//chrome通知
var notificationId = "checkopenid";
var notificationNum = 0;
var notificationTitle = "阿貝開台囉";
var notificationMessage = "點這前往實況台";
var NOTIFICATION_TEMPLATE_TYPE = {
    BASIC: "basic",
    IMAGE: "image",
    LIST: "list",
    PROGRESS: "progress"
};

chrome.notifications.onClicked.addListener(function(id) {
    chrome.notifications.clear(notificationId, function(message) {
        chrome.tabs.create({ "url": "https://www.twitch.tv/slrabbit99" });
    });
});

function openNotification(title, message) {
    notificationId = notificationId + notificationNum;
    var notificationOptions = {
        type: NOTIFICATION_TEMPLATE_TYPE.BASIC,
        iconUrl: "./img/twitchNotification.png",
        title: title,
        message: message,
        isClickable: true
    };
    chrome.notifications.create(notificationId, notificationOptions, function(id) {
        chrome.storage.sync.get({
            getSound: true
        }, function(items) {
            if (items.getSound) {
                audio();
            }
        });
    });
}

function audio() {
    chrome.storage.sync.get({
        getSoundVersion: false
    }, function(items) {
        var soundVersion = "/audio/Tiger.mp3"
        if (items.getSoundVersion) {
            soundVersion = "/audio/SuperCar.mp3"
        }
        var audio = document.createElement("audio");
        audio.setAttribute("controls", "controls");
        audio.setAttribute("autoplay", "autoplay");
        audio.setAttribute("src", soundVersion);
        audio.setAttribute("type", "audio/mpeg");
        audio.volume = 0.8;
        document.body.appendChild(audio);
        audio.addEventListener('ended', function() {
            this.remove();
        }, false);
    });
}
