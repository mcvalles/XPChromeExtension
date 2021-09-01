//Constants  -----------------------------------------------------------------
var save = "";
chrome.storage.sync.get(["save"],(res) => {
    save = res ?? ""
    console.log(save)
})

//On Page Load Add Event Listeners  ------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    
    //Tab Menu OnClick
    var tabs = document.getElementsByClassName('w3-button');
    for( var i=0; i<tabs.length; i++){
           tabs[i].addEventListener('click', openTab)
    }
    //Email Subject OnChange
    var subjects = document.getElementsByName('subject');
    for( var i=0; i<subjects.length; i++){
        subjects[i].addEventListener('change', saveSubject)
    }
    //Email Body OnChange
    var emailTemplates = document.getElementsByName('emailBody');
    for( var i=0; i<emailTemplates.length; i++){
        emailTemplates[i].addEventListener('change', saveEmailTemplate)
    }

    //Glossary Toggle
    document.getElementById('collapsible').addEventListener('click', displayGlossary)

    //Calendly link OnChange
    document.getElementById('my_calendly').addEventListener('change', saveCalendly)

    //FAQ link OnChange
    document.getElementById('faq').addEventListener('change', saveFaq)

    //Select First Tab by Default
    tabs[0].click();
});

//Calendly link OnChange  ----------------------------------------------------
function saveCalendly(){
    save["myCalendly"] = this.value;
    
    chrome.storage.sync.set({save}, ()=>{
        console.log(`Calendly link is set to ${save["myCalendly"]}`)
    })
}
//FAQ link OnChange  ---------------------------------------------------------
function saveFaq(){
    save["faq"] = this.value;
    
    chrome.storage.sync.set({save}, ()=>{
        console.log(`FAQ link is set to ${save["faq"]}`)
    })
}

//Save Email Subject onChange  -----------------------------------------------
function saveSubject(){
    var subject = this.id;
    save[subject] = document.getElementById(subject).value;
    
    chrome.storage.sync.set({save}, ()=>{
        console.log(`${subject} is set to ${save[subject]}`)
    })
}

//Save Email Body onChange  --------------------------------------------------
function saveEmailTemplate(){
    var emailType = this.id;
    var parser = new DOMParser();
    var text = document.getElementById(emailType).value;
	var emailBody = parser.parseFromString(text, 'text/html');
    save[emailType] = emailBody.body.outerHTML;

    chrome.storage.sync.set({save}, ()=>{
        console.log(`${emailType} is set to ${save[emailType]}`)
    })
}

//Toggle Glossary  -----------------------------------------------------------
function displayGlossary(){
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
         content.style.display = "block";
    }
}

//Tab Menu -------------------------------------------------------------------
function openTab(){
    var i;
    var emailType= this.id;
    var tabContent = document.getElementsByClassName("email");
    var tabMenu = document.getElementsByClassName("w3-bar-item");
    var parser = new DOMParser();
    //Clean Selected Tab
    for (i = 0; i < tabMenu.length; i++) {
        tabMenu[i].classList.remove("selected");  
    }
    //Clean Displayed Tab Content
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";  
    }
    document.getElementById("tab_"+emailType).style.display = "block";
    document.getElementById(emailType).classList.add("selected");
    var subjectVariableName = "eml_"+emailType+"_subj"; 
    var emailVariableName =  "tmp_"+emailType
    chrome.storage.sync.get(["save"],(res) => {
        document.getElementById(subjectVariableName).value = res.save[subjectVariableName] ?? ""
        document.getElementById(emailVariableName).value = parser.parseFromString(res.save[emailVariableName], "text/html").body.innerText ?? ""
        document.getElementById("my_calendly").value = res.save["myCalendly"] ?? ""
        document.getElementById("faq").value = res.save["faq"] ?? ""
    })
};
//End Tab Menu  -------------------------------------------------------------