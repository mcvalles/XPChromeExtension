//Inject HTML and necesary code-------------------------------------------------------------------
//Check if HTML was already injected on tab
if (document.querySelector("#emailModal") == null) {
    var divEmailModal = document.createElement("div");
    //Email Modal HTML
    var divEmailModal = document.createElement("div");
    document.body.appendChild(divEmailModal);
    divEmailModal.id = "emailModal";
    divEmailModal.classList = "modal";
    divEmailModal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <p>Copy to your clipboard any of the following email templates:</p>
        <div class="btn-group">
            <button id="eml_outreach" type="button" name="modalButton"><span>Outreach - Interview Request</span></button>
            <button id="eml_referral" type="button" name="modalButton"><span>Referral - Interview Request</span></button>
            <button id="eml_interview" type="button" name="modalButton"><span>Expert Meeting - Interview Request</span></button>
            <button id="eml_rejection" type="button" name="modalButton"><span>Rejection - Candidate Feedback</span></button> 
            <button id="eml_acceptance" type="button" name="modalButton"><span>Acceptance - Candidate Feedback</span></button> 
        </div>
        <p>Or keep it simple:</p>
        <div class="btn-group">
            <button id="blankEmail" type="button"><span>Blank Email</span></button>
        </div>
    </div>
    `;
}