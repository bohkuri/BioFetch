function main() {
    const parentFolderId = "";
    const parentFolder = DriveApp.getFolderById(parentFolderId);
    const filesInParent = parentFolder.getFiles();
    var functionProperties = PropertiesService.getScriptProperties();
    var personSet = functionProperties.getProperty('personSet');
    personSet = personSet ? JSON.parse(personSet) : new Set(); // gets set from property
    
  
    while (filesInParent.hasNext()){
      const image = filesInParent.next();
      if (image.getMimeType().includes('image')){
        // send to GPT /// could be multiple persons in one chat response; prompt engineer
        var testPersonString = 'Luffy Zoro';
        // move image to processed folder
      }
  
      // append figures from GPT to file/array
      const tempArray = testPersonString.split(' ');
      for (let i = 0; i < tempArray.length; i++){
        personSet.add(tempArray[i]);
      }
  
      // save set to func property?
  
      // send set of figures to MediaWiki API
  
    }
  
    
}
  
function imageToGPT(){
    const API_KEY = "";
    const API_URL = "";
}
  
function searchFigures(){
  
}
  
function createTrigger(){
  
}
  