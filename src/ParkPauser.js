// written by Spacek 2024-05-23

/* Reference values */

var TOPBAR_HEIGHT = 15;
var OverallHeight = TOPBAR_HEIGHT; // updated as the ui is built (like a vBox)
var OverallWidth = 270; //fixed

var Window;
var Widgets;

var PluginMetadata = {
    name: "ParkPauser by Spacek",
    version: "0.1.0",
    authors: "Spacek",
    type: "intransient",
    licence: "MIT",
    targetApiVersion: 88,
    main: null // populated later
}

/* Current parameters */

// null = do nothing, true = pause, false = unpause
var loadState = true
var saveState = false

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
    if (loadState === null || network.mode == "client")
    {
        return;
    }
    if (context.paused != loadState)
    {
        context.executeAction("pausetoggle",{})
    }
}

function onParkSave() {
    if (saveState === null || network.mode == "client")
    {
        return;
    }
    if (context.paused != saveState)
    {
        context.executeAction("pausetoggle",{})
    }
}

/* Create the UI */

function createWidgets() {
    Widgets = [];
    OverallHeight = TOPBAR_HEIGHT
}

function main() {
    context.subscribe("map.changed",onParkLoad)
    context.subscribe("map.save",onParkSave)

    if (typeof ui === 'undefined') {
        return;
    }
}

PluginMetadata.main = main;
registerPlugin(PluginMetadata);