//Inject HTML and necesary code-------------------------------------------------------------------
//Check if HTML was already injected on tab
if (document.querySelector("#emailModal") == null){
    var divEmailModal=document.createElement("div"); 
    //Email Modal HTML
    var divEmailModal=document.createElement("div"); 
    document.body.appendChild(divEmailModal); 
    divEmailModal.id="emailModal";
    divEmailModal.classList="modal";
    divEmailModal.innerHTML=`
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
//------------------------------------------------------------------------------------------------
    // //HTML for Email Templates
    // //Outreach Template
    // var divOutreachEmail=document.createElement("div"); 
    // document.body.appendChild(divOutreachEmail); 
    // divOutreachEmail.innerHTML=`
    // <div id='tmp_outreach' style='display:none'>
    // <div>
    // <p>Hi [candidate],</p>
    // <p>I came by your profile and thought you might be a good fit for X-Team!</p>
    // <p>Would you be interested in taking part of our selection process? If so, please schedule an interview at your earliest availability [calendlyLink].</p>
    // <p>Looking forward to hearing from you, and thank you for your time!</p>
    // <p>Regards,</p>
    // [senderName]
    // </div>
    // </div>`;

    // //Referral Template
    // var divReferralEmail=document.createElement("div"); 
    // document.body.appendChild(divReferralEmail); 
    // divReferralEmail.innerHTML=`
    // <div id="tmp_referral" style="display:none">
    // <p>Hi [candidate],</p>
    // <p>I’ve been speaking with [referral] about your profile and it sounds like you might be a fit for X-Team! I’d like to chat with you to dig a little deeper on your technical background and skills. </p>
    // <p>Would you be interested in taking part of our selection process? If so, please schedule an interview at your earliest availability [calendlyLink].</p>
    // <p>Looking forward to hearing from you, and thank you for your time!</p>
    // <p>Regards,</p>
    // [senderName]
    // </div>`;

    // //Rejection Template - Unsuccessful Interview
    // var divRejectionEmail1=document.createElement("div"); 
    // document.body.appendChild(divRejectionEmail1); 
    // divRejectionEmail1.innerHTML=`
    // <div id="tmp_rejection1" style="display:none">
    // <p>Hi [candidate],</p>
    // <p>Thank you for your patience! Unfortunately I have to inform you that we decided to move with another candidate for the position we were considering you for.</p>
    // <p>I know this can be discouraging to hear, but bear in mind that we have your profile in our system, and you will be considered for opportunities that open up in the future.</p>
    // <p>We really do appreciate that you want to be part of our company, and I look forward to speaking once again when a position that fits your profile opens up. Thank you for your time!</p>
    // <p>Regards,</p>
    // [senderName]
    // </div>`;

    // //Rejection Template - Other Reasons
    // var divRejectionEmail2=document.createElement("div"); 
    // document.body.appendChild(divRejectionEmail2); 
    // divRejectionEmail2.innerHTML=`
    // <div id="tmp_rejection2" style="display:none">
    // <p>Hi [candidate],</p>
    // <p>I wanted to reach out to give you an update regarding your application:</p>
    // <p>Unfortunately, we’ve decided to go with another candidate for the position that we were considering you for. That said, I think you are a great fit for X-Team so I’ve shortlisted you in our system for future opportunities. </p>
    // <p>We have a lot of opportunities coming in on a rolling basis, and we’ll make sure to reach out if your skillset matches with one of them! </p>
    // <p>Thank you for the time and effort you put into this application, and here’s hoping you become a fellow X-Teamer in the near future!</p>
    // <p>Regards,</p>
    // [senderName]
    // </div>`;