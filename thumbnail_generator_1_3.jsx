/***********************************************
   
    Thumbnail generator vr 1.2

 ************************************************/
// Define the range of indices and the language versions
var indices = [];
var languages = ['PL', 'EN','FR','GR'];
var sIndexName = "KRAL";
var iLength = 10;
var tempNum = 0;

var doc; // Get the active document
var originalFilePath; // Get the full file path of the original document

//var doc = app.activeDocument; // Get the active document
//var originalFilePath = doc.fullName; // Get the full file path of the original document
var newFolderName = "output.test"; // Specify the new folder name

// Create a new folder object in the same directory as the original file
var newFolder;
var filePath;// = "D:/projects/!Render batch/KRAL.series/kral.thumbnails.4.ai";

var steep = 0;
var totalSteeps = 0;

// Call the main function to start the process

function thumbnail_generator_1_2() {}

thumbnail_generator_1_2.prototype.generate = function(indexName, variations, languages,textObject) {
    main(indexName, variations, languages,textObject);
}

function main(indexName, variations, aLanguages,textObject) {
    if(openIllustratorFile(filePath)) {

        sIndexName = indexName;
        iLength = variations;
        languages = aLanguages;
      
        createNameArray(sIndexName, iLength);
        doc = app.activeDocument;
        originalFilePath = doc.fullName;
        newFolder = new Folder(originalFilePath.parent.fsName + "/" + newFolderName);

    // Check if the folder exists, if not, create it
    if (!newFolder.exists) {
        newFolder.create();
    }

        generateThumbnails(textObject);
    } else {
        throw new Error("unable open file at "+filePath);
    }
}

function openIllustratorFile(path) {
    //var fileToOpen = new File(path);
    var fileToOpen = app.activeDocument.fullName;

    if (fileToOpen.exists) {
        app.open(fileToOpen);
        var tempSteeps = 0;
        // Wait for Illustrator to finish opening the file
        while (app.documents.length === 0 && tempSteeps < 50) {
            $.sleep(100); // Sleep for 100 milliseconds
            tempSteeps++;
        }
        var fileToOpen = app.activeDocument.fullName;
        return true;
    } else {
        alert("File does not exist!");
        return false;
    }
}

function createNameArray(indexName, numberIndexes) {
    for (var i = 0; i < numberIndexes; i++) {
        //totalSteeps++;
        indices.push(indexName + (i + 1)); // Assuming you want to start from KRAL1
    }
    totalSteeps = indices.length * languages.length;
}

// Function to generate thumbnails
function generateThumbnails(textObject) {
    for (var i = 0; i < indices.length; i++) {
        for (var j = 0; j < languages.length; j++) {
            steep++;
            barProgress(textObject);
            // Replace text for index and language
            replaceText("label.index", indices[i].toString());
			replaceText("label.language", languages[j]);

            // Save the file
            createNewFile(indices[i] + "_" + languages[j] + ".png");
        }
    }
    // Alert when done
    alert('All thumbnails have been generated!');
}


// Recursive function to search through all layers, sublayers, and group items
function findTextLayer(layer, name) {
    //tempNum++;
    //$.writeln(tempNum+"> Searching in layer: " + layer.name); // Log the current layer being searched
    // If this layer is a group, search its page items
    if (layer.typename === "GroupItem") {
        for (var m = 0; m < layer.pageItems.length; m++) {
            if (layer.pageItems[m].typename === "TextFrame" && layer.pageItems[m].name === name) {
                return layer.pageItems[m];
            }
        }
    }

    // If this layer has sublayers, search within them
    if (layer.layers && layer.layers.length > 0) {
        for (var k = 0; k < layer.layers.length; k++) {
            var foundLayer = findTextLayer(layer.layers[k], name);
            if (foundLayer != null) {
                return foundLayer;
            }
        }
    }

    // If this layer has groups, search within them
    if (layer.groupItems && layer.groupItems.length > 0) {
        for (var l = 0; l < layer.groupItems.length; l++) {
            var foundLayer = findTextLayer(layer.groupItems[l], name);
            if (foundLayer != null) {
                return foundLayer;
            }
        }
    }

    // If this layer has text frames, search within them
    if (layer.textFrames && layer.textFrames.length > 0) {
        for (var j = 0; j < layer.textFrames.length; j++) {
            if (layer.textFrames[j].name === name) {
                return layer.textFrames[j];
            }
        }
    }

    return null; // Return null if no text layer found
}

// Function to replace text
function replaceText(layerName, newText) {
    var textLayer = findTextLayer(app.activeDocument, layerName);
    if (textLayer == null) {
        throw new Error("Text layer '" + layerName + "' not found.");
    }
    textLayer.contents = newText;
}

function createNewFile(fileName) {
	try{
    var newFileName = fileName; // Specify the new file name for the PNG

    // Create a new file object in the new folder for the PNG
    var newFile = new File(newFolder.fsName + "/" + newFileName);

    // Set PNG export options
    var options = new ExportOptionsPNG24();
    options.antiAliasing = true;
    options.transparency = true;
    options.artBoardClipping = true; // If you want to clip to the artboard

    // Export the document as a PNG
    doc.exportFile(newFile, ExportType.PNG24, options);
	
	} catch (error) {
		// If an error occurs, we handle it here
		Alert("An error occurred: " + error.message);
	}
}

function barProgress (textObject) {
    var progressValue = ((steep / totalSteeps) * 100);
    textObject.text = progressValue;
    
    //textObject.redraw();
    app.redraw();

    if(steep == totalSteeps) {
        
    }
}