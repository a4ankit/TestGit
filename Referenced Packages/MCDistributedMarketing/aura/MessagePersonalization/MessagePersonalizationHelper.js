/* global $DM:false */
({
    /**
     * Represents a field that consists of multiple values.
     *
     * @const
     * @type {Object}
     * @access private
     */
    _MULTI_VALUE_FIELD: { guid: '0c5d0302-e1bb-4354-8c45-e48b93b7383b' },

    /**
     * Max Length for p13n Field
     * @const
     * @type {Number}
     * @access private
     */
    _MAX_FIELD_LENGTH: 4000,

    /**
     * Content of a p13n field when the rich text cmp is empty.
     *
     * @const
     * @type {String}
     * @access private
     */
    _RTE_EMPTY_FIELD_CONTENT: '<p></p>',

    /**
     * The number of milliseconds to wait before triggering the p13nChanged event.
     *
     * @const
     * @type {Number}
     * @access private
     */
    _P13N_DEBOUNCE_TIMEOUT: 250,

    /**
     * Initializes the 'savedP13n' and 'currentP13n' state objects on load.
     * This function also determines and persists into the state objects
     * which fields are multi-valued.
     *
     * @param {Object} cmp The Component instance
     */
    initializeP13nStates: function(cmp) {
        var savedP13n = {},
            members = cmp.get('v.members'),
            fieldNames = this.getP13nFieldNames();

        this.getActivities(cmp).forEach(function(activity) {
            var savedMessageP13n = {},
                emailId = activity.EmailId,
                firstMemberP13n = members[0].messages[emailId] || {};

            fieldNames.forEach(function(field) {
                var firstFieldP13n = firstMemberP13n[field] || '';
                var fieldsAreTheSame = members.every(function(member) {
                    var messageP13n = member.messages[emailId] || {};
                    return (messageP13n[field] || '') === firstFieldP13n;
                });

                savedMessageP13n[field] = fieldsAreTheSame ? firstFieldP13n : this._MULTI_VALUE_FIELD;
            }.bind(this));

            savedP13n[emailId] = savedMessageP13n;
        }.bind(this));

        cmp.set('v.savedP13n', savedP13n);
        cmp.set('v.currentP13n', this.deepCopy(savedP13n));
    },

    /**
     * Returns the index of the specified activity id.
     *
     * @param {Object} cmp The Component instance
     * @param {String} id The id of the activity to return an index for
     * @returns {Integer} The index of the activity if found, null otherwise
     */
    getActivityIndex: function(cmp, id) {
        var activities = this.getActivities(cmp);
        for (var index = 0; index < activities.length; index = index + 1) {
            if (activities[index].Id === id) {
                return index;
            }
        }

        return null;
    },

    /**
     * Sets the selected activity.
     *
     * @param {Object} cmp The Component instance
     * @param {Integer} index The index of the activity
     */
    setSelectedActivity: function(cmp, index) {
        var activities = this.getActivities(cmp),
            activityCount = activities.length;

        var wrappedIndex = index < 0 ?
            activityCount - Math.abs(index) % activityCount :
            index % activityCount;

        var activity = activities.length && activities[wrappedIndex];
        if (!activity) {
            return;
        }

        cmp.set('v.activityIndex', wrappedIndex);
        cmp.find('messageAutocomplete').set('v.value', activity.Name);
        cmp.set('v.selectedActivity', activity);
        this.updateMultiValueFlags(cmp);
        this.updateUndoButtonState(cmp);
        this.updateValidityValues(cmp);
        this.updateFieldValues(cmp);
    },

    /**
     * Sets the current state of a P13n value for the selected message
     * to the value of the specified attribute.
     *
     * @param {Object} cmp The Component Instance
     * @param {String} attributeName The name of the sourced attribute
     */
    setP13nFieldFromAttribute: function(cmp, attributeName) {
        var currentP13n = cmp.get('v.currentP13n'),
            emailId = cmp.get('v.selectedActivity').EmailId,
            attrFieldMap = this.getAttributeFieldMap(),
            fieldName = attrFieldMap[attributeName],
            attrValue = cmp.get(attributeName);

        currentP13n[emailId][fieldName] = attrValue === this._RTE_EMPTY_FIELD_CONTENT ? '' : attrValue;
        cmp.set('v.currentP13n', currentP13n);

        this.updateValidityFlags(cmp, attributeName);
        this.updateMultiValueFlags(cmp);
        this.updateUndoButtonState(cmp);
        this.firePersonalizationChangedEvent(cmp);
    },

    /**
     * Updates the validity flag after change of field value
     *
     * @param {Object} cmp The Component Instance
     * @param {String} attributeName The name of the sourced attribute
     */
    updateValidityFlags: function(cmp, attributeName) {
        var emailId = cmp.get('v.selectedActivity').EmailId,
            attrFieldMap = this.getAttributeFieldMap(),
            fieldName = attrFieldMap[attributeName],
            fieldLength = cmp.get(attributeName).length,
            p13nValidationMap = cmp.get('v.p13nValidationMap');

        var fieldLengthExceeded = fieldLength > this._MAX_FIELD_LENGTH;

        cmp.set(attributeName + 'Valid', !fieldLengthExceeded);

        if (!p13nValidationMap[emailId]) {
            p13nValidationMap[emailId] = {};
        }

        p13nValidationMap[emailId][fieldName] = !fieldLengthExceeded;
        cmp.set('v.p13nValidationMap', p13nValidationMap);
    },

    /**
     * Updates flags that indicate which fields currently contain
     * multiple values. Used to display the multi-value notification.
     *
     * @param {Object} cmp The Component instance
     */
    updateMultiValueFlags: function(cmp) {
        var multiValueFlags = {},
            activity = cmp.get('v.selectedActivity'),
            messageP13n = cmp.get('v.currentP13n')[activity.EmailId];

        multiValueFlags.intro = this.fieldIsMultiValued(messageP13n.intro);
        multiValueFlags.closing = this.fieldIsMultiValued(messageP13n.closing);
        cmp.set('v.multiValueFlags', multiValueFlags);
    },

    /**
     * Sets all field values based on the selected activity.
     *
     * @param {Object} cmp The Component instance
     */
    updateFieldValues: function(cmp) {
        var activity = cmp.get('v.selectedActivity'),
            messageP13n = cmp.get('v.currentP13n')[activity.EmailId],
            attrFieldMap = this.getAttributeFieldMap();

        var getFieldDisplayValue = function(value) {
            return this.fieldIsMultiValued(value) ? '' : value;
        }.bind(this);

        cmp.set('v.ignoreFieldChanges', true);
        Object.keys(attrFieldMap).forEach(function (attribute) {
            var p13nFieldName = attrFieldMap[attribute];
            cmp.set(attribute, getFieldDisplayValue(messageP13n[p13nFieldName]));
        });

        cmp.set('v.ignoreFieldChanges', false);
    },

    /**
     * Sets values values based on the selected activity.
     *
     * @param {Object} cmp The Component instance
     */
    updateValidityValues: function(cmp) {
        var activity = cmp.get('v.selectedActivity'),
            p13nValidationMap = cmp.get('v.p13nValidationMap')[activity.EmailId] || {},
            getP13nFieldNames = this.getP13nFieldNames();

        getP13nFieldNames.forEach(function(field) {
            if ($A.util.isEmpty(p13nValidationMap[field])) {
                cmp.set('v.' + field + 'Valid', true);
            } else {
                cmp.set('v.' + field + 'Valid', p13nValidationMap[field]);
            }
        });
    },

    /**
     * Updates the enabled/disabled state of the undo button
     * for the currently selected activity.
     *
     * @param {Object} cmp The Component instance
     */
    updateUndoButtonState: function(cmp) {
        var emailId = cmp.get('v.selectedActivity').EmailId,
            currentP13n = cmp.get('v.currentP13n'),
            savedP13n = cmp.get('v.savedP13n'),
            disabled = JSON.stringify(currentP13n[emailId]) === JSON.stringify(savedP13n[emailId]);

        cmp.find('undoButton').set('v.disabled', disabled);
    },

    /**
     * Fires a JourneyApprovalsPersonalizationChanged event.
     *
     * @param {Object} cmp The Component instance
     */
    firePersonalizationChangedEvent: function(cmp) {
        var savedP13n = cmp.get('v.savedP13n'),
            currentP13n = cmp.get('v.currentP13n'),
            currentP13nActivities = Object.keys(currentP13n);

        var isDirty = currentP13nActivities.some(function(emailId) {
            return JSON.stringify(currentP13n[emailId]) !== JSON.stringify(savedP13n[emailId]);
        });

        cmp.getEvent('personalizationChanged')
            .setParams({
                isDirty: isDirty,
                areP13nsValid: this.areP13nsValid(cmp)
            })
            .fire();
    },

    /**
     * Resets the state of the component for the
     * currently selected activity.
     *
     * @param {Object} cmp The Component instance
     */
    reset: function(cmp) {
        var activity = cmp.get('v.selectedActivity'),
            currentP13n = cmp.get('v.currentP13n'),
            savedMessageP13n = cmp.get('v.savedP13n')[activity.EmailId];

        currentP13n[activity.EmailId] = this.deepCopy(savedMessageP13n);
        cmp.set('v.currentP13n', currentP13n);
        this.firePersonalizationChangedEvent(cmp);

        this.updateFieldValues(cmp);
        this.updateMultiValueFlags(cmp);
        this.updateUndoButtonState(cmp);
    },

    /**
     * Saves P13n changes for all messages into
     * the member collection
     *
     * @param {Object} cmp The Component instance
     */
    save: function(cmp) {
        var currentP13n = cmp.get('v.currentP13n'),
            members = cmp.get('v.members'),
            fieldNames = this.getP13nFieldNames();

        var applyMessageP13n = function(sourceMessageP13n, destMessageP13n) {
            fieldNames.forEach(function(field) {
                var fieldP13n = sourceMessageP13n[field];
                if (!this.fieldIsMultiValued(fieldP13n)) {
                    destMessageP13n[field] = this.deepCopy(fieldP13n);
                }
            }.bind(this));
        }.bind(this);

        this.getActivities(cmp).forEach(function(activity) {
            var emailId = activity.EmailId,
                currentMessageP13n = currentP13n[emailId];

            members.forEach(function(member) {
                var messages = member.messages,
                    memberMessageP13n = messages[emailId] || {};

                applyMessageP13n(currentMessageP13n, memberMessageP13n);
                messages[emailId] = memberMessageP13n;
            });
        });

        cmp.set('v.savedP13n', this.deepCopy(currentP13n));
        this.updateUndoButtonState(cmp);
    },

    /**
     * Returns the collection of MC Journey activities available to the component.
     *
     * @param {Object} cmp The Component instance
     * @returns {Array} A collection of activity record objects
     */
    getActivities: function(cmp) {
        return cmp.find('messageDataProvider')
            .get('v.items')
            .map(function (item) {
                return item.value;
            });
    },

    /**
     * Returns an object that maps component attributes to p13n field names.
     *
     * @returns {Object} The object map
     */
    getAttributeFieldMap: function() {
        return {
            'v.intro': $DM.journey.PersonalizationField.INTRO,
            'v.closing': $DM.journey.PersonalizationField.CLOSING
        };
    },

    /**
     * Returns a collection of personalization field names.
     *
     * @returns {Array} A collection of field names
     */
    getP13nFieldNames: function() {
        var attrFieldMap = this.getAttributeFieldMap();
        return Object.keys(attrFieldMap).map(function(key) {
            return attrFieldMap[key];
        });
    },

    /**
     * Returns whether a field is a multi valued.
     *
     * @param {Object} field The field to investigate
     * @returns {Boolean}
     */
    fieldIsMultiValued: function(field) {
        return JSON.stringify(field) === JSON.stringify(this._MULTI_VALUE_FIELD);
    },

    /**
     * Deep copies an object and returns the result.
     *
     * @param {Object} source The object to copy
     * @returns {Object} The new copy
     */
    deepCopy: function(source) {
        return JSON.parse(JSON.stringify(source));
    },

    /**
     * Adds a debounce buffer to changes in intro and closing
     * attribute change events for added preformance
     *
     * @param {Object} cmp The Component instance
     * @param {Function} action The debounced callback
     */
    debounceAction: function(cmp, action) {
        var p13nChangeTimeoutId = cmp.get('v.p13nChangeTimeoutId');

        if (p13nChangeTimeoutId) {
            clearTimeout(p13nChangeTimeoutId);
        }

        cmp.set('v.p13nChangeTimeoutId', setTimeout($A.getCallback(action), this._P13N_DEBOUNCE_TIMEOUT));
    },

    /**
     * Goes through p13nValidationMap and determines if
     * fields are valid
     *
     * @param {Object} cmp The Component instance
     * @return {Boolean}
     */
    areP13nsValid: function(cmp) {
        var p13nValidationMap = cmp.get('v.p13nValidationMap');

        return !Object.keys(p13nValidationMap).some(function(emailId) {
            return Object.keys(p13nValidationMap[emailId]).some(function(blockId) {
                return !p13nValidationMap[emailId][blockId];
            });
        });
    }
})