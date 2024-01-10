var pdfExportPresetName = "Press Quality - Hyperlinks";

var newFolderName = "output";
var newFolder;

var pdfExportPreset;
var documentName = app.activeDocument.name;
var documentPath = app.activeDocument.filePath;
var sectionName;
var sectionsArray = [];

Main();

function Main() {
    newFolder = new Folder(app.activeDocument.filePath + "/" + newFolderName);
    // Check if the folder exists, if not, create it
    if (!newFolder.exists) {
        newFolder.create();
    }

    separateSections();
}

// Function to trim file extension
function trimExtension(sName) {
    return sName.slice(0, sName.lastIndexOf("."));
}

function separateSections() {
    if (!pdfExportPresetName) {
        throw new Error("PDF preset name is not provided.");
    }

    var documentsCreated = 0;

    try{
        for (var i = 0; i < app.activeDocument.sections.length; i++) {
            var section = app.activeDocument.sections[i];
            var sectionName = section.name;
            //alert("Steep: "+i+". Attempting to create section:"+sectionName);
            if (sectionName === "") continue;
            
                var sectionInfo = {
                name: sectionName,
                exportPath: documentPath + "/" + newFolderName + "/" + trimExtension(documentName) + "_" + sectionName + ".pdf"
            };
        
            sectionsArray.push(sectionInfo);
            documentsCreated++;
        }

        exportSections();

    } catch (error) {
        // Handle the error, e.g., display a message or log it
        alert("An error occurred: " + error.message);
    }

    alert("Job completed successfully."+documentsCreated.toString()+" pdf's created.");
}

function exportSections() {
    try { 
        for (var i = 0; i < sectionsArray.length; i++) {
            var section = sectionsArray[i];

            sectionName = section.name; // Get the section marker
            if (sectionName === "") continue; 

            app.pdfExportPreferences.pageRange = section.name;
            var pdfFile = new File(section.exportPath);
            app.activeDocument.asynchronousExportFile(ExportFormat.PDF_TYPE, pdfFile, false, pdfExportPreset);
        }
    } catch (error) {
        alert("An error occoured at mathod exportSections():"+error.message);
    }
}


function separateOneSection() {

    var myPDFExportPreset = app.pdfExportPresets.item("Press Quality - Hyperlinks"); // Replace with your preset name
      
    // Set the page range
    app.pdfExportPreferences.pageRange = "EN";
    alert(documentPath + " | " + newFolderName + " | "+ trimExtension(documentName));
    var pdfFile = new File(documentPath + "/" + newFolderName + "/" + trimExtension(documentName) + "_EN.pdf");
    
    // Export to PDF
    app.activeDocument.asynchronousExportFile(ExportFormat.PDF_TYPE, pdfFile, false, myPDFExportPreset);

}


function lastResoultScoping() {
    var doc = app.activeDocument;
    //alert("Document Name: " + doc.name);
    scopeAvaibleProperties("activeDocument: ",doc);

    for (var i = 0; i < doc.pages.length; i++) {
        var page = doc.pages[i];
        scopeAvaibleProperties("page "+(i+1)+": "+page);
        //alert("Page Number: " + page);
    }

    for (var k = 0; k < doc.sections.length; k++) {
        var section = doc.sections[k];
        scopeAvaibleProperties("section "+(k+1)+":  "+section);
        //alert("Section Name: " + section);
    }



    
}

function scopeAvaibleProperties(sText, myObj) {
    for (var key in myObj) if (myObj.hasOwnProperty(key)) {
        var o = myObj.reflect;
        o.reflect.methods;
        alert(sText + o.methods);
    }
}
