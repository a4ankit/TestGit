/* global $DM:false */
({
    setupAutocompleteExistingCampaignJourneyLinkage: function(cmp, campaignJourneyLink) {
        if (!campaignJourneyLink) {
            return;
        }

        var autoComplete = cmp.find('autoComplete');
        autoComplete.set('v.value', campaignJourneyLink.mcdm_15__JourneyName__c);
    },

    getInitialData: function(cmp) {
        var action = cmp.get('c.getQuickActionData');

        action.setParams({
            campaignId: cmp.get('v.recordId'),
            maxResults: 1
        });

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                var data = response.getReturnValue();

                cmp.set('v.hasAccess', data.isAdmin);
                cmp.set('v.hasCampaignMembers', data.campaignMembers.length > 0);
                cmp.set('v.isParent', data.isParent);

                if (data.campaignJourneyLink) {
                    cmp.set('v.campaignJourneyLink', data.campaignJourneyLink);
                    cmp.set('v.journeyId', data.campaignJourneyLink.mcdm_15__JourneyId__c);
                    cmp.set('v.isApprovalFlow', !data.campaignJourneyLink.mcdm_15__ImmediateApproval__c);
                }

                this.setFormEditable(cmp);

                if (cmp.get('v.isEditable')) {
                    this.setupAutocompleteExistingCampaignJourneyLinkage(cmp, data.campaignJourneyLink);
                }
            }

            cmp.set('v.isLoading', false);
        });

        cmp.set('v.isLoading', true);
        $A.enqueueAction(action);
    },

    setFormEditable: function(cmp) {
        var hasCampaignMembers = cmp.get('v.hasCampaignMembers'),
            hasAccess = cmp.get('v.hasAccess'),
            isParent = cmp.get('v.isParent'),
            message;

        if (!hasAccess) {
            message = $A.get('$Label.mcdm_15.connectCampaignPermissionDenied');
        } else if (hasCampaignMembers || isParent) {
            message = $A.get('$Label.mcdm_15.connectCampaignChangeJourney');
        }

        if (message) {
            cmp.set('v.formDisabledMessage', message);
        }

        cmp.set('v.isEditable', !message);
    },

    upsertJourneyLinkageRecord: function(cmp, callback) {
        cmp.set('v.isLoading', true);
        var action = cmp.get('c.upsertCampaignJourneyLink');

        action.setParams({linkData: this.getLinkData(cmp)});
        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                if (typeof callback === 'function') {
                    callback();
                }
                $A.get('e.force:refreshView').fire();
            } else {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.failedToCreateCampaignJourneyLink'));
            }
            cmp.set('v.isLoading', false);
        });

        $A.enqueueAction(action);
    },

    getLinkData: function(cmp) {
        var existingLink = cmp.get('v.campaignJourneyLink'),
            linkData = {
                campaignId: cmp.get('v.recordId'),
                journeyId: cmp.get('v.journeyId'),
                journeyName: cmp.find('autoComplete').get('v.value'),
                isApprovalFlow: cmp.get('v.isApprovalFlow')
            };

        if (existingLink) {
            linkData.id = existingLink.Id;
        }

        return linkData;
    },

    handleAutoCompleteInputChange: function(cmp, event) {
        var dataProvider = cmp.find('dataProvider'),
            journeyQueryValue = event.getParam('value');

        cmp.set('v.journeyId', '');
        if (!$A.util.isEmpty(journeyQueryValue)) {
            dataProvider.get('e.provide').setParams({parameters:{journeyName: journeyQueryValue}}).fire();
        }
    },

    handleAutoCompleteSelection: function(cmp, event) {
        var journeyId = event.getParam('value');

        cmp.set('v.journeyId', journeyId);
        this.toggleSaveButton(cmp, {disabled: false});
    },

    /**
     * Sets the disabled state of the save button
     *
     * @param {Object} The Component instance
     * @param {Boolean} options.disabled The value to set for the `disabled` state
     */
    toggleSaveButton: function(cmp, options) {
        cmp.get('v.saveButton')[0].set('v.disabled', options.disabled);
    }
})