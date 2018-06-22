/* global $DM:false */
({
    afterScriptsLoaded: function(cmp) {
        var action = cmp.get('c.getGreetingOptions');

        action.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
            }

            var greetings = response.getReturnValue(),
                members = cmp.get('v.members'),
                selectCmp = cmp.find('greetingSelect');

            var firstGreeting = members[0].greeting;
            var greetingsAreTheSame = members.every(function(member) {
                return member.greeting.value === firstGreeting.value;
            });

            if (greetingsAreTheSame) {
                // Removes the blank option
                greetings.shift();

                // ಠ_ಠ: We cannot set the greetings attribute and the selected
                // value on the same thread. The second change is not reflected
                // as we need to give the 'iteration' component time to resolve.
                window.setTimeout($A.getCallback(function() {
                    selectCmp.set('v.value', firstGreeting.value);
                }, 0));

                cmp.set('v.savedGreeting', firstGreeting.value);
            }

            cmp.set('v.greetings', greetings);
        });

        $A.enqueueAction(action);
    },

    handleInputChanged: function(cmp) {
        var greeting = cmp.find('greetingSelect').get('v.value'),
            savedGreeting = cmp.get('v.savedGreeting');

        cmp.getEvent('personalizationChanged')
            .setParams({ isDirty: greeting !== savedGreeting })
            .fire();
    },

    applyChanges: function(cmp, event, helper) {
        var selectCmp = cmp.find('greetingSelect'),
            greeting = selectCmp.get('v.value'),
            greetings = cmp.get('v.greetings'),
            members = [].slice.call(cmp.get('v.members')),
            savedGreeting = cmp.get('v.savedGreeting');

        if (greeting !== savedGreeting) {
            var option = helper.getGreetingOptionFromSelectionValue(cmp, greeting);
            members.forEach(function(member) {
                member.greeting = option;
            });

            // Removes the blank option.
            if ($A.util.isEmpty(greetings[0].value)) {
                greetings.shift();
                cmp.set('v.greetings', greetings);

                // ಠ_ಠ: We cannot set the greetings attribute and the selected
                // value on the same thread. The second change is not reflected
                // as we need to give the 'iteration' component time to resolve.
                window.setTimeout($A.getCallback(function() {
                    selectCmp.set('v.value', option.value);
                }, 0));
            } else {
                selectCmp.set('v.value', option.value);
            }

            cmp.set('v.savedGreeting', option.value);
        }
    }
})