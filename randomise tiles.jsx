var opacityVariation = 10; // How many steps between 0 - 100%
var minOpacity = 0; // Range 0-100
var power = 0.75; // to curve values closer to opacity 100%

if(minOpacity > 100) { minOpacity = 100; }
else if(minOpacity < 0) { minOpacity = 0; }

var items = app.activeDocument.selection;

// Function to apply opacity to individual items
function applyOpacity(item) {
    var cO = minOpacity / 100; // Converted opacity from % to float
	
    var randomSteep = Math.floor(Math.random() * opacityVariation); // Range: <0 - opacityVariation>
	var normalizedRandom = randomSteep / (opacityVariation - 1); // normalize to 0-1
	var poweredRandom = Math.pow(normalizedRandom, power); // apply power function
    var result = ((1 - cO) * poweredRandom) + cO;
    if(result < cO) { result = cO }
    item.opacity = result * 100;
}

// Function to process groups and compound paths
function processGroup(item) {
    if (item.typename === "GroupItem") {
        for (var j = 0; j < item.pageItems.length; j++) {
            processGroup(item.pageItems[j]);
        }
    } else if (item.typename === "CompoundPathItem") {
        for (var k = 0; k < item.pathItems.length; k++) {
            applyOpacity(item.pathItems[k]);
        }
    } else {
        applyOpacity(item);
    }
}

// Iterate through selected items
for (var i = 0; i < items.length; i++) {
    if (items[i].typename === "GroupItem" || items[i].typename === "CompoundPathItem") {
        processGroup(items[i]);
    } else {
        applyOpacity(items[i]);
    }
}