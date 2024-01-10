/***********************************************

Thumbnail generator xml write-read for vr 1.2

    ************************************************/

function xmlManager() {}

xmlManager.prototype.readXML = function(filePath) {
    var file = new File(filePath);
    if (!file.exists) return null; // Handle file not existing

    file.open('r');
    var xmlString = file.read();
    file.close();

    var xmlData = new XML(xmlString);
    return xmlData;
}

xmlManager.prototype.writeXML = function(filePath, xmlData) {
    var file = new File(filePath);
    file.open('w');
    file.write(xmlData.toXMLString());
    file.close();
}

xmlManager.prototype.getXmlFilePath = function(aiFilePath) {
    var aiFile = new File(aiFilePath);
    var xmlFileName = aiFile.name.replace('.ai', '.xml');
    return aiFile.path + '/' + xmlFileName;
}

xmlManager.prototype.saveInitialData = function(xmlFilePath, indexName, variations, languages, docName) {
    var xmlData = new XML('<settings></settings>');
    xmlData.appendChild(new XML('<indexName>' + indexName + '</indexName>'));
    xmlData.appendChild(new XML('<variations>' + variations + '</variations>'));
    xmlData.appendChild(new XML('<languages>' + languages.join(',') + '</languages>'));
    xmlData.appendChild(new XML('<documentName>' + docName + '</documentName>'));

    var xmlFileHandler = new xmlManager();
    xmlFileHandler.writeXML(xmlFilePath, xmlData);
}

xmlManager.prototype.loadInitialData = function(xmlFilePath) {
    var xmlFileHandler = new xmlManager();
    var xmlData = xmlFileHandler.readXML(xmlFilePath);

    if (xmlData) {
        var indexName = xmlData.indexName.toString();
        var variations = parseInt(xmlData.variations.toString(), 10);
        var languages = xmlData.languages.toString().split(',');
        var docName = xmlData.documentName.toString();
        return { 
            indexName: indexName, 
            variations: variations, 
            languages: languages, 
            docName: docName 
        };
    }
    return null; // or some default values
}

/*
// Example Usage
var xmlFileHandler = new xmlManager();
var xmlData = xmlFileHandler.readXML('/path/to/your.xml');
// Process xmlData as needed
xmlFileHandler.writeXML('/path/to/save.xml', xmlData);
*/

