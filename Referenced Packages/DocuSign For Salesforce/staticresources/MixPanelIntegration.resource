  /*
 * MixPanel script loader (provided by MixPanel)
 */
<!-- start Mixpanel -->
(function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="//cdn.mxpnl.com/libs/mixpanel-2.2.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
<!-- end Mixpanel -->
/*
 * DocuSign helper functions
 */
/*
* Function for create MixPanelWrapper (should be called after all scripts are loaded)
*/
function esigds__createMixPanelWrapper() {
	/*
	* MixPanel wrapper class
	*/
	function MixPanelWrapper() {
		this.initialized = false;
		// all events shown be stored until initialization
		this.pendingEvents = [];
	};
	/*
	 * Initializes MixPanel variables
	 * @param salesforce1 - Boolean flag if it is salesforce1 or not
	 * @param projectToken - String project token
	 * @param userId - distinct id for the user - calculated on server
	 * @param orgId - Salesforce org id
	 * @param objectType - Salesforce object type
	 */
	MixPanelWrapper.prototype.init = function(salesforce1, projectToken, userId, orgId, objectType) {
		mixpanel.init(projectToken);
		mixpanel.identify(userId);
		mixpanel.register({"Salesforce1":salesforce1, "SF Org Id":orgId, "SF Object Type":objectType});
		for(var i = 0; i < this.pendingEvents.length; i++) {
			var eventName = this.pendingEvents[i].eventName;
			var eventProperties = this.pendingEvents[i].eventProperties;
			mixpanel.track(eventName, eventProperties);
		}
		this.pendingEvents.length = 0;
		this.initialized = true;
	};
	/*
	 * Processed an event
	 */
	MixPanelWrapper.prototype.processEvent = function(eventName, eventProperties) {
		if (this.initialized) {
			mixpanel.track(eventName, eventProperties);
		} else {
			this.pendingEvents.push({'eventName':eventName,'eventProperties':eventProperties});
		}
	};
	/*
	 * Send event about DocuSign button or action was clicked
	 */
	MixPanelWrapper.prototype.started = function(/*Boolean*/firstTimeUse) {
		this.processEvent("DFS: Started", 
			{"FirstTimeUse":firstTimeUse}
		);
	};
	/*
	 * Send event about navigating to tagger
	 */
	MixPanelWrapper.prototype.tagger = function() {
		this.processEvent("DFS: Tagger");
	};
	/*
	 * Send event about navigating to tagger
	 */
	MixPanelWrapper.prototype.envelopePage = function() {
		this.processEvent("DFS: EnvelopePage");
	};
	/*
	 * Send event about error shown
	 */
	MixPanelWrapper.prototype.error = function(/*String*/errorCode) {
		this.processEvent("DFS: Error",
			{"ErrorCode":errorCode}
		);
	};
	/*
	 * Send event about envelope process is completed
	 */
	MixPanelWrapper.prototype.completed = function() {
		this.processEvent("DFS: Completed");
	};
	return new MixPanelWrapper();
}


