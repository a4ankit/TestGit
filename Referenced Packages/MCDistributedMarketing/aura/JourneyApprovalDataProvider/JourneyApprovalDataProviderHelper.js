/* global $DM:false */
({
    fetchAllIds: function(cmp) {
        var getCampaignMemberIds = cmp.get('c.getCampaignMemberIds');

        getCampaignMemberIds.setParams({
            campaignId: cmp.get('v.campaignId'),
            maxResults: cmp.get('v.maxResults')
        });

        getCampaignMemberIds.setCallback(this, function(response) {
            var data = response.getReturnValue() || [];
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
            } else {
                cmp.set('v.memberIds', data);
                cmp.set('v.totalItems', data.length);
                this.fetchNextPage(cmp);
            }
        });

        $A.enqueueAction(getCampaignMemberIds);
    },

    fetchNextPage: function(cmp) {
        var memberIds = cmp.get('v.memberIds'),
            pageSize = cmp.get('v.pageSize'),
            currentPage = cmp.get('v.currentPage'),
            itemOffset = (currentPage - 1) * pageSize;

        if (itemOffset === memberIds.length) {
            this.fireDataChangeEvent(cmp, []);
        } else {
            var getPendingApprovals = cmp.get('c.getPendingApprovals'),
                end = Math.min(itemOffset + pageSize, memberIds.length);

            getPendingApprovals.setParams({
                memberIds: memberIds.slice(itemOffset, end),
                campaignId: cmp.get('v.campaignId')
            });

            getPendingApprovals.setCallback(this, function(response) {
                if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                    $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                } else {
                    var data = response.getReturnValue() || [];
                    currentPage += 1;
                    cmp.set('v.currentPage', currentPage);
                    this.fireDataChangeEvent(cmp, data);
                }
            });

            $A.enqueueAction(getPendingApprovals);
        }
    },

    /**
     * Fires the event to update the Autocomplete List
     * @param  {Object} cmp  The Component
     * @param  {Object[]} data The list of options
     */
    fireDataChangeEvent: function(cmp, data) {
        var dataChangeEvent = cmp.getEvent('onchange');
        dataChangeEvent.setParams({
            data: data
        }).fire();
    }
})