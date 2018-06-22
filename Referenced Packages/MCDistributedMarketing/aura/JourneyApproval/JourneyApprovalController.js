// $Label.mcdm_15.approvedApprovalStatus
// $Label.mcdm_15.errorApprovalStatus
// $Label.mcdm_15.pendingApprovalStatus
// $Label.mcdm_15.rejectedApprovalStatus
({
    init: function(cmp, event, helper) {
        var approvalRecord = cmp.get('v.approvalRecord'),
            displayName = helper.formatDisplayName(approvalRecord.firstName, approvalRecord.lastName);

        cmp.set('v.displayName', displayName);
        helper.setStatusLabel(cmp, approvalRecord.status);
    },

    /**
     * Launches Campaign Member Detail Modal
     * @param  {Object}  cmp    The JourneyApproval Component
     * @param  {Object}  event  The click Event
     * @param  {Object}  helper Helper for the Component
     */
    launchObjectModal: function(cmp, event, helper) {
        var approvalRecord = cmp.get('v.approvalRecord'),
            memberDetailsTitle = $A.get('$Label.mcdm_15.memberDetailsTitle');

        $A.createComponent('mcdm_15:RecordDetail',
        {
            recordId: approvalRecord.objectId,
            recordName: helper.formatDisplayName(approvalRecord.firstName, approvalRecord.lastName),
            objectType: approvalRecord.objectType
        },
        function (recordCmp, status) {
            if(recordCmp.isValid() && status === 'SUCCESS') {

                $A.get('e.ui:createPanel').setParams({
                    panelType: 'modal',
                    visible: true,
                    panelConfig: {
                        title: memberDetailsTitle,
                        body: recordCmp,
                        showCloseButton: true
                    }
                }).fire();
            }
        });
    },

    handleCheckChanged: function(cmp) {
        cmp.getEvent('selectionChanged').setParams({
            approval: cmp.get('v.approvalRecord'),
            selected: cmp.find('checkbox').get('v.checked')
        })
        .fire();
    },

    setStatus: function(cmp, event, helper) {
        var params = event.getParam('arguments');

        cmp.set('v.approvalRecord.status', params.status);
        helper.setStatusLabel(cmp, params.status);
    }
})