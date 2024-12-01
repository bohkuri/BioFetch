function main() {
    const parentFolderId = "1Szoqro646cDR_AzBCIdb4gPNPe5vIJWM";
    const parentFolder = DriveApp.getFolderById(parentFolderId);
    const filesInParent = parentFolder.getFiles();
    var functionProperties = PropertiesService.getScriptProperties();
  
    const personTempArray = functionProperties.getProperty('personSet');
  
    var personSet = personTempArray ? new Set(JSON.parse(personTempArray)) : new Set();// gets set from property
  
    const processedImageFolder = createNewFolder("Processed_Images", parentFolder);
    
  
    while (filesInParent.hasNext()){
      const image = filesInParent.next();
      if (image.getMimeType().includes('image')){
  
        const imgBlob = image.getBlob();
        const fileName = image.getName().split('.');
        let base64Image = Utilities.base64Encode(imgBlob.getBytes());
        // send base64 to GPT /// could be multiple persons in one chat response; prompt engineer
        // var personsExtracted = imageToGPT(base64Image);
        var testPersonString = 'Luffy\nZoro\nSanji';
        image.moveTo(processedImageFolder); // move image to processed folder
      }
      // append figures from GPT to file/array
      const tempArray = testPersonString.split('\n');
      for (let i = 0; i < tempArray.length; i++){
        personSet.add(tempArray[i]);
      }
      // save set to func property?
      saveProgress(personSet);
      // set GPT Trigger (main)
  
    }
  
    // send set of figures to MediaWiki API
  
    // set Wikipedia Trigger (main)
  
    return 0;
}
  
function createNewFolder(folderName, parent){
    const parentFolder = parent;
    const folder = parentFolder.getFoldersByName(folderName); // returns file iterator
    if (folder.hasNext()){
        return folder.next(); // returns a folder 
    }
    else {
        const textFolder = parentFolder.createFolder(folderName);
        return textFolder;
    }
}
  
function imageToGPT(base64Image){
    const API_KEY = "";
    const API_URL = "https://api.openai.com/v1/chat/completions";

    var reqBody = {model: 'gpt-4o-mini', messages: [
        {role: 'user', content: [
            {type: "text", text: `"Analyze the image and provide a chat response that consists of only the name(s) of the people in the image.If there are multiple people, separate each person with a newline"`}
            ]
        },
        {role: 'user', content:[
            {type: "image_url", image_url: {"url": "data:image/jpeg;base64," + base64Image}}
            ]
        }
    ],
    "max_tokens": 300 
    }; // specify gpt model

    var data = {
        method: "post",
        contentType: "application/json",
        headers: {
        Authorization: "Bearer " + API_KEY
        },
        "payload": JSON.stringify(reqBody)
    };  


    const response = UrlFetchApp.fetch(API_URL, data);
    // console.log(JSON.parse(response.getContentText()));

    const altJSON = JSON.parse(response.getContentText());

    // assuming index 0 is never NULL; maybe add exception for NULL index

    return altJSON; // return parsed message from chat completion object
}
  
function saveProgress(personSet){
PropertiesService.getScriptProperties().setProperty('personSet', JSON.stringify([...personSet]));
}

function searchFigures(){

}
  
function createTrigger(){

}
  