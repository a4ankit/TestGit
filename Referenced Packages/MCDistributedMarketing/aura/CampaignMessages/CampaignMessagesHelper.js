/* global $DM:false */
({
    SettingsCogOptions: {
        EDIT_CONNECTION: 'EDIT_CONNECTION',
        PERSONALIZATION_SETTINGS: 'PERSONALIZATION_SETTINGS',
        PERSONALIZATION_DEFAULTS: 'PERSONALIZATION_DEFAULTS',
        SETTINGS: 'SETTINGS'
    },

    /**
     * The name of the Campaign object type.
     *
     * @const
     * @type {String}
     * @access private
     */
    CAMPAIGN_OBJECT_TYPE: 'Campaign',

    init: function(cmp) {
        var hasJourneyId = cmp.get('v.sObjectName') === 'mcdm_15__MarketingCloudJourney__x';

        this[hasJourneyId ? 'initWithJourney' : 'initWithObject'](cmp, cmp.get('v.recordId'));
        this.getObjectBreadcrumbDetails(cmp);
        this.getPermissions(cmp);
        this.getApprovalCounts(cmp);

        var settingsMethod = 'c.getSettingsOptions';
        if (!$A.util.isUndefinedOrNull($A.get('$Site'))) {
            settingsMethod = 'c.getSettingsOptionsForCommunities';
        }

        var getSettingsOptions = cmp.get(settingsMethod);
        getSettingsOptions.setParams({ campaignId: cmp.get('v.objectId')});
        getSettingsOptions.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                var settings = response.getReturnValue();
                cmp.set('v.actions', settings);
            } else {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
            }
        });

        $A.enqueueAction(getSettingsOptions);
    },

    initWithObject: function(cmp, objectId) {
        cmp.set('v.objectId', objectId);

        var actionOptions = {
            name: 'c.getLinkedJourneyForObject',
            params: {objectId: objectId}
        };

        actionOptions.completeFunc = function(campaignJourney) {
            if (!$A.util.isEmpty(campaignJourney)) {
                cmp.set('v.linkedJourneyId', campaignJourney.Id);
                this.initWithJourney(cmp, campaignJourney.mcdm_15__JourneyId__c);
                cmp.set('v.disableApprovals', campaignJourney.mcdm_15__ImmediateApproval__c);
            } else {
                cmp.set('v.loading', false);
            }
        }.bind(this);

        this.executeControllerAction(cmp, actionOptions);
    },

    initWithJourney: function(cmp, journeyId) {
        if (!$A.util.isEmpty(journeyId)) {
            cmp.set('v.journeyId', journeyId);

            var actionOptions = {
                name: 'c.getJourneyDetailsFromSObject',
                params: { sObjectId: journeyId }
            };

            actionOptions.completeFunc = function(details) {
                cmp.set('v.journeyDetails', details);
                cmp.set('v.disableApprovals', !details.activities.length || cmp.get('v.disableApprovals'));
                cmp.set('v.loading', false);
            };

            this.executeControllerAction(cmp, actionOptions);
        } else {
            $DM.messages.showFailure($A.get('$Label.mcdm_15.errorFetchingContent'));
        }
    },

    getApprovalCounts: function(cmp) {
        var actionOptions = {
            name: 'c.getApprovalStatusCounts',
            params: { campaignId: cmp.get('v.recordId') }
        };

        actionOptions.completeFunc = function(counts) {
            cmp.set('v.memberCounts', {
                error: counts.Error,
                rejected: counts.Rejected,
                approved: counts.Approved,
                actionable: counts.Error + counts.Pending
            });
        };

        this.executeControllerAction(cmp, actionOptions);
    },

    /**
     * Gets the permission sets for the current user via the `PermissionSetsService` service component
     *
     * @param {Object} cmp The Component instance
     */
    getPermissions: function(cmp) {
        cmp.find('permissionSetService').getAllPermissions(function(permissions) {
            cmp.set('v.permissions', permissions);
        });
    },

    getObjectBreadcrumbDetails: function(cmp) {
        var params = {
            sObjectId: cmp.get('v.recordId'),
            sObjectType: cmp.get('v.sObjectName') || this.CAMPAIGN_OBJECT_TYPE
        };

        var actionOptions = {
            name: 'c.getObjectBreadcrumbDetails',
            params: params
        };

        actionOptions.completeFunc = function(objectBreadcrumbDetails) {
            cmp.set('v.objectBreadcrumbDetails', objectBreadcrumbDetails);
        };

        this.executeControllerAction(cmp, actionOptions);
    },

    executeControllerAction: function(cmp, actionOptions) {
        var action = cmp.get(actionOptions.name);

        action.setParams(actionOptions.params);
        action.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                cmp.set('v.loading', false);
                cmp.set('v.isBusy', false);
                return;
            }

            if (actionOptions.completeFunc) {
                actionOptions.completeFunc(response.getReturnValue());
            }
        });

        var isLoading = actionOptions.isLoading;
        cmp.set('v.loading', $A.util.isUndefinedOrNull(isLoading) ? true : isLoading);
        $A.enqueueAction(action);
    },

    launchConnectJourney: function(cmp) {
        var saveLabel = $A.get('$Label.mcdm_15.save'),
            cancelLabel = $A.get('$Label.mcdm_15.cancel');

        $A.createComponents([
            ['mcdm_15:ConnectCampaign', {recordId: cmp.get('v.recordId')}],
            ['lightning:button', {
                variant: 'neutral',
                label: cancelLabel,
                onclick: cmp.getReference('c.closeConnectCampaignModal')
            }],
            ['lightning:button', {
                variant: 'brand',
                label: saveLabel,
                onclick: cmp.getReference('c.applyJourneyLinkChanges'),
                disabled: true
            }]
        ], function(components) {
            var connectCampaignCmp = components[0],
                cancelButton = components[1],
                saveButton = components[2];

            connectCampaignCmp.set('v.saveButton', saveButton);
            cmp.set('v.connectCampaignCmp', connectCampaignCmp);
            $A.get('e.ui:createPanel').setParams({
                panelType: 'modal',
                visible: true,
                panelConfig: {
                    title: $A.get('$Label.mcdm_15.connectCampaign'),
                    body: connectCampaignCmp,
                    footer: [cancelButton, saveButton],
                    showCloseButton: true
                },
                onCreate: $A.getCallback(function(connectCampaignModal) {
                    cmp.set('v.connectCampaignModal', connectCampaignModal);
                })
            }).fire();
        });
    },

    /**
     * Starts the personalization-defaults editing workflow
     *
     * @param {Object} cmp The Component instance
     * @param {Object} activity The target activity object
     */
    launchJourneyPersonalization: function(cmp, activity) {
        // This map aids in transforming the flat list of default p13n values from the back-end
        // to map of messages that the front end consumes and vice-versa.
        var p13nIdMap = {},
            sendSetting = {};

        var saveDefaultsCallback = function(updatedDefaults) {
            var p13nDefaults = [],
                updatedDefault = updatedDefaults[0],
                messages = updatedDefault.messages,
                greeting = updatedDefault.greeting,
                campaignId = cmp.get('v.recordId');

            // Transform the message map structures into a flat list of default p13n values.
            Object.keys(messages).forEach(function(emailId) {
                var emailObj = messages[emailId];

                Object.keys(emailObj).forEach(function(blockId) {
                    var p13nDefault = { Id: p13nIdMap[emailId + blockId] };

                    /* eslint-disable camelcase */
                    p13nDefault.mcdm_15__campaignId__c = campaignId;
                    p13nDefault.mcdm_15__lookupType__c = $DM.journey.P13nLookupType.LEGACY_EMAIL_ID;
                    p13nDefault.mcdm_15__lookupId__c = emailId;
                    p13nDefault.mcdm_15__blockId__c = blockId;
                    p13nDefault.mcdm_15__value__c = emailObj[blockId];
                    /* eslint-enable camelcase */

                    p13nDefaults.push(p13nDefault);
                });
            });

            // Persist the settings.
            sendSetting.greetingKey = greeting.value;
            var defaultSettings = {
                sendSetting: sendSetting,
                greeting: greeting,
                p13nDefaults: p13nDefaults
            };

            var saveParams = {
                campaignId: campaignId,
                journeyDefaultsJson: JSON.stringify(defaultSettings)
            };

            var actionOptions = {
                name: 'c.saveDefaultCampaignPersonalizations',
                params: saveParams,
                isLoading: false
            };

            actionOptions.completeFunc = function() {
                cmp.set('v.isBusy', false);
            };

            cmp.set('v.isBusy', true);
            this.executeControllerAction(cmp, actionOptions);
        }.bind(this);


        var fetchDefaultsCallback = function(data) {
            var messages = {};
                sendSetting = data.sendSetting;

            // Transform the flat list of default P13n values into a map of messages and p13n blocks.
            data.p13nDefaults.forEach(function(p13nDefault) {
                var emailId = p13nDefault.mcdm_15__lookupId__c,
                    blockId = p13nDefault.mcdm_15__blockId__c;

                if (!messages[emailId]) {
                    messages[emailId] = { };
                }

                messages[emailId][blockId] = p13nDefault.mcdm_15__value__c;
                p13nIdMap[emailId + blockId] = p13nDefault.Id;
            });

            var defaultSettings = [{
                greeting: data.greeting,
                messages: messages
            }];

            this.showJourneyPersonalizationModal(cmp.get('v.journeyId'), activity, defaultSettings, data.greetingOptions, saveDefaultsCallback);
            cmp.set('v.isBusy', false);
        }.bind(this);


        cmp.set('v.isBusy', true);
        this.executeControllerAction(cmp, {
            name: 'c.getDefaultCampaignPersonalizations',
            params: { campaignId: cmp.get('v.recordId') },
            isLoading: false,
            completeFunc: fetchDefaultsCallback
        });
    },

    /**
     * Shows the personalization-defaults modal dialog.
     *
     * @param {String} journeyId The id of the target MC Journey
     * @param {Object} activity The target activity object
     * @param {Object} defaultSettings The current default settings
     * @param {Object} greetingOptions The default Send Setting Greeting Options
     * @param {Function} saveCallback The callback that handles persisting the changes on save
     */
    showJourneyPersonalizationModal: function(journeyId, activity, defaultSettings, greetingOptions, saveCallback) {
        var modal, journeyPersonalization, cancelButton, saveButton, saveAndCloseButton;

        var cancelHandler = $A.getCallback(function() {
            modal.close();
        });

        var saveHandler = $A.getCallback(function() {
            journeyPersonalization.applyChanges();

            if (saveCallback) {
                saveCallback(journeyPersonalization.get('v.defaultSettings'));
            }
        });

        var saveAndCloseHandler = $A.getCallback(function() {
            saveHandler.call(this);
            cancelHandler.call(this);
        }.bind(this));

        var personalizationChangedHandler = $A.getCallback(function(event) {
            var notDirty = !event.getParam('isDirty'),
                isInvalid = !event.getParam('areP13nsValid');
            saveButton.set('v.disabled', notDirty || isInvalid);
            saveAndCloseButton.set('v.disabled', notDirty || isInvalid);
        });

        $A.createComponents([
            ['mcdm_15:JourneyPersonalizationDefaults', {
                journeyId: journeyId,
                defaultSettings: defaultSettings,
                defaultGreetingOptions: greetingOptions,
                selectedActivity: activity
            }],
            ['lightning:button', {
                variant: 'neutral',
                label: $A.get('$Label.mcdm_15.cancel'),
                onclick: {run: cancelHandler}
            }],
            ['lightning:button', {
                variant: 'brand',
                label: $A.get('$Label.mcdm_15.save'),
                disabled: true,
                onclick: {run: saveHandler}
            }],
            ['lightning:button', {
                variant: 'brand',
                label: $A.get('$Label.mcdm_15.saveAndClose'),
                disabled: true,
                onclick: {run: saveAndCloseHandler}
            }]
        ], function(components) {
            journeyPersonalization = components[0];
            cancelButton = components[1];
            saveButton = components[2];
            saveAndCloseButton = components[3];

            $A.get('e.ui:createPanel')
                .setParams({
                    panelType: 'modal',
                    visible: true,
                    panelConfig: {
                        title: $A.get('$Label.mcdm_15.campaignPersonalizationDefaults'),
                        body: journeyPersonalization,
                        footer: [cancelButton, saveButton, saveAndCloseButton],
                        showCloseButton: true,
                        flavor: 'large'
                    },
                    onCreate: function(newCmp) {
                        modal = newCmp;
                    }
                })
                .fire();

            journeyPersonalization.addEventHandler('personalizationChanged', personalizationChangedHandler);
        });
    },

    launchAdminPage: function() {
        $A.get('e.force:navigateToComponent').setParams({
            componentDef: 'mcdm_15:AdministratorSettings',
            componentAttributes: {},
            isredirect: true
        }).fire();
    },

    launchDefaultSettingsPage: function() {
        $A.get('e.force:navigateToComponent').setParams({
            componentDef: 'mcdm_15:UserPersonalizationSettings',
            componentAttributes: {},
            isredirect: true
        }).fire();
    }
})