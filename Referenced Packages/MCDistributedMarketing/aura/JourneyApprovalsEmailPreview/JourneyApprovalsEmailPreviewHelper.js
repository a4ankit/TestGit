/* global $DM:false */
// $Label.mcdm_15.sendFromNamePlaceholder
// $Label.mcdm_15.sendFromEmailPlaceholder
// $Label.mcdm_15.firstNamePlaceholder
// $Label.mcdm_15.lastNamePlaceholder
// $Label.mcdm_15.introPlaceholder
// $Label.mcdm_15.closingPlaceholder
// $Label.mcdm_15.sfUserIdPlaceholder
// $Label.mcdm_15.sfCampaignIdPlaceholder
// $Label.mcdm_15.sfCampaignMemberIdPlaceholder
({
    /**
     * The number of milliseconds to wait before updating the e-mail preview.
     *
     * @const
     * @type {Number}
     * @access private
     */
    _PREVIEW_UPDATE_DEBOUNCE_TIMEOUT: 500,

    fetchPersonalizationFields: function(cmp, callback) {
        var action = cmp.get('c.getPersonalizationFields'),
            selectedMember = cmp.get('v.selectedMember');

        action.setParam('approvalRecord', JSON.stringify(selectedMember));
        action.setCallback(this, function(response) {
            cmp.set('v.fieldMaps', response.getReturnValue());

            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                var errorMessage = $DM.messages.getActionError(response);
                cmp.find('emailPreview').set('v.errorMessage', errorMessage);
                return;
            }

            if (callback) {
                callback();
            }
        });

        $A.enqueueAction(action);
    },

    updateEmailPreview: function(cmp) {
        var activity = cmp.get('v.activity'),
            selectedMember = cmp.get('v.selectedMember'),
            fieldNames = $DM.journey.PersonalizationField,
            placeHolderGreetingLabel = $A.get('$Label.mcdm_15.greetingPlaceholder');

        // If we have no members in context use a blank field map with the greeting label as the greeting value.
        var fieldMaps = cmp.get('v.membersInContext') ? cmp.get('v.fieldMaps') : {
            greeting: placeHolderGreetingLabel.replace('{0}', selectedMember.greeting.label)
        };

        if (activity && fieldMaps) {
            var emailP13n = selectedMember.messages[activity.EmailId] || {};
            fieldMaps.intro = emailP13n.intro;
            fieldMaps.closing = emailP13n.closing;

            // Set placeholder values in the absence of personalization values.
            Object.keys(fieldNames).forEach(function(key) {
                var attribute = fieldNames[key];
                if (!fieldMaps[attribute]) {
                    fieldMaps[attribute] = $A.get('$Label.mcdm_15.' + attribute + 'Placeholder');
                }
            });

            cmp.set('v.emailData', {
                emailId: activity.EmailId,
                fieldMaps: fieldMaps,
                subject: activity.EmailSubject,
                preHeader: activity.PreHeader
            });
        }
    },

    debounceAction: function(cmp, action) {
        var previewUpdateTimeoutId = cmp.get('v.previewUpdateTimeoutId');
        if (previewUpdateTimeoutId) {
            clearTimeout(previewUpdateTimeoutId);
        }

        previewUpdateTimeoutId = setTimeout($A.getCallback(action), this._PREVIEW_UPDATE_DEBOUNCE_TIMEOUT);
        cmp.set('v.previewUpdateTimeoutId', previewUpdateTimeoutId);
    },

    /**
     * Formats a name based on the current locale settings
     *
     * @param {String} firstName The first name
     * @param {String} lastName The last name
     * @returns {String} The formated full name
     */
    formatDisplayName: function(firstName, lastName) {
        var names = [lastName];
        if (firstName) {
            names.unshift(firstName);
        }

        if ($A.get('$Locale.isEasternNameStyle')) {
            names.reverse();
        }

        return names.join(' ');
    }

})