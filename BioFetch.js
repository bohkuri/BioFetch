function main() {
    const parentFolderId = "1Szoqro646cDR_AzBCIdb4gPNPe5vIJWM";
    const parentFolder = DriveApp.getFolderById(parentFolderId);
    const filesInParent = parentFolder.getFiles();
    var functionProperties = PropertiesService.getScriptProperties();

    const personTempArray = functionProperties.getProperty('personSet');

    // reset tempArray = 

    var personSet = personTempArray ? new Set(JSON.parse(personTempArray)) : new Set();// gets set from property

    const processedImageFolder = createNewFolder("Processed_Images", parentFolder);
    const bioFolder = createNewFolder("Bio_Folder", parentFolder);


    while (filesInParent.hasNext()){
        const image = filesInParent.next();
        if (image.getMimeType().includes('image')){

        const imgBlob = image.getBlob();
        const fileName = image.getName().split('.');
        let base64Image = Utilities.base64Encode(imgBlob.getBytes());
        /*
        try{
            var personsExtracted = imageToGPT(base64Image);
        }
        catch(error){
            Logger.log("Error calling function imageToGPT: " + e.message);
            continue; // Skip to the next image on error  
        }
        */
        var testPersonString = 'Luffy\nZoro\nSanji';
        image.moveTo(processedImageFolder); // move image to processed folder


        Logger.log("1 second sleep");
        Utilities.sleep(1000); // one second delay
        Logger.log("wake");
        }
        
        const tempArray = testPersonString.split(/\n/); // change testPersonString to personsExtracted
        for (let i = 0; i < tempArray.length; i++){
        personSet.add(tempArray[i]);
        }
        saveProgress(personSet);
        // set GPT Trigger (main)
    }

    /*
    for (let person in personSet){
        // personToGPT(person);
        //Utilities.sleep(1000);
    }
    */

    //const personSetToString = JSON.stringify([...personSet]); // Set to String
    // var allBios = personsToGPT(personSetToString); // biography of all people from API as a string
    var allBios = `Apoka Karenyane  
        There is limited widely available historical information about Apoka Karenyane. The name appears to reflect a figure possibly rooted in local cultural or regional significance, likely connected to Uganda or surrounding areas, possibly with ties to leadership or resistance movements. More detailed research from local historical texts or oral traditions may be needed to clarify their role and contributions.

        Queen Tiye  
        Queen Tiye (c. 1398 – 1338 BCE) was a powerful and influential queen of ancient Egypt, the Great Royal Wife of Pharaoh Amenhotep III. Known for her intelligence and political acumen, she played a significant role in state affairs and was revered for her wisdom. Queen Tiye was also the mother of Akhenaten, the pharaoh who introduced a form of monotheism centered on the worship of Aten. Her legacy is notable for her active engagement in diplomatic relations and maintaining stability within the empire.`;
    var bioArray = allBios.split(/\n\n/);
    Logger.log(bioArray[0]);

    for (let i = 0; i < bioArray.length; i++){
        var fileName = bioArray[i].split(/\n/)[0];
        Logger.log(fileName);
        createTextFile(fileName, bioFolder, bioArray[i]);
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
  
function createTextFile(fileName, textFolder, bio){
    const folderIterator = DriveApp.getFoldersByName(textFolder); 
    const folder = folderIterator.next();

    folder.createFile(fileName, bio, MimeType.PLAIN_TEXT);
    console.log("created text file");
}
  
  // Analyze the image and provide a chat response that provides a sufficient biography of each person who has their name in the image. If there are multiple people, separate each bio with a newline.
  
  // Given the list of names:\n + {names} + \nprovide a chat response that provides a sufficient biography of each person. If there are multiple people, separate each bio with a newline
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

function personsToGPT(){

}

function createTrigger(){

}
  