/* global $DM:false */
// prefetch dynamically referenced labels
// $Label.mcdm_15.approvalSuccesses
// $Label.mcdm_15.approvalFailures
({
    afterScriptsLoaded: function(cmp, event, helper) {
        helper.init(cmp);
    },

    // FIXME: this function is doing too much
    doProcessApprovals: function(cmp, event, helper) {
        var action = cmp.get('c.processApprovals'),
            approvedMembers = cmp.get('v.approvedMembers'),
            rejectedMembers = cmp.get('v.rejectedMembers'),
            totalRecordsToProcess = approvedMembers.length + rejectedMembers.length;

        action.setParams({
            approvals: JSON.stringify(approvedMembers),
            rejections: JSON.stringify(rejectedMembers),
            eventEntryKey: cmp.get('v.eventEntryKey')
        });

        action.setCallback(this, function(response) {
            var data = response.getReturnValue() || [];

            cmp.set('v.loading', false);

            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                return;
            }

            /* Handle any errors */
            if (data.length) {
                var errorMap = {},
                    rows = cmp.get('v.pendingMembers');

                data.forEach(function(item) {
                    errorMap[item.campaignMemberId] = item.error;
                });

                var failureRows = rows.filter(function(row) {
                    var error = errorMap[row.campaignMemberId];
                    if (error) {
                        row.errorMessage = error;
                    }

                    return !!error;
                });

                var errorMessage;
                if (failureRows.length === totalRecordsToProcess) {
                    errorMessage = $A.get('$Label.mcdm_15.processApprovalsCompleteErrorMessage');
                } else {
                    errorMessage = $A.get('$Label.mcdm_15.processApprovalsPartialSuccessMessage');
                    errorMessage = errorMessage.replace('{0}', totalRecordsToProcess).replace('{1}', failureRows.length);
                }

                $DM.messages.showFailure(errorMessage);
                cmp.set('v.approvedMembers', []);
                cmp.set('v.rejectedMembers', []);
                cmp.set('v.pendingMembers', failureRows);

                // ಠ_ಠ: When we update the pending members attribute aura:iteration
                // needs a moment to re-render the items if we don't have the timeout a bunch
                // of invalid records are returned from getApprovalListItems
                window.setTimeout($A.getCallback(function() {
                    helper.getApprovalListItems(cmp).forEach(function(item) {
                        item.setStatus($DM.journey.ApprovalStatus.ERROR);
                    });
                }, 0));


                return;
            }

            /* Handle the success case */
            var successMessage;
            if (totalRecordsToProcess === 1) {
                var member = approvedMembers.length ? approvedMembers[0] : rejectedMembers[0],
                    displayName = helper.formatDisplayName(member.firstName, member.lastName);

                successMessage = approvedMembers.length ?
                    $A.get('$Label.mcdm_15.processOneApprovalSuccessMessage') :
                    $A.get('$Label.mcdm_15.processOneRejectionSuccessMessage');

                successMessage = successMessage.replace('{0}', displayName);

            } else {
                successMessage = $A.get('$Label.mcdm_15.processApprovalsSuccessMessage');
                successMessage = successMessage.replace('{0}', totalRecordsToProcess);
            }

            $DM.messages.showSuccess(successMessage);
            $A.get('e.force:refreshView').fire();
        });

        cmp.set('v.loading', true);
        $A.util.addClass(cmp.find('approvalMembersFooter'), 'slds-hide');
        helper.stopMonitoringFooterVisibility(cmp);
        $A.enqueueAction(action);
    },

    navigateToCampaign: function(cmp) {
        $A.get('e.force:navigateToObjectHome')
            .setParams({
                scope: cmp.get('v.objectBreadcrumbDetails.objectType'),
                isredirect: true
            })
            .fire();
    },

    navigateToCampaignRecord: function(cmp) {
        $A.get('e.force:navigateToSObject')
            .setParams({
                recordId: cmp.get('v.objectBreadcrumbDetails.objectId'),
                isredirect: true
            })
            .fire();
    },

    /**
     * Handler for mcdm_15:JourneyApprovalsSelectionChanged events
     *
     * @param {Object} cmp The Component instance
     * @param {Object} event The mcdm_15:JourneyApprovalsSelectionChanged event object
     * @param {Object} helper The Component's helper class
     */
    handleSelectionChanged: function(cmp, event, helper) {
        var approval = event.getParam('approval'),
            isChecked = event.getParam('selected'),
            selectedMembers = cmp.get('v.selectedMembers');

        if (isChecked) {
            selectedMembers.push(approval);
        } else {
            selectedMembers = selectedMembers.filter(function(member) {
                return member.campaignMemberId !== approval.campaignMemberId;
            });
        }

        selectedMembers.sort(function(left, right) {
            return left.rowIndex - right.rowIndex;
        });

        cmp.set('v.selectedMembers', selectedMembers);
        helper.toggleSelectAll(cmp);
    },

    /**
     * Handler for the "select all" checkbox change events
     *
     * @param {Object} cmp The Component instance
     * @param {Object} event The change event object
     * @param {Object} helper The Component's helper class
     */
    selectAllChanged: function(cmp, event, helper) {
        var checked = event.getSource().get('v.checked');
        helper.toggleSelectAll(cmp, checked);
    },

    /**
     * Handles the members loaded event from the JourneyApprovalDataProvider
     *
     * @param {Object} cmp The Component instance
     * @param {Object} event The change event object
     * @param {Object} helper The Component's helper class
     */
    handleMembersLoaded: function(cmp, event, helper) {
        var members = cmp.get('v.pendingMembers'),
            totalDataProviderItems = cmp.find('dataProvider').get('v.totalItems');

        event.getParam('data').forEach(function(item) {
            item.rowIndex = members.length;
            item.dirty = false;
            members.push(item);
        });

        cmp.set('v.loading', false);
        cmp.set('v.checkboxDisabled', cmp.get('v.selectedMembers.length') >= cmp.get('v.maxApprovals'));
        cmp.set('v.pendingMembers', members);

        if (members.length < totalDataProviderItems) {
            helper.monitorFooterVisibility(cmp);
        } else if (totalDataProviderItems < cmp.get('v.totalMemberCount')) {
            $A.util.addClass(cmp.find('footerSpinner'), 'slds-hide');
            $A.util.removeClass(cmp.find('footerMessage'), 'slds-hide');
        } else {
            $A.util.addClass(cmp.find('approvalMembersFooter'), 'slds-hide');
        }
    },

    /**
     * Handler for "Personalize Messages" button click
     *
     * @param {Object} cmp The Component instance
     * @param {Object} event The click event object
     * @param {Object} helper The Component's helper class
     */
    handlePersonalizeMessages: function(cmp, event, helper) {
        helper.launchPersonalization(cmp);
    },

    /**
     * Handler for mcdm_15:ApproveRejectButtonGroup `ui:menuSelect` events
     *
     * @param {Object} cmp The Component instance
     * @param {Object} event The change event object
     * @param {Object} helper The Component's helper class
     */
    approveRejectSelected: function(cmp, event, helper) {
        var itemMap = {},
            members = cmp.get('v.selectedMembers'),
            status = event.getParam('selectedItem');

        helper.getApprovalListItems(cmp).forEach(function(item) {
            var key = item.get('v.approvalRecord').campaignMemberId;
            itemMap[key] = item;
        });

        members.forEach(function(member) {
            itemMap[member.campaignMemberId].setStatus(status);
        });

        helper.updateMembersStatus(cmp, members, status);
    }
})