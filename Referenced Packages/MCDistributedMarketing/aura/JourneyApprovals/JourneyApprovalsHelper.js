/* global $DM:false */
({
    /**
     * The number of milliseconds to wait for idle time before invoking the footer's resize and
     * scroll handlers
     *
     * @const
     * @type {Number}
     * @access private
     */
    FOOTER_VISIBILITY_DEBOUNCE_TIMEOUT: 250,

    /**
     * Triggers infinite scroll loading when this percentage or less of the footer is hidden
     *
     * @const
     * @type {Number}
     * @access private
     */
    FOOTER_VISIBILITY_THRESHOLD: 0.70,

    /**
     * Timer ID for footer visibility debounce timeout
     *
     * @const
     * @type {Number}
     * @access private
     */
    _footerVisibilityTimeoutId: null,

    /**
     * A reference to the membersContainer change handler used to monitor for footer visibility.
     *
     * @const
     * @type {Function}
     * @access private
    */
    _membersContainerChangeHandler: null,

    /**
     * Initializes the component
     *
     * @param {Object} cmp The Component instance
     */
    init: function(cmp) {
        this.getPermissions(cmp, $A.getCallback(function(permissions) {
            cmp.set('v.permissions', permissions);

            if (permissions.isStandard) {
                this.getApprovalsEnabled(cmp);
            } else {
                cmp.set('v.loading', false);
            }
        }.bind(this)));
    },

    /**
     * Fetches and stores the `v.approvalEnabled` flag
     *
     * @param {Object} cmp The Component instance
     */
    getApprovalsEnabled: function(cmp) {
        var getApprovalsEnabled = cmp.get('c.getApprovalsEnabled');
        getApprovalsEnabled.setParams({campaignId: cmp.get('v.campaignId')});
        getApprovalsEnabled.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                return;
            }

            var enabled = response.getReturnValue();
            cmp.set('v.approvalsEnabled', enabled);

            if (!enabled) {
                cmp.set('v.loading', false);
            } else {
                this.fetchMemberCount(cmp);
            }
        });

        $A.enqueueAction(getApprovalsEnabled);
    },

    /**
     * Fetches and stores the total number of pending approvals.
     *
     * @param {Object} cmp The Component instance
     */
    fetchMemberCount:  function(cmp) {
        var getTotalCount = cmp.get('c.getTotalCount');
        getTotalCount.setParams({campaignId: cmp.get('v.campaignId')});
        getTotalCount.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                return;
            }

            cmp.set('v.totalMemberCount', response.getReturnValue());
        });

        $A.enqueueAction(getTotalCount);
    },

    /**
     * Launches the personalization modal dialog.
     *
     * @param {Object} cmp The Component instance
     */
    launchPersonalization: function(cmp) {
        var modal, journeyPersonalization, cancelButton, saveButton, saveAndCloseButton;
        var cancelHandler = $A.getCallback(function() {
            modal.close();
        });

        var saveHandler = $A.getCallback(function() {
            journeyPersonalization.applyChanges();

            var updatedMembers = journeyPersonalization.get('v.members');
            this.updateMembers(cmp, updatedMembers);
            cmp.set('v.selectedMembers', updatedMembers);
        }.bind(this));

        var saveAndCloseHandler = $A.getCallback(function() {
            saveHandler.call(this);
            cancelHandler.call(this);
        }.bind(this));

        var personalizationChangedHandler = $A.getCallback(function(event) {
            var notDirty = !event.getParam('isDirty'),
                areP13nsInvalid = !event.getParam('areP13nsValid');

            saveButton.set('v.disabled', notDirty || areP13nsInvalid);
            saveAndCloseButton.set('v.disabled', notDirty || areP13nsInvalid);
        });

        $A.createComponents([
            ['mcdm_15:JourneyPersonalization', {
                journeyId: cmp.get('v.journeyId'),
                members: JSON.parse(JSON.stringify(cmp.get('v.selectedMembers')))
            }],
            ['lightning:button', {
                variant: 'neutral',
                label: $A.get('$Label.mcdm_15.cancel'),
                onclick: {run: cancelHandler}
            }],
            ['lightning:button', {
                variant: 'neutral',
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
                        title: $A.get('$Label.mcdm_15.personalizeMessagesTitle'),
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

    /**
     * Searches through the given list for the item that matches the given Campaign Member ID
     *
     * @param {Array} list The collection of objects to search through
     * @param {String} campaignMemberId The Campaign Member ID associated with the item
     * @return {Number} The index of the matching item or -1 if no match was found
     */
    getMemberIndex: function(list, campaignMemberId) {
        var campaignMemberIds = list.map(function(member) {
            return member.campaignMemberId;
        });

        return campaignMemberIds.indexOf(campaignMemberId);
    },

    /**
     * Sets the content of the "details" tab
     *
     * @param {Object} cmp The Component instance
     */
    updateRecordDetails: function(cmp) {
        var selectedMembers = cmp.get('v.selectedMembers');

        if (selectedMembers.length !== 1) {
            cmp.set('v.detailsTabBody', []);
            return;
        }

        $A.createComponent(
            'mcdm_15:RecordDetail',
            {
                recordId: selectedMembers[0].objectId,
                recordName: this.formatDisplayName(selectedMembers[0].firstName, selectedMembers[0].lastName),
                objectType: selectedMembers[0].objectType
            },
            function(newCmp, status) {
                if (newCmp.isValid() && status === 'SUCCESS') {
                    cmp.set('v.detailsTabBody', [newCmp]);
                }
            }
        );
    },

    /**
     * Updates fields with the given mappings
     *
     * @param {Object} cmp The Component instance
     * @param {Array} members Mappings of fields to update
     */
    updateMembers: function(cmp, members) {
        var helper = this,
            lists = {
                pendingMembers: cmp.get('v.pendingMembers'),
                approvedMembers: cmp.get('v.approvedMembers'),
                rejectedMembers: cmp.get('v.rejectedMembers')
            },
            updateField = function(field, source, dest) {
                if (JSON.stringify(source[field]) !== JSON.stringify(dest[field])) {
                    source[field] = dest[field];
                    source.dirty = true;
                }
            };

        Object.keys(lists).forEach(function(name) {
            var list = lists[name],
                needsUpdate = false;

            members.forEach(function(member) {
                var index = helper.getMemberIndex(list, member.campaignMemberId);

                // NB: assignment (i.e., list[index] = member) causes errors...
                if (index > -1) {
                    updateField('messages', list[index], member);
                    updateField('greeting', list[index], member);
                    updateField('customData', list[index], member);
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                cmp.set('v.' + name, list);
            }
        });
    },

    /**
     * Places each member into the appropriate collection (pending, approved or rejected)
     * based on the new status.
     *
     * @param {Object} cmp The Component instance
     * @param {Array} members An array of members
     * @param {Object} status The new status
     */
    updateMembersStatus: function(cmp, members, status) {
        var getCampaignMemberId = function(member) {
            return member.campaignMemberId;
        };

        // TODO: The logic for updating these arrays is less than optimal
        // Worse case scenario we are looking at m * (a + r) comparisons.
        var ApprovalStatus = $DM.journey.ApprovalStatus,
            approvedMembers = cmp.get('v.approvedMembers'),
            approvedIds = approvedMembers.map(getCampaignMemberId),
            rejectedMembers = cmp.get('v.rejectedMembers'),
            rejectedIds = rejectedMembers.map(getCampaignMemberId);

        members.forEach(function(member){
            var approvedMemberIndex = approvedIds.indexOf(member.campaignMemberId),
                rejectedMemberIndex = rejectedIds.indexOf(member.campaignMemberId);

            if (status === ApprovalStatus.APPROVED) {
                if (approvedMemberIndex < 0) {
                    approvedMembers.push(member);
                }

                if (rejectedMemberIndex > -1) {
                    rejectedMembers.splice(rejectedMemberIndex, 1);
                    rejectedIds.splice(rejectedMemberIndex, 1);
                }
            } else if (status === ApprovalStatus.REJECTED) {
                if (rejectedMemberIndex < 0) {
                    rejectedMembers.push(member);
                }

                if (approvedMemberIndex > -1) {
                    approvedMembers.splice(approvedMemberIndex, 1);
                    approvedIds.splice(approvedMemberIndex, 1);
                }
            } else if (status === ApprovalStatus.PENDING) {
                if (approvedMemberIndex > -1) {
                    approvedMembers.splice(approvedMemberIndex, 1);
                    approvedIds.splice(approvedMemberIndex, 1);
                }

                if (rejectedMemberIndex > -1) {
                    rejectedMembers.splice(rejectedMemberIndex, 1);
                    rejectedIds.splice(rejectedMemberIndex, 1);
                }
            }
        });

        cmp.set('v.approvedMembers', approvedMembers);
        cmp.set('v.rejectedMembers', rejectedMembers);
    },

    /**
     * Returns a collection of the rendered approval components
     *
     * @param {Object} cmp The Component instance
     * @returns {Array} A collection of mcdm_15:JourneyApprovalListItem components
     */
    getApprovalListItems: function(cmp) {
        var components = cmp.find('approvalListItem');

        if (!Array.isArray(components)) {
            components = [components];
        }

        return components;
    },

    /**
     * Sets the checked state for the "select all" field in addition to the checkbox state for
     * every rendered approval item. Possible states for "select all" are checked, unchecked and
     * indeterminate.
     *
     * @param {Object} cmp The Component instance
     * @param {Boolean} [checked] The checked state for the "select all" field; true = checked,
     * false = unchecked. If undefined, sets the checked state of the "select all" checkbox but does
     * not propagate to rendered approval items.
     */
    toggleSelectAll: function(cmp, checked) {
        var isCheckedOrDisabled = function(item) {
                var input = item.find('checkbox');
                return input.get('v.checked') || input.get('v.disabled');
            },
            approvalListItems = this.getApprovalListItems(cmp),
            theChecked = [],
            theDisabled = [],
            theRest = [],
            allChecked,
            toggle = checked === undefined;

        // sort out the different checked/disabled/other rows
        approvalListItems.forEach(function(item) {
            var input = item.find('checkbox');

            if (input.get('v.checked')) {
                theChecked.push(item);
            } else if (input.get('v.disabled')) {
                theDisabled.push(item);
            } else {
                theRest.push(item);
            }
        });

        allChecked = theChecked.length + theDisabled.length === approvalListItems.length;

        if (toggle) {
            if (!allChecked) {
                if (theChecked.length < cmp.get('v.maxApprovals')) {
                    theDisabled.forEach(function(item) {
                        item.set('v.checkboxDisabled', false);
                    });
                } else {
                    theRest.forEach(function(item) {
                        item.set('v.checkboxDisabled', true);
                    });
                }
            }
        } else {
            this.setApprovalsCheckedOrDisabled(cmp, checked && !allChecked);
        }

        // NB: re-queried as setApprovalsCheckedOrDisabled may have changed active selections
        allChecked = approvalListItems.every(isCheckedOrDisabled);

        // TODO: update with TD on lightning:input
        // var atLeastOneChecked = approvalListItems.some(isCheckedOrDisabled);
        // selectAllCheckbox.indeterminate = toggle ? atLeastOneChecked && !allChecked : false;

        cmp.set('v.selectAllChecked', allChecked);
    },

    /**
     * Sets the checked or disabled state for each rendered approval item
     *
     * @param {Object} cmp The Component instance
     * @param {Boolean} checked True = checked, false = unchecked
     */
    setApprovalsCheckedOrDisabled: function(cmp, checked) {
        var pendingMembers = cmp.get('v.pendingMembers'),
            maxApprovals = cmp.get('v.maxApprovals'),
            toggledOff = [],
            toggledOn = [];

        var setCheckedState = function(item, newState) {
            var oldState = item.get('v.checkboxChecked');
            if (oldState !== newState) {
                item.set('v.checkboxChecked', newState);
                (newState ? toggledOn : toggledOff).push(item.get('v.approvalRecord'));
            }
        };

        var enableCheckedState = function(item, i) {
            if (i < maxApprovals) {
                setCheckedState(item, true);
            } else {
                setCheckedState(item, false);
                item.set('v.checkboxDisabled', true);
            }
        };

        var disableCheckedState = function(item) {
            setCheckedState(item, false);
            item.set('v.checkboxDisabled', false);
        };

        this.getApprovalListItems(cmp).forEach(
            checked ? enableCheckedState : disableCheckedState);

        cmp.set(
            'v.selectedMembers',
            checked && pendingMembers ? pendingMembers.slice(0, maxApprovals) : []);
    },

    /**
     * Scrolls the list to the bottom and initiates a request for more data from the data provider
     *
     * @param {Object} cmp The Component instance
     */
    fetchMoreMembers: function(cmp) {
        cmp.find('approvalMembersFooter').getElement().scrollIntoView(false);
        cmp.find('dataProvider').get('e.provide').fire();
    },

    /**
     * Unbinds debounced handlers for scrolling and resizing
     *
     * @param {Object} cmp The Component instance
     */
    stopMonitoringFooterVisibility: function(cmp) {
        var targetContainer = cmp.find('approvalMembersContainer').getElement();
        targetContainer.removeEventListener('scroll', this._membersContainerChangeHandler);
        targetContainer.removeEventListener('resize', this._membersContainerChangeHandler);
    },

    /**
     * Binds debounced handlers for scrolling and resizing
     *
     * @param {Object} cmp The Component instance
     */
    monitorFooterVisibility: function(cmp) {
        var footer = cmp.find('approvalMembersFooter').getElement(),
            targetContainer = cmp.find('approvalMembersContainer').getElement();
            this._membersContainerChangeHandler = $A.getCallback(function() {
                if (this._footerVisibilityTimeoutId) {
                    clearTimeout(this._footerVisibilityTimeoutId);
                    this._footerVisibilityTimeoutId = null;
                }

                var checkForVisibility = function() {
                    var fetchMore = targetContainer.scrollHeight - targetContainer.scrollTop
                        <= targetContainer.clientHeight + footer.clientHeight * this.FOOTER_VISIBILITY_THRESHOLD;

                    if (cmp.isValid() && fetchMore) {
                        this.stopMonitoringFooterVisibility(cmp);
                        this.fetchMoreMembers(cmp);
                    }
                }.bind(this);

                this._footerVisibilityTimeoutId = setTimeout(checkForVisibility, this.FOOTER_VISIBILITY_DEBOUNCE_TIMEOUT);
            }.bind(this));

        targetContainer.addEventListener('scroll', this._membersContainerChangeHandler);
        targetContainer.addEventListener('resize', this._membersContainerChangeHandler);
    },

    /**
     * Gets the permission sets for the current user via the `PermissionSetsService` service component
     *
     * @param {Object} cmp The Component instance
     * @param {Function} callback A callback function to execute once permissions are resolved
     */
    getPermissions: function(cmp, callback) {
        cmp.find('permissionSetService').getAllPermissions(callback);
    },

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