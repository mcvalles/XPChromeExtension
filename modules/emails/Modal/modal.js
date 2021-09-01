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
        <p>Include the following information if your template uses it:</p>
        <div class="input-group">
            <div>
                <label>Interviewer Name</label>
                <input type="text" id="interviewer" name="interviewer">
            </div>
            <div>
                <label>Interviewer Calendly</label>
                <input type="text" id="calendlyLink" name="calendly">
            </div>
            <div>
                <label>Referral Name</label>
                <input type="text" id="referralName" name="referral">
            </div>
            <div>
                <label>Role Name</label>
                <input type="text" id="role-name" name="role">
            </div>
            <div>
                <label>Previous FT</label>
                <input type="text" id="previousContact" name="contactedBy">
            </div>
            <div>
                <label>Tech List</label>
                <input type="text" id="techList" name="techs">
            </div>
        </div>
        <p>Copy to your clipboard any of the following email templates:</p>
        <div class="btn-group">
            <button id="eml_outreach" type="button" name="modalButton"><span>Outreach - Interview Request</span></button>
            <button id="eml_referral" type="button" name="modalButton"><span>Referral - Interview Request</span></button>
            <button id="eml_interview" type="button" name="modalButton"><span>Expert Meeting - Interview Request</span></button>
            <button id="eml_rejection" type="button" name="modalButton"><span>Rejection - Candidate Feedback</span></button> 
            <button id="eml_onhold" type="button" name="modalButton"><span>Role on Hold</span></button> 
            <button id="eml_acceptance" type="button" name="modalButton"><span>Acceptance - Candidate Feedback</span></button> 
            <button id="eml_shortlist" type="button" name="modalButton"><span>Previously Vetted</span></button> 
            <button id="eml_update" type="button" name="modalButton"><span>Application Update</span></button> 
        </div>
        <p>Or keep it simple:</p>
        <div class="btn-group">
            <button id="blankEmail" type="button"><span>Blank Email</span></button>
        </div>
    </div>
    `;
}