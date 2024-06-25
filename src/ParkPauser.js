// written by Spacek 2024-05-23

/* Reference values */

var TOPBAR_HEIGHT = 15;
var OverallHeight = TOPBAR_HEIGHT; // updated as the ui is built (like a vBox)
var OverallWidth = 270; //fixed

var Window;
var Widgets;

var PluginMetadata = {
    name: "ParkPauser by Spacek",
    version: "0.1.2",
    authors: "Spacek",
    type: "intransient",
    licence: "MIT",
    minApiVersion: 93,
    targetApiVersion: 93,
    main: null // populated later
};

/* Current parameters */

// null = do nothing, true = pause, false = unpause
var loadState = null
var saveState = null

/* Get real widgets */

function GetWidget(widget) {
    if (Window) {
        return Window.findWidget(widget.name);
    }
}
function GetWidgetByName(name) {
    if (Window) {
        return Window.findWidget(name);
    }
}

/* Perform the work */

function onParkLoad() {
    if (loadState === null || network.mode != "none" || context.mode != "normal")
    {
        return;
    }
    context.paused = loadState;
}

function onParkSave() {
    if (saveState === null || network.mode != "none")
    {
        return;
    }
    context.paused = saveState;
}

function setButtonStates() {
    GetWidgetByName("loadAsIsButton").isPressed = loadState === null;
    GetWidgetByName("loadPausedButton").isPressed = loadState === true;
    GetWidgetByName("loadPlayingButton").isPressed = loadState === false;
    GetWidgetByName("saveAsIsButton").isPressed = saveState === null;
    GetWidgetByName("savePausedButton").isPressed = saveState === true;
    GetWidgetByName("savePlayingButton").isPressed = saveState === false;
}

function buttonClicked() {
    context.sharedStorage.set("ParkPauser.loadState",loadState);
    context.sharedStorage.set("ParkPauser.saveState",saveState);
    setButtonStates();
}

function getSavedSettings() {
    loadState = context.sharedStorage.get("ParkPauser.loadState",loadState);
    saveState = context.sharedStorage.get("ParkPauser.saveState",saveState);
}

/* Create the UI */

function createWidgets() {
    Widgets = [];
    OverallHeight = TOPBAR_HEIGHT
    var warningLabel = {
        type : "label",
        text : "Park Pauser sets the pause state of the park\ndirectly after loading and directly before saving.",
        x : 5,
        y : OverallHeight + 10,
        width : OverallWidth - 10,
        height : 30
    };
    OverallHeight = warningLabel.y + warningLabel.height;
    Widgets.push(warningLabel);
    
    var loadGroup = {
        type : "groupbox",
        x : 1,
        y : OverallHeight,
        width : OverallWidth-2,
        height : 0
    };
    Widgets.push(loadGroup);
    var loadLabel = {
        type : "label",
        text : "Load parks:",
        x : 10,
        y : OverallHeight + 13,
        width : 100,
        height : 15
    };
    var loadAsIsButton = {
        name : "loadAsIsButton",
        type : "button",
        text : "As-Is",
        x : 110,
        y : OverallHeight + 10,
        width : 50,
        height : 20,
        onClick : function() {
            loadState = null;
            buttonClicked();
        }
    };
    var loadPlayingButton = {
        name : "loadPlayingButton",
        type : "button",
        text : "Playing",
        x : 160,
        y : OverallHeight + 10,
        width : 50,
        height : 20,
        onClick : function() {
            loadState = false;
            buttonClicked();
        }
    };
    var loadPausedButton = {
        name : "loadPausedButton",
        type : "button",
        text : "Paused",
        x : 210,
        y : OverallHeight + 10,
        width : 50,
        height : 20,
        onClick : function() {
            loadState = true;
            buttonClicked();
        }
    };
    OverallHeight = loadPausedButton.y + loadPausedButton.height;
    Widgets.push(loadLabel);
    Widgets.push(loadAsIsButton);
    Widgets.push(loadPlayingButton);
    Widgets.push(loadPausedButton);
    
    var saveLabel = {
        type : "label",
        text : "Save parks:",
        x : 10,
        y : OverallHeight + 13,
        width : 100,
        height : 15
    };
    var saveAsIsButton = {
        name : "saveAsIsButton",
        type : "button",
        text : "As-Is",
        x : 110,
        y : OverallHeight + 10,
        width : 50,
        height : 20,
        onClick : function() {
            saveState = null;
            buttonClicked();
        }
    };
    var savePlayingButton = {
        name : "savePlayingButton",
        type : "button",
        text : "Playing",
        x : 160,
        y : OverallHeight + 10,
        width : 50,
        height : 20,
        onClick : function() {
            saveState = false;
            buttonClicked();
        }
    };
    var savePausedButton = {
        name : "savePausedButton",
        type : "button",
        text : "Paused",
        x : 210,
        y : OverallHeight + 10,
        width : 50,
        height : 20,
        onClick : function() {
            saveState = true;
            buttonClicked();
        }
    };
    loadGroup.height = savePausedButton.y + savePausedButton.height + 10 - loadGroup.y;
    OverallHeight = loadGroup.y + loadGroup.height;
    Widgets.push(saveLabel);
    Widgets.push(saveAsIsButton);
    Widgets.push(savePlayingButton);
    Widgets.push(savePausedButton);
}

function openWindow() {
    Window = ui.getWindow("ParkPauser_Window");
    if (Window) {
        Window.bringToFront();
        return;
    }
    
    Window = ui.openWindow({
        classification: "ParkPauser_Window",
        title: "Park Pauser",
        x: 100,
        y: 100,
        width: OverallWidth,
        height: OverallHeight,
        widgets: Widgets,
    });
    setButtonStates();
}

function main() {
    getSavedSettings();
    createWidgets();
    context.subscribe("map.changed",onParkLoad)
    context.subscribe("map.save",onParkSave)

    if (typeof ui === 'undefined') {
        return;
    }

    ui.registerMenuItem("Park Pauser", openWindow);
    ui.registerToolboxMenuItem("Park Pauser", openWindow);
}

PluginMetadata.main = main;
registerPlugin(PluginMetadata);