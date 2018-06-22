/* global $DM:false */
({
    /**
     * Fires a personalization changed event to indicate that changes have been made to this or a
     * child component's state.
     *
     * @param {Object} cmp The Component instance
     */
    fireChangedEvent: function(cmp) {
        var isDirty = $DM.values(cmp.get('v.dirtyFlags')).some(function(val) {
            return val;
        });

        cmp.getEvent('personalizationChanged')
            .setParams({
                isDirty: isDirty,
                areP13nsValid: cmp.get('v.areP13nsValid')
            })
            .fire();
    },

    /**
     * Resets all dirty flags pertaining to child component states.
     *
     * @param {Object} cmp The Component instance
     */
    resetDirtyFlags: function(cmp) {
        cmp.set('v.dirtyFlags', {
            sendSettings: false,
            messageP13n: false,
            pluginCustomData: false
        });
    },

    /**
     * Applies the custom data provided by the plugin to the
     * members in context.
     *
     * @param {Object} cmp The Component instance
     */
    applyPluginCustomData: function(cmp) {
        if (!cmp.get('v.dirtyFlags.pluginCustomData')) {
            return;
        }

        var members = cmp.get('v.members'),
            customData = cmp.get('v.pluginCustomData');

        members.forEach(function(record) {
            var id = record.campaignMemberId;
            if (!$A.util.isUndefinedOrNull(customData[id])) {
                record.customData = customData[id];
            }
        });

        cmp.set('v.pluginCustomData', {});
    },

    /**
     * Fetches and creates the plugin component if one is registered.
     *
     * @param {Object} cmp The Component instance
     */
    fetchAndCreatePlugin: function(cmp) {
        var createPluginTab = function(plugin, label) {
            $A.createComponent(plugin, {}, function(pluginCmp, status, error) {
                if (status !== 'SUCCESS' && window.$DM) {
                    $DM.messages.showFailure(error);
                    return;
                }

                cmp.find('tabset').get('e.addTab')
                    .setParams({
                        tab: {
                            title: label,
                            name: 'extCmpsTab',
                            body: pluginCmp
                        }
                    })
                    .fire();

                if (!pluginCmp.get('v.personalizationReadyHandler')) {
                    console.warn('Plugin "%s" must supply a "personalizationReadyHandler" Aura.Action!', plugin); // eslint-disable-line no-console
                } else if (!pluginCmp.messagePersonalizationReady) {
                    console.warn('Plugin "%s" must implement the "mcdm_15:MessagePersonalizationHandler" interface!', plugin); // eslint-disable-line no-console
                } else {
                    pluginCmp.messagePersonalizationReady(JSON.parse(JSON.stringify(cmp.get('v.members'))));
                }
            });
        };

        var pluginSettingsService = cmp.find('pluginSettingsService');
        pluginSettingsService.getPlugin(function(plugin) {
            if (plugin) {
                pluginSettingsService.getLabel(function(label) {
                    createPluginTab(plugin, label || $A.get('$Label.mcdm_15.externalComponents'));
                });
            }
        });
    },

    /**
     * Updates the selected member of the preview component so that it has
     * the latest personalization. Autocomplete items are copied not referenced
     * when sent along as params via events.
     *
     * @param {Object} cmp The Component instance
     */
    updatePreviewedSelectedMember: function(cmp) {
        var previewComponent = cmp.find('emailPreview'),
            selectedMemberId = previewComponent.get('v.selectedMember').objectId,
            dataProviderItems = cmp.find('memberDataProvider').get('v.items');

        for (var index = 0; index < dataProviderItems.length; index = index + 1) {
            var member = dataProviderItems[index].value;
            if (member.objectId === selectedMemberId) {
                previewComponent.set('v.selectedMember', member);
                break;
            }
        }
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