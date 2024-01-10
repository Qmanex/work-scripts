#target illustrator
#include "thumbnail_generator_1_3.jsx"
#include "xmlManager.jsx"

/***********************************************
 * 
    Thumbnail generator GUI for vr 1.12

    [0] GUI
    [0] save/write initial data
    [0] attempt read initial data
    [X] progress bar - failed so far doing to limitation of single-threat nature of adobe script

************************************************/

// Define the range of indices and the language versions
var XmlHandler = new xmlManager();

// Create a dialog window
var dialog = new Window("dialog", "Thumbnail Generator");

// Add Index Name input field
dialog.add("statictext", undefined, "Index Name:");
var indexNameField = dialog.add("edittext", undefined, "");
indexNameField.characters = 20;

// Add Number of Variations input field
dialog.add("statictext", undefined, "Number of Variations:");
var numOfVariationsField = dialog.add("edittext", undefined, "");
numOfVariationsField.characters = 10;

// Language Variations Panel
var langPanel = dialog.add("panel", undefined, "Language Variations");
var langList = langPanel.add("listbox", undefined, [], {multiselect: false});
langList.preferredSize.width = 100;
/*
dialog.add("statictext", undefined, "actual progress:")
var progressField = dialog.add("statictext",undefined, "0/100");
*/

// Buttons for adding and removing languages
var addButton = langPanel.add("button", undefined, "Add");
var removeButton = langPanel.add("button", undefined, "Remove");

var indexName;
var variations;
var docName;

init();

function init() {

    
    // Show the dialog

    var aiFilePath = app.activeDocument.fullName;
    var aiFileName = app.activeDocument.name;
    var xmlFilePath = XmlHandler.getXmlFilePath(aiFilePath);
    var initData = XmlHandler.loadInitialData(xmlFilePath);

    if (initData) { 
        docName = initData.docName.toString();
        if (aiFileName == docName) {
            langList.removeAll();


            for (var i = 0; i < initData.languages.length; i++) {
                langList.add('item', initData.languages[i]);
            }

            indexNameField.text = indexName = initData.indexName;
            variations = initData.variations;
            numOfVariationsField.text = variations.toString();
        } 
    } else {
        // Handle the case where XML data could not be loaded
    }
}

addButton.onClick = function() {
    var lang = prompt("Enter Language Code (e.g., 'EN'):", "");
    if (lang) {
        langList.add("item", lang);
    }
}

removeButton.onClick = function() {
    var selectedLang = langList.selection;
    if (selectedLang) {
        langList.remove(selectedLang);
    }
}

// Proceed and Cancel buttons
var buttonGroup = dialog.add("group");
buttonGroup.alignment = "center";

var proceedButton = buttonGroup.add("button", undefined, "Proceed");
var cancelButton = buttonGroup.add("button", undefined, "Cancel");

// Define button functionality
proceedButton.onClick = function() {
    // Code to handle 'Proceed' action
    var sIndexName = indexNameField.text;
    var iLength = parseInt(numOfVariationsField.text, 10);
   
    // Validate the input
    if (isNaN(iLength)) {
        alert("Please enter a valid number for variations.");
        return;
    }
    // Read values from the list box
    var selectedLanguages = [];
    for (var i = 0; i < langList.items.length; i++) {
        selectedLanguages.push(langList.items[i].text);
    }

    var aiFilePath = app.activeDocument.fullName; // Get this dynamically
    xmlFilePath = XmlHandler.getXmlFilePath(aiFilePath);
    XmlHandler.saveInitialData(xmlFilePath, sIndexName, iLength, selectedLanguages, app.activeDocument.name)

    try {

        var thumbnailGenerator = new thumbnail_generator_1_2();
        thumbnailGenerator.generate(sIndexName, iLength, selectedLanguages,progressField);

        dialog.close();
        
    } catch (e) {
        alert("Error: " + e.toString());
    }
}

cancelButton.onClick = function() {
    // Code to handle 'Cancel' action
    dialog.close();
}

dialog.show();