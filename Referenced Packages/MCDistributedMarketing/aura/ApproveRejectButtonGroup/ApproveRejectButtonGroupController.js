/* global $DM:false */
({
    handleApproved: function(cmp, event, helper) {
        helper.fireMenuSelect(cmp, $DM.journey.ApprovalStatus.APPROVED);
    },

    handleRejected: function(cmp, event, helper) {
        helper.fireMenuSelect(cmp, $DM.journey.ApprovalStatus.REJECTED);
    },

    handleMenuSelect: function(cmp, event, helper) {
        helper.fireMenuSelect(cmp, $DM.journey.ApprovalStatus.PENDING);
    }
})