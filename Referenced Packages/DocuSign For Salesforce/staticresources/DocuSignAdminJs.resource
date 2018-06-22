// release dollar sign for other libraries possible 
jQuery.noConflict();
// all docusign front end logic starts from document.loaded event
jQuery(document).ready(function ($) {
  /*--Check if user has lightning enabled and change tab href values--*/
  if (dsGlobal.isLightningEnabled) {
    document.getElementById('homeTab').href = dsGlobal.baseVFPUrl + '?t=h';
    document.getElementById('settingsTab').href = dsGlobal.baseVFPUrl + '?t=s';
    document.getElementById('accountTab').href = dsGlobal.baseVFPUrl + '?t=a';
    document.getElementById('layoutsTab').href = dsGlobal.baseVFPUrl + '?t=l';
    document.getElementById('customTagsTab').href = dsGlobal.baseVFPUrl + '?t=c';
    document.getElementById('usersTab').href = dsGlobal.baseVFPUrl + '?t=u';
  }
  /*------------------------------ Init ------------------------------*/
  var pixels = {
    'default': 19,
    'size7': 15,
    'size8': 17,
    'size9': 19,
    'size10': 21,
    'size11': 23,
    'size12': 25,
    'size14': 29,
    'size16': 33,
    'size18': 38,
    'size20': 42,
    'size22': 46,
    'size24': 50,
    'size26': 54,
    'size28': 58,
    'size36': 75,
    'size48': 100,
    'size72': 150
  };

  loadAdminTab();

  /*------------------------- Helper functions -----------------------*/

  function loadAdminTab() {
    hideAll();
    showMessages(dsGlobal.responseJson.messages);


    if (dsGlobal.responseJson.action === 'ShowDemo') {
      window.location.href = 'docusignsetupdemo?demo=1';
    } else if (dsGlobal.responseJson.action === 'ShowLogin') {
      $('#accountTabContent').show();
      $('#login-or-create-trial').show();
      if (dsGlobal.responseJson.admin.account.docusignAccounts.length > 1) {
        $.each(dsGlobal.responseJson.admin.account.docusignAccounts, function (key, value) {
          $('#selectedAccountId').append($('<option></option>').attr('value', value).text(value));
        });
        $('#accountDropdownField').show();
      }
      if ($('#docusignEnvironment').val() === 'other') {
        $('#otherEnvironmentField').show();
      }
    } else if (dsGlobal.responseJson.action === 'ShowConnect') {
      $('#accountTabContent').show();
      $('#login-to-connect').show();
      if (dsGlobal.isMetadataApiSupported === false) {
        $('#trusted-network-salesforce').show();
      }
    } else if (dsGlobal.responseJson.action === 'ShowTrialForm') {
      $('#accountTabContent').show();
      $('#trial-step-two').show();
    } else if (dsGlobal.responseJson.action === 'ShowHome') {
      if (dsGlobal.responseJson.admin.adminUser !== true) {
				$('#settingsTabListItem').hide();
				$('#accountTabListItem').hide();
				$('#layoutsTabListItem').hide();
				$('#customTagsTabListItem').hide();
				$('#usersTabListItem').hide();
      }
      if (dsGlobal.responseJson.admin.isExpiredAccount === true && dsGlobal.responseJson.admin.adminUser === true) {
        $('#settingsTabListItem').hide();
        $('#accountTabListItem').hide();
        $('#customTagsTabListItem').hide();
        $('#usersTabListItem').hide();
      }
      hideCustomTagsIfDisabled();
      $('#homeTab').addClass('active');
      $('#navigation').show();
      $('#homeTabContent').show();
    } else if (dsGlobal.responseJson.action === 'ShowUsers') {
      $('#usersTab').addClass('active');
      $('#navigation').show();
      $('#usersTabContent').show();
      hideCustomTagsIfDisabled();
    } else if (dsGlobal.responseJson.action === 'ShowSettings') {
      $('#settingsTab').addClass('active');
      $('#navigation').show();
      populateSettings();
      hideCustomTagsIfDisabled();
      $('#settingsTabContent').show();
    } else if (dsGlobal.responseJson.action === 'ShowAccount') {
      $('#accountTab').addClass('active');
      $('#navigation').show();
      $('#accountTabContent').show();
      $('#account-installed-content').show();
      hideCustomTagsIfDisabled();
    } else if (dsGlobal.responseJson.action === 'ShowCustomTags') {
      if (dsGlobal.responseJson.admin.accountSettings.tabTextFormattingEnabled === false) {
        $('#newCustomTagFormat').remove();
      }
      if (dsGlobal.responseJson.admin.accountSettings.savingCustomTabsEnabled) {
        $('#customTagsTab').addClass('active');
        $('#navigation').show();
        if (dsGlobal.responseJson.admin.accountSettings.allowMergeFields) {
          $('#relatedToSalesforce, .relateFieldToSalesforce').show();
        } else {
          $('#relatedToSalesforce, .relateFieldToSalesforce').hide();
        }
        if (dsGlobal.responseJson.admin.accountSettings.tabDataLabelEnabled) {
          $('#newCustomTag').show();
        } else {
          $('#newCustomTag').hide();
        }
        $('#customTagTabContent').show();
      }
      if (dsGlobal.responseJson.admin.tabPalette !== null) {
        $('#tagTypeDropdown').find('option').remove().end();
        for (var i = 0; i < dsGlobal.responseJson.admin.tabPalette.length; i++) {
          var tab = dsGlobal.responseJson.admin.tabPalette[i];
          $('#tagTypeDropdown').append($('<option></option>').attr('value', tab.type).text(tab.typeName));
        }
      }
    } else if (dsGlobal.responseJson.action === 'ShowLayouts') {
      $('#layoutsTab').addClass('active');
      $('#navigation').show();
      $('#layoutsTabContent').show();
      hideCustomTagsIfDisabled();
      if (dsGlobal.responseJson.admin.metadataRemoteSiteNeeded) {
        addRemoteSites('layouts', false, function (success) {
          if (success) {
            window.location = '?t=l';
          } else {
            hideAll();
            $('#layoutsTab').addClass('active');
            $('#navigation').show();
            $('#layoutsTabContent').show();
            $('#add-buttons-to-layouts').show();
          }
        });
      } else {
        for (var i = 0; i < dsGlobal.responseJson.admin.layouts.length; i++) {
          $('#desktopCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', dsGlobal.responseJson.admin.layouts[i].desktopSelected === true);
          $('#mobileCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', dsGlobal.responseJson.admin.layouts[i].mobileSelected === true);
          $('#statusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', dsGlobal.responseJson.admin.layouts[i].statusListSelected === true);
          $('#recipientStatusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', dsGlobal.responseJson.admin.layouts[i].recipientStatusListSelected === true);

          if (dsGlobal.responseJson.admin.layouts[i].showVerifyWithDnB) {
            $('#verifyWithDnb').prop('checked', true);
          }
        }
        $('#layoutsDropdownContent').show();
        $('#layoutsDnbContent').show();
        $('#layoutsChecklistContent').show();
        $('#layoutsButtons').show();
      }
      if (dsGlobal.responseJson.admin.isExpiredAccount === true && dsGlobal.responseJson.admin.adminUser === true) {
        $('#settingsTabListItem').hide();
        $('#accountTabListItem').hide();
        $('#customTagsTabListItem').hide();
        $('#usersTabListItem').hide();
      }
    }
    if (!Modernizr.svg) {
      console.log('SVG is NOT supported.');
      // Browser doesnt support SVG (eg. IE 8).  Replace all SVG with PNG.
      $('.logo').attr('src', dsGlobal.docusignPNG);
      $('#searchButton').css('background-image', 'url(' + dsGlobal.searchIconPNG + ')');
      $('.docusignlogo').attr('src', dsGlobal.DocuSignLoadingLogoPNG);
      $('#languageSettingsCloseIcon').attr('src', dsGlobal.deleteIconPNG);
    }
  }

  function createRemoteSites(done) {
    // Calls the Metdata API from JavaScript to create the Remote Site Setting to permit Apex callouts
    var request =
      '<?xml version="1.0" encoding="utf-8"?>' +
      '<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      '<env:Header>' +
      '<urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">' +
      '<urn:sessionId>' + dsGlobal.sessionId + '</urn:sessionId>' +
      '</urn:SessionHeader>' +
      '</env:Header>' +
      '<env:Body>' +
      '<upsertMetadata xmlns="http://soap.sforce.com/2006/04/metadata">' +
      '<metadata xsi:type="RemoteSiteSetting">' +
      '<fullName>DocuSignDlrsMdapi</fullName>' +
      '<description>Metadata API Remote Site Setting for Declarative Rollup Tool (DLRS). Created by DocuSign for Salesforce package.</description>' +
      '<disableProtocolSecurity>false</disableProtocolSecurity>' +
      '<isActive>true</isActive>' +
      '<url>https://' + dsGlobal.responseJson.admin.host + '</url>' +
      '</metadata>' +
      '<metadata xsi:type="RemoteSiteSetting">' +
      '<fullName>DocuSignSFDCSoapApi</fullName>' +
      '<description>SOAP API Remote Site Setting for DocuSign package. Created by DocuSign for Salesforce package.</description>' +
      '<disableProtocolSecurity>false</disableProtocolSecurity>' +
      '<isActive>true</isActive>' +
      '<url>' + dsGlobal.responseJson.admin.hostAlt + '</url>' +
      '</metadata>' +
      '</upsertMetadata>' +
      '</env:Body>' +
      '</env:Envelope>';
    $.ajax({
      type: 'POST',
      url: 'https://' + dsGlobal.responseJson.admin.host + '/services/Soap/m/31.0',
      processData: false,
      contentType: 'text/xml',
      headers: {
        SOAPAction: '\'\''
      },
      dataType: 'xml',
      data: request,
      success: function (anything, status, xhr) {
        done(true, status);
      },
      error: function (xhr, status, error) {
        done(false, status, error);
      }
    });
  }

  function addRemoteSites(context /* string */, showCancel /* boolean */, done /* f(sitesAdded: boolean): void */) {
    var modal = $('#addRemoteSiteModal');
    var cancelBtn = $('#cancelAddRemoteSiteButton');
    var ctx = $('#addRemoteSiteContext');
    ctx.text(ctx.attr('label-' + context));
    $('#addRemoteSiteButton').click(function () {
      showLoading();
      createRemoteSites(function (success, status, error) {
        if (success) {
          modal.hide();
          done(true);
        } else {
          console.log('Failed to add remote sites. Status = ' + status + ', error = ' + error);
          showMessages([{
            severity: 'Error',
            code: 'MetadataApiError',
            description: dsGlobal.noSupportMetadataAPIText
          }]);
          modal.hide();
          done(false);
        }
      });
    });
    if (showCancel) {
      cancelBtn.click(function (event) {
        modal.hide();
        done(false);
      });
      cancelBtn.show();
    } else {
      cancelBtn.hide();
    }
    modal.show();
  }

  function hideAll() {
    $('#addRemoteSiteModal').hide();
    $('#navigation').hide();
    $('#homeTab').removeClass('active');
    $('#usersTab').removeClass('active');
    $('#settingsTab').removeClass('active');
    $('#accountTab').removeClass('active');
    $('#layoutsTab').removeClass('active');
    $('#customTagsTab').removeClass('active');
    $('#homeTabContent').hide();
    $('#customTagTabContent').hide();
    $('#newCustomTagCreationContent').hide();
    $('#settingsTabContent').hide();
    $('#accountTabContent').hide();
    $('#accountDropdownField').hide();
    $('#otherEnvironmentField').hide();
    $('#login-or-create-trial').hide();
    $('#login-to-connect').hide();
    $('#trial-step-two').hide();
    $('#account-installed-content').hide();
    $('#layoutsTabContent').hide();
    $('#layoutsMetadataContent').hide();
    $('#layoutsMetadataButtons').hide();
    $('#layoutsDropdownContent').hide();
    $('#layoutsDnbContent').hide();
    $('#layoutsChecklistContent').hide();
    $('#layoutsButtons').hide();
    $('#usersTabContent').hide();
    $('#trusted-network-salesforce').hide();
    $('#add-buttons-to-layouts').hide();
    hideLoading();
  }

  function hideCustomTagsIfDisabled() {
    if (!dsGlobal.responseJson.admin.accountSettings.savingCustomTabsEnabled) {
      $('#customTagsTabListItem').hide();
    }
  }

  $('#searchInput').keyup(function (event) {
    if (event.keyCode === 13) {
      search();
    }
  });

  $('.ip-range-button').click(function (event) {
    $(this).addClass('active');
  });

  $('#searchButton').click(function () {
    search();
  });

  function search() {
    if ($('#searchInput').val()) {
      //window.open('https://www.docusign.com/results#type=default&startIndex=0&qu=' + escape($("#searchInput").val()));
      window.open('https://www.docusign.com/results?qu=' + escape($('#searchInput').val()));

    }
  }

  $('#loginButton').click(function () {
    showLoading();
    dsGlobal.responseJson.admin.account.docusignEmail = $('#docusignLoginEmail').val();
    dsGlobal.responseJson.admin.account.docusignPassword = $('#docusignPassword').val();
    dsGlobal.responseJson.admin.account.docusignEnvironment = $('#docusignEnvironment').val();
    dsGlobal.responseJson.admin.account.otherDocusignEnvironment = $('#otherDocusignEnvironment').val();
    dsGlobal.responseJson.admin.account.selectedAccountId = $('#selectedAccountId').val();
    try {
      Visualforce.remoting.Manager.invokeAction(
        dsGlobal.login, dsGlobal.responseJson.admin.account,
        function (result, event) {
          remoteActionHandler(result, event);
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

  $('.forgot-password').click(function () {
    var env = 'www';
    if ($('#docusignEnvironment').val() === 'production') {
      var dataCenter = window.location.host.toString().split('.')[1];
      if (dataCenter.startsWith('eu')) {
        env = 'eu';
      } else {
        env = 'www';
      }
    } else if ($('#docusignEnvironment').val() === 'demo') {
      env = 'demo';
    } else if ($('#otherDocusignEnvironment').val() === 'stage') {
      env = 'wwwstage';
    } else if ($('#otherDocusignEnvironment').val() === 'test') {
      env = 'test';
    } else if ($('#otherDocusignEnvironment').val() === 'test1') {
      env = 'test1';
    } else if ($('#otherDocusignEnvironment').val() === 'test2') {
      env = 'test2';
    }
    $('.forgot-password').attr('href', 'https://' + env + '.docusign.net/Member/MemberForgotPassword.aspx');
  });

  $('#createAccountButton').click(function () {
    if ($('#trialAgreeCheckbox').is(':checked') && $('#docusignTrialEmail').val().indexOf('@') > 0 &&
      $('#docusignTrialEmail').val().lastIndexOf('.') > 2) {
      showLoading();
      try {
        Visualforce.remoting.Manager.invokeAction(
          dsGlobal.prepareTrialAccount, $('#docusignTrialEmail').val(),
          function (result, event) {
            remoteActionHandler(result, event);
            if (result.admin.trial) {
              $('#fullName').val(result.admin.trial.fullName);
              $('#phoneNumber').val(result.admin.trial.phoneNumber);
              $('#companyName').val(result.admin.trial.companyName);
              $('#country').val(result.admin.trial.country);
              $('#streetAddress').val(result.admin.trial.streetAddress);
              $('#city').val(result.admin.trial.city);
              $('#stateProvince').val(result.admin.trial.stateProvince);
              $('#postalCode').val(result.admin.trial.postalCode);
              $.each(result.admin.trial.countries, function (key, value) {
                if (result.admin.trial.country === value) {
                  $('#country').append($('<option selected></option>').attr('value', value).text(value));
                } else {
                  $('#country').append($('<option></option>').attr('value', value).text(value));
                }
              });
              toggleStateFields();
              $.each(result.admin.trial.states, function (key, value) {
                if (result.admin.trial.stateProvince === value) {
                  $('#usState').append($('<option selected></option>').attr('value', value).text(value));
                } else {
                  $('#usState').append($('<option></option>').attr('value', value).text(value));
                }
              });
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  });

  $('#country').change(function () {
    toggleStateFields();
  });

  function toggleStateFields() {
    if ($('#country').val() === 'United States') {
      $('#stateProvince').hide();
      $('#usState').show();
    } else {
      $('#usState').hide();
      $('#stateProvince').show();
    }
  }

  $('#trialFormNextButton').click(function () {
    showLoading();
    try {
      var state = $('#stateProvince').val();
      if ($('#country').val() === 'United States') {
        state = $('#usState').val();
      }
      Visualforce.remoting.Manager.invokeAction(
        dsGlobal.createTrialAccount, {
          docusignTrialEmail: $('#docusignTrialEmail').val(),
          fullName: $('#fullName').val(),
          phoneNumber: $('#phoneNumber').val(),
          companyName: $('#companyName').val(),
          country: $('#country').val(),
          streetAddress: $('#streetAddress').val(),
          city: $('#city').val(),
          stateProvince: state,
          postalCode: $('#postalCode').val()
        },
        function (result, event) {
          remoteActionHandler(result, event);
          $('#docusignLoginEmail').val(result.admin.account.docusignEmail);
          $('#docusignPassword').focus();
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

  $('#connectButton').click(function () {
    if ($('#connectAgreeCheckbox').is(':checked')) {
      showLoading();
      createRemoteSites(function (success) {
        dsGlobal.responseJson.admin.account.salesforceUsername = $('#salesforceUsername').val();
        dsGlobal.responseJson.admin.account.salesforcePassword = $('#salesforcePassword').val();
        dsGlobal.responseJson.admin.account.salesforceEnvironment = $('#salesforceEnvironment').val();
        dsGlobal.responseJson.admin.account.useMetadataApi = dsGlobal.isMetadataApiSupported;
        try {
          Visualforce.remoting.Manager.invokeAction(
            dsGlobal.connect, dsGlobal.responseJson.admin.account,
            function (result, event) {
              remoteActionHandler(result, event);
            }
          );
        } catch (err) {
          console.log(err);
        }
      });
    }
  });

  $('#updateLayoutsButton').click(function () {
    showLoading();
    for (var i = 0; i < dsGlobal.responseJson.admin.layouts.length; i++) {
      dsGlobal.responseJson.admin.layouts[i].desktopSelected = $('#desktopCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked');
      dsGlobal.responseJson.admin.layouts[i].showVerifyWithDnB = $('#verifyWithDnb').prop('checked');
      if (dsGlobal.responseJson.admin.layouts[i].showMobileCheckbox === true) {
        dsGlobal.responseJson.admin.layouts[i].mobileSelected = $('#mobileCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked');
      }
      dsGlobal.responseJson.admin.layouts[i].statusListSelected = $('#statusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked');
      if (dsGlobal.responseJson.admin.layouts[i].showRecipientStatusCheckbox === true) {
        dsGlobal.responseJson.admin.layouts[i].recipientStatusListSelected = $('#recipientStatusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked');
      }
    }
    try {
      Visualforce.remoting.Manager.invokeAction(
        dsGlobal.updateLayouts, dsGlobal.responseJson.admin.layouts,
        function (result, event) {
          remoteActionHandler(result, event);
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

  $('#modifyAccountConfigButton').click(function () {
    dsGlobal.responseJson.action = 'ShowLogin';
    loadAdminTab();
  });

  $('#trialFormBackButton, #cancelButton').click(function () {
    dsGlobal.responseJson.messages = [];
    dsGlobal.responseJson.action = 'ShowLogin';
    loadAdminTab();
  });

  $('#docusignTab').click(function () {
    if ($('#docusignTab').attr('href')) {
      try {
        showLoading();
        Visualforce.remoting.Manager.invokeAction(
          dsGlobal.findDocuSignUrl,
          function (result, event) {
            dsGlobal.responseJson.messages = result.messages;
            if (result.url) {
              var newWin = window.open(unescapeHtmlSpecialCharacters(result.url));
              if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
                dsGlobal.responseJson.messages[0] = {
                  code: 'UnknownError',
                  description: dsGlobal.windowBlockedByBrowserText,
                  severity: 'Error'
                };
              }
            }
            showMessages(dsGlobal.responseJson.messages);
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
        hideLoading();
      }
    }
  });

  /*
   * This function un-escapes all html special characters.
   * @param str the string to be modified
   */

  function unescapeHtmlSpecialCharacters(str) {
    if (!str) {
      return '';
    }
    return str.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  function showLoading() {
    $('.fullscreenload').show();
    $('#cancelLayoutsButton').removeAttr('href');
    $('#updateLayoutsButton').removeAttr('href');
    $('#loginButton').removeAttr('href');
    $('#connectButton').removeAttr('href');
    $('#createAccountButton').removeAttr('href');
  }

  function hideLoading() {
    $('.fullscreenload').hide();
    $('#cancelLayoutsButton').attr('href', '?t=h');
    $('#updateLayoutsButton').attr('href', 'javascript:void(0);');
    $('#loginButton').attr('href', '#');
    $('#connectButton').attr('href', '#');
    $('#createAccountButton').attr('href', '#');
  }

  $('#connectAgreeCheckbox').click(function () {
    if ($('#connectAgreeCheckbox').is(':checked')) {
      $('#connectButton').removeClass('inactive');
    } else {
      $('#connectButton').addClass('inactive');
    }
  });

  $('#docusignTrialEmail').keyup(function () {
    toggleCreateAccountButton();
  });

  $('#fullName, #companyName').keyup(function () {
    $('#dsAlert').hide();
  });

  $('#trialAgreeCheckbox').click(function () {
    toggleCreateAccountButton();
  });

  function toggleCreateAccountButton() {
    if ($('#trialAgreeCheckbox').is(':checked') && $('#docusignTrialEmail').val().indexOf('@') > 0 && $('#docusignTrialEmail').val().lastIndexOf('.') > 2) {
      $('#createAccountButtonDiv').removeClass('inactive');
    } else {
      $('#createAccountButtonDiv').addClass('inactive');
    }
  }

  $('#desktopHeader').click(function () {
    selectAllDesktop();
  });

  $('#mobileHeader').click(function () {
    selectAllMobile();
  });

  $('#statusListHeader').click(function () {
    selectAllStatusList();
  });

  $('#recipientStatusListHeader').click(function () {
    selectAllRecipientStatusList();
  });

  $('#layoutDropdown').change(function () {
    clearAll();
    if ($('#layoutDropdown').val() === 'All') {
      selectAllDesktop();
      selectAllMobile();
      selectAllStatusList();
      selectAllRecipientStatusList();
    } else if ($('#layoutDropdown').val() === 'Desktop') {
      selectAllDesktop();
    } else if ($('#layoutDropdown').val() === 'Mobile') {
      selectAllMobile();
    }
  });

  $('#docusignEnvironment').change(function () {
    if ($('#docusignEnvironment').val() === 'other') {
      $('#otherEnvironmentField').show();
    } else {
      $('#otherEnvironmentField').hide();
    }
  });

  function selectAllDesktop() {
    var checked = !$('#desktopCheckbox' + dsGlobal.responseJson.admin.layouts[0].uniqueId).prop('checked');
    for (var i = 0; i < dsGlobal.responseJson.admin.layouts.length; i++) {
      $('#desktopCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', checked);
    }
  }

  function selectAllMobile() {
    var checked = !$('#mobileCheckbox' + dsGlobal.responseJson.admin.layouts[0].uniqueId).prop('checked');
    for (var i = 0; i < dsGlobal.responseJson.admin.layouts.length; i++) {
      if (dsGlobal.responseJson.admin.layouts[i].showMobileCheckbox === true) {
        $('#mobileCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', checked);
      }
    }
  }

  function selectAllStatusList() {
    var checked = !$('#statusCheckbox' + dsGlobal.responseJson.admin.layouts[0].uniqueId).prop('checked');
    for (var i = 0; i < dsGlobal.responseJson.admin.layouts.length; i++) {
      $('#statusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', checked);
    }
  }

  function selectAllRecipientStatusList() {
    var checked = !$('#recipientStatusCheckbox' + dsGlobal.responseJson.admin.layouts[0].uniqueId).prop('checked');
    for (var i = 0; i < dsGlobal.responseJson.admin.layouts.length; i++) {
      if (dsGlobal.responseJson.admin.layouts[i].showRecipientStatusCheckbox === true) {
        $('#recipientStatusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', checked);
      }
    }
  }

  function clearAll() {
    for (var i = 0; i < dsGlobal.responseJson.admin.layouts.length; i++) {
      $('#desktopCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', false);
      $('#mobileCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', false);
      $('#statusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', false);
      $('#recipientStatusCheckbox' + dsGlobal.responseJson.admin.layouts[i].uniqueId).prop('checked', false);
    }
  }

  /**
   * This function handles the result from Salesforce Remote Action call.
   * @param result the result of the Salesforce Remote Action call
   * @param event the event of the Salesforce Remote Action call
   */

  function remoteActionHandler(result, event) {
    if (event.status && result) {
      if ((result.isMetadataApiSupported === true) || (result.isMetadataApiSupported === false)) {
        dsGlobal.isMetadataApiSupported = result.isMetadataApiSupported;
      }
      if (result.action) {
        dsGlobal.responseJson.action = result.action;
      }
      if (result.messages) {
        dsGlobal.responseJson.messages = result.messages;
      }
      if (result.admin) {
        if (result.admin.adminUser === true) {
          dsGlobal.responseJson.admin.adminUser = true;
        }
        if (result.admin.account && result.admin.account.docusignAccounts) {
          dsGlobal.responseJson.admin.account.docusignAccounts = result.admin.account.docusignAccounts;
        }
      }
      if (result.admin !== null && result.admin !== undefined &&
        result.admin.accountSettings !== null && result.admin.accountSettings !== undefined) {
        if (dsGlobal.responseJson.admin.accountSettings === null || dsGlobal.responseJson.admin.accountSettings === undefined) {
          dsGlobal.responseJson.admin.accountSettings = {};
        }
        for (var option in result.admin.accountSettings) {
          if (result.admin.accountSettings.hasOwnProperty(option)) {
            var globalSetting = dsGlobal.responseJson.admin.accountSettings[option];
            var resultSetting = result.admin.accountSettings[option];
            var hasGlobal = (globalSetting !== null) && (globalSetting !== undefined);
            var hasResult = (resultSetting !== null) && (resultSetting !== undefined);
            if (!hasGlobal && hasResult) {
              dsGlobal.responseJson.admin.accountSettings[option] = resultSetting;
            }
          }
        }
      }
    }
    loadAdminTab();
  }

  function showMessage(errorCode, errorDescription) {
    errorDescription = errorDescription.replace('layoutsLink', '<a href="?t=l">' + dsGlobal.layoutsText + '</a>');
    errorDescription = errorDescription.replace('usersLink', '<a href="?t=u">' + dsGlobal.usersText + '</a>');
    errorDescription = errorDescription.replace('userSettingsLink', '<a target="_blank" href="/setup/personalInformationSetup.apexp">' + dsGlobal.clickHereText + '</a>');
    $('#dsAlert ul').append('<li><p>' + errorDescription + '</p></li>');
    $('#dsAlert').show();
  }

  function showMessages(messages) {
    $('#dsAlert').hide();
    $('#dsAlert ul').empty();
    $('.alert-messages').removeClass('info');
    $('.alert-messages').removeClass('successful');
    for (var m = 0; m < messages.length; m++) {
      $('#dsAlert').show();
      if (messages[m].severity === 'Success') {
        $('.alert-messages').addClass('successful');
      } else if (messages[m].severity === 'Info') {
        $('.alert-messages').addClass('info');
      }
      showMessage(messages[m].code, messages[m].description);
    }
    if (messages.length > 0) {
      $('html, body').animate({
        scrollTop: 0
      }, 'fast');
    }
  }

  // Populate the envelope settings

  function populateSettings() {
    var settings = dsGlobal.responseJson.admin.settings;
    // Email Settings
    populateCheckbox('disableUserEmailSubjectCheckBox', settings.disableEmailSubjectEditing);
    populateCheckbox('disableUserEmailMessageCheckBox', settings.disableEmailMessageEditing);
    populateEmailSettings(settings.docuSignLocalizationSettings);
    populateEmailChatterSettings(settings.chatterTextDto);
    //Apex timeout settings
    $('#apexTimeOutInput').val(populateRemindExpireSettings(settings.apexTimeOuts / 1000));
    // Rcipient Role Settings
    $('#recipientRoleSettingsTextarea').val(settings.recipientRoleNames);

    // Send Settings
    populateCheckbox('hideSendNowButton', settings.hideSendNowButton);
    populateCheckbox('hideNextButton', settings.hideNextButton);
    populateCheckbox('enableSFCalloutLimit', settings.enableSFCalloutLimit);
    populateCheckbox('enableMobileTaggingUI', settings.enableMobileAppForSF1);
    populateCheckbox('displayTaggerPageInNewWindow', settings.displayTaggerPageInNewWindow);
    populateCheckbox('displayInPersonSigningPageInNewWindow', settings.displayInPersonSigningPageInNewWindow);
    populateCheckbox('reminderSettingsCheckbox', settings.enableRemindAndExpirationSettings);
    populateCheckbox('loadFiles', settings.loadFiles);
    populateCheckbox('lightningComponentLogging', settings.lightningComponentLogging);
    if (settings.enableRemindAndExpirationSettings === true) {
      $('#reminderSettings').show();
      $('#remindSignersTextInput').val(populateRemindExpireSettings(settings.reminderDays));
      $('#continueToSendRemindersTextInput').val(populateRemindExpireSettings(settings.reminderRepeat));
      $('#expireRequestInTextInput').val(populateRemindExpireSettings(settings.expireDays));
      $('#warnSignersTextInput').val(populateRemindExpireSettings(settings.expireWarning));
    } else {
      $('#reminderSettings').hide();
    }
    populateCheckbox('hideRemindAndExpireSettings', settings.hideRemindAndExpirationSettings);
    // Chatter Settings
    $('#dsChatterDropdown').val(settings.chatterSettingCode);
    if (settings.chatterSettingCode === 'Disabled') {
      $('#chatter-settings').hide();
      $('#dsChatterLanguageDropdown').hide();
    } else {
      $('#chatter-settings').show();
      $('#dsChatterLanguageDropdown').show();
    }
    populateChatterEventSettings(settings, dsGlobal.chatterLanguageCodeText);
  }

  // Populate the email settings

  function populateEmailSettings(localizationSettings) {
    if (!localizationSettings)
      return;
    $('.email-settings .email-setting').remove();
    for (var i = 0; i < localizationSettings.length; i++) {
      addEmailSetting(localizationSettings[i]);
    }
    checkLocalizationSettingsList();
  }

  // Populate the email chatter settings

  function populateEmailChatterSettings(localizationSettings) {
    if (!localizationSettings)
      return;
    var html = '';
    html += '<select class="small" id="dsChatterLanguageDropdownSelect">';
    for (var i = 0; i < localizationSettings.length; i++) {
      var languageCode = localizationSettings[i].LanguageCode;
      var language = '';
      if (dsGlobal.chatterLanguageCodeText === languageCode) {
        language = localizationSettings[i].Language;
      } else {
        language = formatLanguage(localizationSettings[i].Language);
      }
      html += '<option value="' + languageCode + '">' + language + '</option>';
    }
    html += '</select>';
    $('#dsChatterLanguageDropdown').html(html);
  }

  // Helper function for populating checkbox value

  function populateCheckbox(id, enabled) {
    if (enabled === true) {
      $('#' + id).prop('checked', true);
    } else {
      $('#' + id).prop('checked', false);
    }
  }

  // Helper function for populating chatter event setting

  function populateChatterEventSettings(settings, selectedLanguageCode) {
    var chatterSettings = settings.chatterTextDto;
    for (var i = 0; i < chatterSettings.length; i++) {
      var chatterText = chatterSettings[i];
      if (chatterText.LanguageCode === selectedLanguageCode) {
        // checkbox
        $('#chatterEnvelopeSentCheckbox').prop('checked', settings.envelopeSentChatterEnabled);
        $('#chatterEnvelopeDeliveredCheckbox').prop('checked', settings.envelopeDeliveredChatterEnabled);
        $('#chatterEnvelopeCompletedCheckbox').prop('checked', settings.envelopeCompletedChatterEnabled);
        $('#chatterEnvelopeDeclinedCheckbox').prop('checked', settings.envelopeDeclinedChatterEnabled);
        $('#chatterEnvelopeVoidedCheckbox').prop('checked', settings.envelopeVoidedChatterEnabled);
        $('#chatterRecipientSentCheckbox').prop('checked', settings.recipientSentChatterEnabled);
        $('#chatterRecipientDeliveredCheckbox').prop('checked', settings.recipientDeliveredChatterEnabled);
        $('#chatterRecipientCompletedCheckbox').prop('checked', settings.chatterRecipientCompleted);
        $('#chatterRecipientSignedCheckbox').prop('checked', settings.recipientSignedChatterEnabled);
        $('#chatterRecipientDeclinedCheckbox').prop('checked', settings.recipientDeclinedChatterEnabled);
        $('#chatterActionsUndoAndSend').prop('checked', settings.actionsUndoAndSendChatterEnabled);
        $('#chatterActionsEnvelopeSigning').prop('checked', settings.actionsEnvelopeSigningChatterEnabled);
        // text
        var languageInfo = chatterText.text;
        $('#chatterEnvelopeSentText').val(languageInfo.envelopeSentChatterText);
        $('#chatterEnvelopeDeliveredText').val(languageInfo.envelopeDeliveredChatterText);
        $('#chatterEnvelopeCompletedText').val(languageInfo.envelopeCompletedChatterText);
        $('#chatterEnvelopeDeclinedText').val(languageInfo.envelopeDeclinedChatterText);
        $('#chatterEnvelopeVoidedText').val(languageInfo.envelopeVoidedChatterText);
        $('#chatterRecipientSentText').val(languageInfo.recipientSentChatterText);
        $('#chatterRecipientDeliveredText').val(languageInfo.recipientDeliveredChatterText);
        $('#chatterRecipientCompletedText').val(languageInfo.recipientCompletedChatterText);
        $('#chatterRecipientSignedText').val(languageInfo.recipientSignedChatterText);
        $('#chatterRecipientDeclinedText').val(languageInfo.recipientDeclinedChatterText);
      }
    }
  }

  // Helper function for populating remind and expire settings

  function populateRemindExpireSettings(day) {
    if (typeof(day) === 'undefined' || day === null || day === '-1') {
      return '';
    }
    return day;
  }

  // Helper function for formatting language label

  function formatLanguage(language) {
    var result = '';
    var arr = language.split(' ');
    result = (arr.length > 1) ? arr[0] : language;
    result = result.charAt(0).toUpperCase() + result.toLowerCase().slice(1);
    return result;
  }


  // Helper function add email settings to UI

  function addEmailSetting(localizationSettings) {
    var language = formatLanguage(localizationSettings.Language);
    var languageCode = localizationSettings.LanguageCode;
    var emailSubjectFull = (localizationSettings.DefaultEmailSubject === null) ? '' : localizationSettings.DefaultEmailSubject;
    var emailSubject = (emailSubjectFull.length > 100) ? emailSubjectFull.substring(0, 100) + '..' : emailSubjectFull;
    var emailBodyFull = (localizationSettings.DefaultEmailBody === null) ? '' : localizationSettings.DefaultEmailBody;
    var emailBody = (emailBodyFull.length > 200) ? emailBodyFull.substring(0, 200) + '..' : emailBodyFull;
    var html = '<div class="divided email-setting" id="' + languageCode + '"><div class="grid-row"><div class="three col wrap"><p class="break">' +
      language + '</p></div><div class="three col wrap"><p class="breakword">' +
      '<span class="sub-text" title="' + encodeSpecialCharacters(emailSubjectFull) + '">' +
      encodeSpecialCharacters(emailSubject) + '</span></p></div><div class="six col editable wrap"><p class="breakword">' +
      '<span class="sub-text" title="' + encodeSpecialCharacters(emailBodyFull) + '">' +
      encodeSpecialCharacters(emailBody) + '</p><div class="controls">';
    if (languageCode !== 'en') {
      html += '<a href="javascript:void(0);" style="padding-left:8px;" class="delete" languageCode="' + languageCode + '">' + dsGlobal.deleteLabel + '</a>';
    }
    html += '<a href="javascript:void(0);" class="edit" languageCode="' + languageCode + '">' + dsGlobal.editLabel + '</a></div></div></div></div>';
    $('.email-settings').append(html);
  }

  // Remove email setting from docusign localization settings list

  function removeDocuSignLocalizationSetting(languageCode) {
    var dslocalizationSettings = dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings;
    if (languageCode !== null && dslocalizationSettings !== null) {
      var localizationSettings = [];
      for (var i = 0; i < dslocalizationSettings.length; i++) {
        if (dslocalizationSettings[i].LanguageCode !== languageCode) {
          localizationSettings.push(dslocalizationSettings[i]);
        }
      }
      dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings = localizationSettings;
    }
  }

  // Update email setting in the docusign localization settings list

  function updateDocuSignLocalizationSetting(localizationSettings) {
    if (localizationSettings !== null && dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings !== null) {
      for (var i = 0; i < dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings.length; i++) {
        if (dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings[i].LanguageCode === localizationSettings.LanguageCode) {
          dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings[i].DefaultEmailSubject = localizationSettings.DefaultEmailSubject;
          dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings[i].DefaultEmailBody = localizationSettings.DefaultEmailBody;
          break;
        }
      }
    }
  }

  // Check if localization is available (already saved)

  function isLanguageAvailable(languageCode) {
    var localizationSettings = dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings;
    var localizationSetting;
    for (var i = 0; i < localizationSettings.length; i++) {
      if (localizationSettings[i].LanguageCode === languageCode) {
        return false;
      }
    }
    return true;
  }

  // Check the localization settings, hide the New button if no more available settings

  function checkLocalizationSettingsList() {
    if (dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings.length < 11) {
      $('#newLanguageSettingBtn').show();
    } else {
      $('#newLanguageSettingBtn').hide();
    }
  }

  /*
   * This function to encode special characters to html
   * @param str  the string to be modified
   */

  function encodeSpecialCharacters(str) {
    if (!str) {
      return '';
    }
    return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&lsquo;');
  }

  // Click handler for deleting email settings
  $('.email-settings').on('click', '.delete', function () {
    var languageCode = $(this).attr('languageCode');
    $('#' + languageCode).css('opacity', '0.5');
    try {
      Visualforce.remoting.Manager.invokeAction(
        dsGlobal.deleteEmailSettings, languageCode,
        function (result, event) {
          $('#' + languageCode).remove();
          removeDocuSignLocalizationSetting(languageCode);
          checkLocalizationSettingsList();
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

  // Click handler for editing email settings
  $('.email-settings').on('click', '.edit', function () {
    var languageCode = $(this).attr('languageCode');
    var localizationSettings = dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings;
    var localizationSetting;
    for (var i = 0; i < localizationSettings.length; i++) {
      if (localizationSettings[i].LanguageCode === languageCode) {
        localizationSetting = localizationSettings[i];
      }
    }
    $('#languageSettingsDropdown').empty();
    $('#languageSettingsDropdown').append($('<option>', {
      value: localizationSetting.LanguageCode,
      text: formatLanguage(localizationSetting.Language)
    }));
    $('#defaultEmailSubject').val(localizationSetting.DefaultEmailSubject);
    $('#defaultEmailMessage').val(localizationSetting.DefaultEmailBody);
    $('#languageSettingsDropdown').prop('disabled', true);
    $('#languageSettingsDropdown').addClass('disabled');
    $('.email-subject-error-label').hide();
    $('#defaultEmailSubject').removeClass('error');
    $('#languageSettingsModal').show();
  });

  // Click handler for the "Save" button in language settings modal
  $('#saveLanguageSettingBtn').click(function () {
    var languageCode = $('#languageSettingsDropdown').val();
    var isEditing = $('#languageSettingsDropdown').prop('disabled');
    if ($('#defaultEmailSubject').val() === '') {
      $('.email-subject-error-label').show();
      $('#defaultEmailSubject').addClass('error');
      return;
    }
    var localizationSetting = {};
    var localizationSettings = dsGlobal.responseJson.admin.settings.availableLocalizationSettings;
    for (var i = 0; i < localizationSettings.length; i++) {
      if (localizationSettings[i].LanguageCode === languageCode) {
        localizationSetting.Deletable = localizationSettings[i].Deletable;
        localizationSetting.Language = localizationSettings[i].Language;
        localizationSetting.LanguageCode = localizationSettings[i].LanguageCode;
      }
    }
    localizationSetting.DefaultEmailSubject = $('#defaultEmailSubject').val();
    localizationSetting.DefaultEmailBody = $('#defaultEmailMessage').val();
    try {
      Visualforce.remoting.Manager.invokeAction(
        dsGlobal.saveEmailSettings, localizationSetting.LanguageCode,
        localizationSetting.DefaultEmailSubject, localizationSetting.DefaultEmailBody,
        function (result, event) {
          var isEditing = $('#languageSettingsDropdown').prop('disabled');
          if (isEditing === true) {
            updateDocuSignLocalizationSetting(localizationSetting);
          } else {
            dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings.push(localizationSetting);
          }
          populateEmailSettings(dsGlobal.responseJson.admin.settings.docuSignLocalizationSettings);
          $('#languageSettingsModal').hide();
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

  // Change handler for the chatter settings dropdown
  $('#dsChatterDropdown').change(function () {
    if (this.value === 'Disabled') {
      $('#chatter-settings').hide();
      $('#dsChatterLanguageDropdown').hide();
    } else {
      $('#chatter-settings').show();
      $('#dsChatterLanguageDropdown').show();
    }
  });

  // change handler for chatter language dropdown
  $('#dsChatterLanguageDropdownSelect').change(function () {
    populateChatterEventSettings(dsGlobal.responseJson.admin.settings, this.value);
  });

  // Change handler for the Enable Reminder and Expiration Settings dropdown
  $('#reminderSettingsCheckbox').change(function () {
    if ($(this).prop('checked') === true) {
      $('#reminderSettings').show();
    } else {
      $('#reminderSettings').hide();
    }
  });

  // Change handler for all Remind and Expire settings text inputs
  $('#remindSignersTextInput, #continueToSendRemindersTextInput, #expireRequestInTextInput, #warnSignersTextInput').change(function () {
    if (isNaN(this.value) || this.value < 0 || (this.value % 1) !== 0 || this.value.slice(-1) === '.') {
      var settings = dsGlobal.responseJson.admin.settings;
      if (this.id === 'remindSignersTextInput') {
        $('#remindSignersTextInput').val(populateRemindExpireSettings(settings.reminderDays));
      } else if (this.id === 'continueToSendRemindersTextInput') {
        $('#continueToSendRemindersTextInput').val(populateRemindExpireSettings(settings.reminderRepeat));
      } else if (this.id === 'expireRequestInTextInput') {
        $('#expireRequestInTextInput').val(populateRemindExpireSettings(settings.expireDays));
      } else if (this.id === 'warnSignersTextInput') {
        $('#warnSignersTextInput').val(populateRemindExpireSettings(settings.expireWarning));
      }
    }
  });

  // Click handler for "New" button in Email Settings of Settings tab
  $('#newLanguageSettingBtn').click(function () {
    $('#languageSettingsDropdown').empty();
    $('#languageSettingsDropdown').prop('disabled', false);
    $('#languageSettingsDropdown').removeClass('disabled');
    var localizationSettings = dsGlobal.responseJson.admin.settings.availableLocalizationSettings;
    for (var i = 0; i < localizationSettings.length; i++) {
      localizationSettings[i].Language = formatLanguage(localizationSettings[i].Language);
    }
    localizationSettings.sort(function (a, b) {
      var x = a.Language.toLowerCase();
      var y = b.Language.toLowerCase();
      if (x > y) return 1;
      if (x < y) return -1;
      return 0;
    });
    var firstItemIsSet = false;
    for (var i = 0; i < localizationSettings.length; i++) {
      if (!isLanguageAvailable(localizationSettings[i].LanguageCode))
        continue;
      $('#languageSettingsDropdown').append($('<option>', {
        value: localizationSettings[i].LanguageCode,
        text: localizationSettings[i].Language
      }));
      if (!firstItemIsSet) {
        $('#defaultEmailSubject').val(localizationSettings[i].DefaultEmailSubject);
        $('#defaultEmailMessage').val(localizationSettings[i].DefaultEmailBody);
        firstItemIsSet = true;
      }
    }
    $('.email-subject-error-label').hide();
    $('#defaultEmailSubject').removeClass('error');
    $('#languageSettingsModal').show();
  });

  // Change handler for the New Email Settings dropdown
  $('#languageSettingsDropdown').change(function () {
    var selectedVal = $(this).val();
    var localizationSettings = dsGlobal.responseJson.admin.settings.availableLocalizationSettings;
    for (var i = 0; i < localizationSettings.length; i++) {
      if (localizationSettings[i].LanguageCode === selectedVal) {
        $('#defaultEmailSubject').val(localizationSettings[i].DefaultEmailSubject);
        $('#defaultEmailMessage').val(localizationSettings[i].DefaultEmailBody);
        break;
      }
    }
  });

  // Click handler for "Cancel" button and "X" icon in language settings modal
  $('#languageSettingsCloseIcon, #cancelLanguageSettingBtn').click(function () {
    $('#languageSettingsModal').hide();
  });

  // Change handler for the default email subject
  $('#defaultEmailSubject').change(function () {
    if ($(this).val() !== '') {
      $('.email-subject-error-label').hide();
      $('#defaultEmailSubject').removeClass('error');
    } else {
      $('.email-subject-error-label').show();
      $('#defaultEmailSubject').addClass('error');
    }
  });

  // Click handler for the "Save" button in Settings tab
  $('#saveSettingsBtn').click(function () {
    $('.fullscreenload').show();
    var settings = dsGlobal.responseJson.admin.settings;
    try {
      // Update Email Settings
      settings.disableEmailSubjectEditing = $('#disableUserEmailSubjectCheckBox').prop('checked');
      settings.disableEmailMessageEditing = $('#disableUserEmailMessageCheckBox').prop('checked');
      settings.recipientRoleNames = $('#recipientRoleSettingsTextarea').val();
      // Update Send Settings
      settings.apexTimeOuts = ($('#apexTimeOutInput').val() * 1000);
      settings.hideSendNowButton = $('#hideSendNowButton').prop('checked');
      settings.hideNextButton = $('#hideNextButton').prop('checked');
      settings.enableSFCalloutLimit = $('#enableSFCalloutLimit').prop('checked');
      settings.enableMobileAppForSF1 = $('#enableMobileTaggingUI').prop('checked');
      settings.displayTaggerPageInNewWindow = $('#displayTaggerPageInNewWindow').prop('checked');
      settings.displayInPersonSigningPageInNewWindow = $('#displayInPersonSigningPageInNewWindow').prop('checked');
      settings.enableRemindAndExpirationSettings = $('#reminderSettingsCheckbox').prop('checked');
      settings.hideRemindAndExpirationSettings = $('#hideRemindAndExpireSettings').prop('checked');
      settings.reminderDays = $('#remindSignersTextInput').val();
      settings.reminderRepeat = $('#continueToSendRemindersTextInput').val();
      settings.expireDays = $('#expireRequestInTextInput').val();
      settings.expireWarning = $('#warnSignersTextInput').val();
      settings.loadFiles = $('#loadFiles').prop('checked');
      settings.lightningComponentLogging = $('#lightningComponentLogging').prop('checked');
      // Update Chatter Settings
      settings.chatterSettingCode = $('#dsChatterDropdown').val();
      settings.envelopeSentChatterEnabled = $('#chatterEnvelopeSentCheckbox').prop('checked');
      settings.envelopeDeliveredChatterEnabled = $('#chatterEnvelopeDeliveredCheckbox').prop('checked');
      settings.envelopeCompletedChatterEnabled = $('#chatterEnvelopeCompletedCheckbox').prop('checked');
      settings.envelopeDeclinedChatterEnabled = $('#chatterEnvelopeDeclinedCheckbox').prop('checked');
      settings.envelopeVoidedChatterEnabled = $('#chatterEnvelopeVoidedCheckbox').prop('checked');
      settings.recipientSentChatterEnabled = $('#chatterRecipientSentCheckbox').prop('checked');
      settings.recipientDeliveredChatterEnabled = $('#chatterRecipientDeliveredCheckbox').prop('checked');
      settings.recipientCompletedChatterEnabled = $('#chatterRecipientCompletedCheckbox').prop('checked');
      settings.recipientSignedChatterEnabled = $('#chatterRecipientSignedCheckbox').prop('checked');
      settings.recipientDeclinedChatterEnabled = $('#chatterRecipientDeclinedCheckbox').prop('checked');

      settings.actionsUndoAndSendChatterEnabled = $('#chatterActionsUndoAndSend').prop('checked');
      settings.actionsEnvelopeSigningChatterEnabled = $('#chatterActionsEnvelopeSigning').prop('checked');

      var chatterSettings = dsGlobal.responseJson.admin.settings.chatterTextDto;
      for (var i = 0; i < chatterSettings.length; i++) {
        var currentLanguageSettings = chatterSettings[i];
        if (currentLanguageSettings.LanguageCode === dsGlobal.chatterLanguageCodeText) {
          var that = currentLanguageSettings.text;
          that.envelopeSentChatterText = $('#chatterEnvelopeSentText').val();
          that.envelopeDeliveredChatterText = $('#chatterEnvelopeDeliveredText').val();
          that.envelopeCompletedChatterText = $('#chatterEnvelopeCompletedText').val();
          that.envelopeDeclinedChatterText = $('#chatterEnvelopeDeclinedText').val();
          that.envelopeVoidedChatterText = $('#chatterEnvelopeVoidedText').val();
          that.recipientSentChatterText = $('#chatterRecipientSentText').val();
          that.recipientDeliveredChatterText = $('#chatterRecipientDeliveredText').val();
          that.recipientCompletedChatterText = $('#chatterRecipientCompletedText').val();
          that.recipientSignedChatterText = $('#chatterRecipientSignedText').val();
          that.recipientDeclinedChatterText = $('#chatterRecipientDeclinedText').val();
        }
      }

      Visualforce.remoting.Manager.invokeAction(
        dsGlobal.updateSettings, settings,
        function (result, event) {
          $('.fullscreenload').hide();
          showMessages(result.messages);
          if (result.action === 'ShowSuccess') {
            $('#dsChatterLanguageDropdown [value=\'' + dsGlobal.chatterLanguageCodeText + '\']').prop('selected', 'selected');
          }
        }
      );
    } catch (err) {
      $('.fullscreenload').hide();
      console.log(err);
    }
  });


  /*  New Custom Tag */

  // functions to convert lines and char per lines into width and height

  function convertToPixelWidth(inputVal) {
    var width;

    var fontSizeInPixel = pixels[$('#fontSizeDropDown').val()];

    if ((inputVal === '') && ($('#tagTypeDropdown').val() === 'decline' ||
      $('#tagTypeDropdown').val() === 'approve' ||
      $('#tagTypeDropdown').val() === 'note')) {
      width = 125;
    } else {
      var minWidth = Math.floor((fontSizeInPixel > 0) ? (fontSizeInPixel * 11 / 18) : 11);

      width = minWidth;
      if (inputVal !== '') {
        var res = parseInt(inputVal);
        if (res > 0) {
          width = res * minWidth;
        }
      }
    }
    return Math.round(width);
  }

  function convertToPixelHeight(inputValHeight) {
    var height;

    var fontSizeInPixel = pixels[$('#fontSizeDropDown').val()];

    if (inputValHeight === '' && ($('#tagTypeDropdown').val() === 'decline' ||
      $('#tagTypeDropdown').val() === 'approve')) {
      height = 39;
    } else if ((inputValHeight === '') && ($('#tagTypeDropdown').val() === 'note')) {
      height = 63;
    } else {
      var minHeight = (fontSizeInPixel > 0) ? fontSizeInPixel : 18;
      height = minHeight;
      if (inputValHeight !== '') {
        var res = parseInt(inputValHeight);
        if (res > 0) {
          height = res * minHeight;
        }
      }
    }
    return Math.round(height);
  }

  function convertWidthToPixels(font, width) {
    var fontSizeInPixel = pixels[font];

    if (width !== '' && fontSizeInPixel !== null) {
      var minWidth = Math.floor(fontSizeInPixel * 11 / 18);
      return Math.max(Math.round(width / minWidth), 1);
    }
  }

  function convertHeightToPixels(font, height) {
    var fontSizeInPixel = pixels[font];

    if (height !== '' && fontSizeInPixel !== null) {
      return Math.max(Math.round(height / fontSizeInPixel), 1);
    }
  }

  function clearallTextFieldsNewCustomTag() {
    $('#customTagNameText').val('');
    $('#anchorText').val('');
    $('#initialValueText').val('');
    $('#dropDownOptionsTextArea').val('');
    $('#widthText').val('');
    $('#fontDropDown').val('arial');
    $('#fontSizeDropDown').val('size9');
    $('#fontColorDropDown').val('black');
    $('#validationTypeDropdown').val('NoValidation');
    $('#heightText').val('');
    $('#customTagToolTipText').val('');
    $('#regExPatternText').val('');
    $('#validationErrorMessageText').val('');
    $('#maxCharactersText').val('');
    $('#linesText').val('');
    $('#charactersPerLineText').val('');
  }

  function clearallCheckBoxesNewCustomTag() {
    $('#requiredFieldChkBox').attr('checked', false);
    $('#readOnlyChkBox').attr('checked', false);
    $('#sharedChkBox').attr('checked', false);
    $('#AllowWritebackToSalesforceChkBox').attr('checked', false);
    $('#AllowSenderToEditCustomFieldsChkBox').attr('checked', false);
    $('#hideTextWithAsterisksTxtBox').attr('checked', false);
    $('#fixedSizeChkBox').attr('checked', false);
    $('#includeNoteInEmailChkBox').attr('checked', false);
  }

  $('#newCustomTag').click(function (event) {
    switchCustomTagHeader('new');
    clearallTextFieldsNewCustomTag();
    clearallCheckBoxesNewCustomTag();
    disableSaveButton();
    $('#customTagIdText').val('');
    $(saveCustomTagBtn).addClass('next');
    $('#deleteCustomTagBtn').hide();
    $('#newCustomTagCreationContent').show();
    $('#newCustomTagInfo').show();
    $('#newCustomTagFormat').show();
    $('#newCustomTagValidation').show();
    $('#newCustomTagInputLimit').show();
    $('#newCustomTagAdvanced').show();
    $('#newCustomTagSaveCancel').show();
    $('#customTagTabContent').hide();
    $('#bold').removeClass('selected');
    $('#italic').removeClass('selected');
    $('#underline').removeClass('selected');

    //related to salesforce div
    $('#relateFieldToSalesforce').hide();
    $('#relateFieldToSalesforceCheckbox').prop('checked', false);
    $('#salesforceObjectDropDown').empty();
    $('#firstLevelFieldSetDropDown').hide();
    $('#firstLevelFieldSetDropDown').empty();
    $('#secondLevelFieldSetDropDown').hide();
    $('#secondLevelFieldSetDropDown').empty();
    $('#thirdLevelFieldSetDropDown').hide();
    $('#thirdLevelFieldSetDropDown').empty();

    //set initial default value to text field
    var selectedVal = 'text';
    $('#tagTypeDropdown').val(selectedVal);

    //handle visibility for all six divs
    handleCustomTagDiv(selectedVal);
    handleFormattingDiv(selectedVal);
    handleValidation(selectedVal);
    handleAccountSettings(selectedVal);
    handleInputLimitDiv(selectedVal);
    handleAdvancedDiv(selectedVal);

    if (dsGlobal.responseJson.admin.accountSettings.dataFieldRegexEnabled === false) {
      $('#validationTypeDropdown option[value=\'RegExp\']').remove();
    }
  });

  $('#cancelCustomTagBtn').click(function () {

    $('#newCustomTagCreationContent').hide();
    $('#newCustomTagInfo').hide();
    $('#newCustomTagFormat').hide();
    $('#customTagIdText').val('');
    $('#newCustomTagValidation').hide();
    $('#newCustomTagInputLimit').hide();
    $('#newCustomTagAdvanced').hide();
    $('#newCustomTagSaveCancel').hide();
    $('#customTagTabContent').hide();
    dsGlobal.responseJson.action = 'ShowCustomTags';
    loadAdminTab();
  });


  var customTabIDForDeletion = null;
  $('#deleteCustomTagBtn').click(function () {
    var customTag = dsGlobal.responseJson.admin.customTag;
    $('#deleteCustomTagConfirmationModal').show();

  });
  // Click handler for "Cancel" button and "X" icon in language settings modal
  $('#deleteCustomTagCloseIcon, #cancelDeleteCustomTagConfirmationBtn').click(function () {
    $('#deleteCustomTagConfirmationModal').hide();
  });

  $('#deleteCustomTagConfirmationBtn').click(function () {
    var customTag = dsGlobal.responseJson.admin.customTag;
    customTag.customTabId = customTabIDForDeletion;
    // Call deleteCustomTag
    try {
      Visualforce.remoting.Manager.invokeAction(
        dsGlobal.deleteCustomTag, customTag,
        function (result, event) {
          if (result.action === 'ShowError') {
            hideLoading();
            showMessages(result.messages);
          } else {
            customTabIDForDeletion = null;
            location.reload();
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });


  function switchCustomTagHeader(mode) {
    $('#createCustomTag').hide();
    $('#editCustomTag').hide();
    if (mode === 'edit') {
      $('#editCustomTag').show();
    }
    if (mode === 'create' || mode === 'new') {
      $('#createCustomTag').show();
    }
  }

  function setectSalesforceObjectInSelectList(/*string*/ listId, /*string*/ fieldName) {
    var fullvalue;
    $('#' + listId + ' option').each(function () {
      var currentElementValue = this.value;
      if (currentElementValue !== '-1') {
        var elements = currentElementValue.split('|');
        var objectName = elements[0].trim();
        if (objectName !== 'NaNval') {
          if (elements.length > 1) {
            var objectType = elements[1].trim();
            if (objectType === 'reference' || objectType === 'child_relationship') {
              objectName = elements[2].trim();
            }
          }
          if (objectName.toLowerCase() === fieldName.toLowerCase()) {
            fullvalue = currentElementValue;
          }
        }
      }
    });
    if (fullvalue !== undefined) {
      $('#' + listId).val(fullvalue);
    }
    return fullvalue;
  }

  // shows custom tag screen

  function showCustomTag(customTagId) {

    // locate our custom tag
    var customTag = null;
    for (var i = 0; i < dsGlobal.responseJson.admin.customTags.length; i++) {
      var c = dsGlobal.responseJson.admin.customTags[i];
      if (c.customTabId === customTagId) {
        customTag = c;
        break;
      }
    }
    if (customTag === null) {
      return;
    }

    //css class for save button
    $(saveCustomTagBtn).addClass('next');
    // start showing UI
    switchCustomTagHeader('edit');
    clearallTextFieldsNewCustomTag();
    clearallCheckBoxesNewCustomTag();
    $('#customTagIdText').val(customTagId);
    $('#CreateEditCustomTag').html();
    hideValidationErrorOnName();
    enableSaveButton();
    $('#deleteCustomTagBtn').show();
    $('#newCustomTagCreationContent').show();
    $('#newCustomTagInfo').show();
    $('#newCustomTagFormat').show();
    $('#newCustomTagValidation').show();
    $('#newCustomTagInputLimit').show();
    $('#newCustomTagAdvanced').show();
    $('#newCustomTagSaveCancel').show();
    $('#customTagTabContent').hide();

    // reload to UI elements
    $('#customTagNameText').val(customTag.tabLabel === '--' ? '' : customTag.tabLabel);
    if (dsGlobal.responseJson.admin.accountSettings.tabDataLabelEnabled) {
      $('#customTagNameText').attr('readonly', false);
      $('#customTagNameText').css('background-color', '#FFFFFF');
    } else {
      $('#customTagNameText').attr('readonly', true);
      $('#customTagNameText').css('background-color', '#DEDEDE');

    }
    $('#anchorText').val(customTag.anchor === '--' ? '' : customTag.anchor);

    if (customTag.validationPattern.length > 0 && dsGlobal.responseJson.admin.accountSettings.dataFieldRegexEnabled === false) {
      $('#validationTypeDropdown option[value=\'RegExp\']').remove();
      $('#RegExPatternDiv').hide();
      customTag.type = 'text';
      customTag.validationPattern = '';
    }
    handleAccountSettings(customTag.type);

    var validationTypes = ['email', 'number', 'date', 'ssn', 'zip5', 'zip5Dash4'];
    if (validationTypes.indexOf(customTag.type) >= 0) {
      $('#tagTypeDropdown').val('text');
    } else {
      $('#tagTypeDropdown').val(customTag.type);
    }
    chageTagTypeDropdown($('#tagTypeDropdown').val());

    var validationTypeChanged = false;

    if (customTag.validationPattern === '--') {
      if (validationTypes.indexOf(customTag.type) >= 0) {
        $('#validationTypeDropdown').val(customTag.type);
        validationTypeChanged = true;
      } else {
        $('#validationTypeDropdown').val('NoValidation');
      }
    } else if (customTag.validationPattern.length > 0) {
      $('#validationTypeDropdown').val('RegExp');
      validationTypeChanged = true;
    } else {
      $('#validationTypeDropdown').val('NoValidation');
    }
    if (validationTypeChanged) {
      changeValidationTypeDropdown($('#validationTypeDropdown').val());
    }

    $('#initialValueText').val(customTag.initialValue);
    $('#requiredFieldChkBox').prop('checked', customTag.required === 'true');
    $('#sharedChkBox').prop('checked', customTag.sharedApi === 'true');
    $('#readOnlyChkBox').prop('checked', customTag.locked === 'true');

    if (customTag.items.length > 0) {
      $('#dropDownOptionsTextArea').val(customTag.items.join(';'));
    }

    $('#fontDropDown').val(customTag.font);
    $('#fontSizeDropDown').val(customTag.fontSize);
    $('#fontColorDropDown').val(customTag.fontColor);

    if (customTag.bold === 'true') {
      $('#bold').addClass('selected');
    } else {
      $('#bold').removeClass('selected');
    }
    if (customTag.italic === 'true') {
      $('#italic').addClass('selected');
    } else {
      $('#italic').removeClass('selected');
    }
    if (customTag.underline === 'true') {
      $('#underline').addClass('selected');
    } else {
      $('#underline').removeClass('selected');
    }

    $('#hideTextWithAsterisksTxtBox').prop('checked', customTag.concealValueOnDocument === 'true');
    $('#widthText').val(customTag.width === 0 ? '' : customTag.width);
    $('#heightText').val(customTag.height === 0 ? '' : customTag.height);

    //-- Tooltip Div --
    $('#customTagToolTipText').val(customTag.name);

    //--InputLimit Div --
    $('#maxCharactersText').val(customTag.maximumLength);
    if (customTag.type === 'text') {
      // reverse these convertions
      $('#charactersPerLineText').val(convertWidthToPixels(customTag.fontSize, customTag.width) === 1 ? '' : convertWidthToPixels(customTag.fontSize, customTag.width));
      $('#linesText').val(convertHeightToPixels(customTag.fontSize, customTag.height) === 1 ? '' : convertHeightToPixels(customTag.fontSize, customTag.height));

    }

    if (customTag.type === 'formula' || customTag.type === 'signerAcleattachment' || customTag.type === 'company' || customTag.type === 'title') {
      $('#charactersPerLineText').val(convertWidthToPixels(customTag.fontSize, customTag.width) === 1 ? '' : convertWidthToPixels(customTag.fontSize, customTag.width));
    }
    //validationTypeDropdown
    $('#regExPatternText').val(customTag.validationPattern === '--' ? '' : customTag.validationPattern);
    $('#validationErrorMessageText').val(customTag.validationMessage);

    //--Advanced Div --
    $('#fixedSizeChkBox').prop('checked', customTag.editable === 'true');
    $('#includeNoteInEmailChkBox').prop('checked', customTag.includedInEmail === 'True');

    //-----Related to salesforce----
    var hasSalesforceRelatedField = customTag.mergeField.path !== null;
    $('#relatedToSalesforce').show();
    $('#relateFieldToSalesforceCheckbox').prop('checked', hasSalesforceRelatedField);
    if (hasSalesforceRelatedField === true) {
      var thePath = customTag.mergeField.path;
      $('#AllowWritebackToSalesforceChkBox').prop('checked', customTag.mergeField.writeBack === 'true');
      $('#AllowSenderToEditCustomFieldsChkBox').prop('checked', customTag.mergeField.allowSenderToEdit === 'true');
      switchSalesforceRelatedCheckbox(true, function (path1) {

        var objectname = path1.split('.')[0];
        objectname = setectSalesforceObjectInSelectList('salesforceObjectDropDown', objectname);
        switchSalesforceObjectDropDown(objectname, function (path2) {

          var firstfieldname = path2.split('.')[1];
          var firstoptionname = setectSalesforceObjectInSelectList('firstLevelFieldSetDropDown', firstfieldname);
          switchFirstLevelFieldSetDropDown(firstoptionname, function (path3) {

            var secondfieldname = path3.split('.')[2];
            var secondoptionname = setectSalesforceObjectInSelectList('secondLevelFieldSetDropDown', secondfieldname);
            switchSecondLevelFieldSetDropDown(secondoptionname, function (path4) {

              var thirdfieldname = path4.split('.')[3];
              var thirdoptionname = setectSalesforceObjectInSelectList('thirdLevelFieldSetDropDown', thirdfieldname);
              switchThirdLevelFieldSetDropDown(thirdoptionname, false);
            }, path3, false);
          }, path2, false);
        }, path1);
      }, thePath);
    } else {
      $('#relateFieldToSalesforce').hide();
      $('#firstLevelFieldSetDropDown').empty();
      $('#firstLevelFieldSetDropDown').hide();
      $('#secondLevelFieldSetDropDown').empty();
      $('#secondLevelFieldSetDropDown').hide();
      $('#thirdLevelFieldSetDropDown').empty();
      $('#thirdLevelFieldSetDropDown').hide();
    }
  }

  $('div[id^=\'customtag_\']').click(function () {
    var customTagId = this.id.substring('customtag_'.length);
    customTabIDForDeletion = customTagId;
    showCustomTag(customTagId);
  });

  function setDefaultFormatting(isDefault, isUi, isOld, defaultValue, uiValue, oldValue) {
    if (isDefault)
      return defaultValue;
    if (isUi)
      return uiValue;
    if (isOld)
      return oldValue;
  }


  // Save Custom Button
  $('#saveCustomTagBtn').click(function (event) {

    if ($('#saveCustomTagBtn').css('pointer-events') === 'all') {
      showLoading();
      var customTag = dsGlobal.responseJson.admin.customTag;
      var mergeField = dsGlobal.responseJson.admin.customTag.mergeField;
      customTag.tabLabel = $('#customTagNameText').val().trim();
      customTag.anchor = $('#anchorText').val();
      customTag.type = $('#tagTypeDropdown').val();
      customTag.customTabId = $('#customTagIdText').val();

      // validation type overrides tag type
      if (($('#validationTypeDropdown').val() !== 'NoValidation') && $('#validationTypeDropdown').val() !== 'RegExp') {
        customTag.type = ($('#validationTypeDropdown').val());
      }
      customTag.validationPattern = $('#validationTypeDropdown').val();
      customTag.initialValue = $('#initialValueText').val();
      customTag.required = $('#requiredFieldChkBox').is(':checked');
      customTag.shared = $('#sharedChkBox').is(':checked');
      customTag.locked = $('#readOnlyChkBox').is(':checked');


      if ($('#dropDownOptionsTextArea').val() !== null || $('#dropDownOptionsTextArea').val() !== '') {
        var items = $('#dropDownOptionsTextArea').val().split(';');
        customTag.items = items;
      }

      var isCreateNew = (customTag.customTabId === null) || (customTag.customTabId === undefined) || (customTag.customTabId.length === 0);
      var oldCustomTag = {};
      if (!isCreateNew) {
        for (var i = 0; i < dsGlobal.responseJson.admin.customTags.length; i++) {
          var c = dsGlobal.responseJson.admin.customTags[i];
          if (c.customTabId === customTag.customTabId) {
            oldCustomTag = c;
            break;
          }
        }
      }
      var useUi = dsGlobal.responseJson.admin.accountSettings.tabTextFormattingEnabled;
      var useDefault = !useUi && isCreateNew;
      var useOld = !useUi && !isCreateNew;

      //--Font Div --
      customTag.font = setDefaultFormatting(useDefault, useUi, useOld, 'arial', $('#fontDropDown').val(), oldCustomTag.font);
      customTag.fontSize = setDefaultFormatting(useDefault, useUi, useOld, 'size9', $('#fontSizeDropDown').val(), oldCustomTag.fontSize);
      customTag.fontColor = setDefaultFormatting(useDefault, useUi, useOld, 'black', $('#fontColorDropDown').val(), oldCustomTag.fontColor);

      customTag.bold = setDefaultFormatting(useDefault, useUi, useOld, false, $('#bold').is('.selected'), oldCustomTag.bold);
      customTag.italic = setDefaultFormatting(useDefault, useUi, useOld, false, $('#italic').is('.selected'), oldCustomTag.italic);
      customTag.underline = setDefaultFormatting(useDefault, useUi, useOld, false, $('#underline').is('.selected'), oldCustomTag.underline);

      customTag.concealValueOnDocument = setDefaultFormatting(useDefault, useUi, useOld, false, $('#hideTextWithAsterisksTxtBox').is(':checked'), oldCustomTag.concealValueOnDocument);
      customTag.width = $('#widthText').val();
      customTag.height = $('#heightText').val();

      //-- Tooltip Div --
      customTag.name = $('#customTagToolTipText').val();

      //--InputLimit Div --
      customTag.maximumLength = $('#maxCharactersText').val();
      if ($('#tagTypeDropdown').val() === 'text') {
        customTag.width = convertToPixelWidth($('#charactersPerLineText').val());
        customTag.height = convertToPixelHeight($('#linesText').val());
      }

      if ($('#tagTypeDropdown').val() === 'formula' ||
        $('#tagTypeDropdown').val() === 'signerAttachment' ||
        $('#tagTypeDropdown').val() === 'company' ||
        $('#tagTypeDropdown').val() === 'title') {
        customTag.width = convertToPixelWidth($('#charactersPerLineText').val());
      }


      //--Validation Div --
      //validationTypeDropdown
      customTag.validationPattern = $('#regExPatternText').val();
      customTag.validationMessage = $('#validationErrorMessageText').val();

      //--Advanced Div --
      customTag.editable = setDefaultFormatting(useDefault, useUi, useOld, false, $('#fixedSizeChkBox').is(':checked'), customTag.editable);

      customTag.includedInEmail = $('#includeNoteInEmailChkBox').is(':checked');
      //-----Related to salesforce----
      customTag.relatedToSalesforce = $('#relateFieldToSalesforceCheckbox').is(':checked');

      //relatedtosalesforce is checked
      if ($('#relateFieldToSalesforceCheckbox').is(':checked')) {
        var path = '';
        if ($('#salesforceObjectDropDown').val() !== '-1')
          path = path + $('#salesforceObjectDropDown').val() + '.';

        if ($(firstLevelFieldSetDropDown).val() !== null && $(firstLevelFieldSetDropDown).val() !== '') {
          var objName = $('#firstLevelFieldSetDropDown').val();
          var arr = objName.split('|');
          if (arr[0].trim() !== 'NaNval') {
            if (arr[1].trim() === 'reference' || arr[1].trim() === 'child_relationship')
              path = path + arr[2].trim() + '.';
            else
              path = path + arr[0].trim();
          }
        }

        if ($(secondLevelFieldSetDropDown).val() !== null && $(secondLevelFieldSetDropDown).val() !== '') {

          var objName = $('#secondLevelFieldSetDropDown').val();
          var arr = objName.split('|');
          if (arr[0].trim() !== 'NaNval') {
            if (arr[1].trim() === 'reference' || arr[1].trim() === 'child_relationship')
              path = path + arr[2].trim() + '.';
            else
              path = path + arr[0].trim();
          }

        }

        if ($(thirdLevelFieldSetDropDown).val() !== null && $(thirdLevelFieldSetDropDown).val() !== '') {
          var objName = $('#thirdLevelFieldSetDropDown').val();
          var arr = objName.split('|');
          if (arr[0].trim() !== 'NaNval')
            path = path + arr[0].trim();
        }

        if (path.substr(-1) === '.') {
          path = path.slice(0, -1);
        }
        mergeField.writeBack = $('#AllowWritebackToSalesforceChkBox').is(':checked');
        mergeField.path = path;
        mergeField.allowSenderToEdit = $('#AllowSenderToEditCustomFieldsChkBox').is(':checked');

        customTag.mergeField = mergeField;

      }

      // Call saveCustomTag
      try {
        Visualforce.remoting.Manager.invokeAction(
          dsGlobal.saveCustomTag, customTag,
          function (result, event) {
            if (result.action === 'ShowError') {
              hideLoading();
              showMessages(result.messages);
            } else {
              location.reload();
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    else {

      event.preventDefault();
    }
  });

  //mandatory fields

  //enable save when someone editing Custom Tag Name Textbox
  $('#customTagNameText').on('input', function (e) {
    if ($('#customTagNameText').val().trim() !== '') {
      enableSaveButton();
    } else {
      disableSaveButton();
    }

  });


  $('.fontSelectionButton').click(function (event) {
    $(this).parent().toggleClass('selected');
    event.preventDefault();
  });

  //check for all mandatory fields when anything on div changes
  $('#newCustomTagCreationContent').click(function () {
    //Custom tag name mandatory field check
    if ($(customTagNameText).val().trim() !== '') {
      hideValidationErrorOnName();
      enableSaveButton();

    } else {
      showValidationErrorOnName();
      disableSaveButton();

    }
  });

  // width,hight,lines,characters per line,maxcharacters should accept numbers only
  $('#widthText').keypress(function (e) {
    var verified = (e.which === 8 || e.which === undefined || e.which === 0) ? null : String.fromCharCode(e.which).match(/[^0-9]/);
    if (verified) {
      e.preventDefault();
    }
  });
  $('#heightText').keypress(function (e) {
    var verified = (e.which === 8 || e.which === undefined || e.which === 0) ? null : String.fromCharCode(e.which).match(/[^0-9]/);
    if (verified) {
      e.preventDefault();
    }
  });
  $('#linesText').keypress(function (e) {
    var verified = (e.which === 8 || e.which === undefined || e.which === 0) ? null : String.fromCharCode(e.which).match(/[^0-9]/);
    if (verified) {
      e.preventDefault();
    }
  });
  $('#maxCharactersText').keypress(function (e) {
    var verified = (e.which === 8 || e.which === undefined || e.which === 0) ? null : String.fromCharCode(e.which).match(/[^0-9]/);
    if (verified) {
      e.preventDefault();
    }
  });
  $('#charactersPerLineText').keypress(function (e) {
    var verified = (e.which === 8 || e.which === undefined || e.which === 0) ? null : String.fromCharCode(e.which).match(/[^0-9]/);
    if (verified) {
      e.preventDefault();
    }
  });

  function escapeJs(s) {
    var aDiv = document.createElement('div');
    aDiv.innerHTML = s;
    return aDiv.firstChild.nodeValue;
  }

  function switchSalesforceRelatedCheckbox(/*bool*/ checked, /*function*/ callback, /*string*/ salesforcePath) {
    var sfData = $('#relateFieldToSalesforce');
    var flDropDown = $('#firstLevelFieldSetDropDown');
    var slDropDown = $('#secondLevelFieldSetDropDown');
    var tlDropDown = $('#thirdLevelFieldSetDropDown');
    var newTagModal = $('#newCustomTagCreationContent');
    var sObjectDropDown = $('#salesforceObjectDropDown');
    if (checked) {
      sfData.show();
      try {
        flDropDown.empty();
        flDropDown.hide();
        //pulling first level objects
        Visualforce.remoting.Manager.invokeAction(
          dsGlobal.getAllSalesforceObjects,
          function (result, event) {
            $('.fullscreenload').hide();
            if (result.isMetadataApiSupported === false) {
              newTagModal.hide();
              addRemoteSites('custom-tags', true, function (success) {
                newTagModal.show();
                if (success) {
                  switchSalesforceRelatedCheckbox(checked, callback, salesforcePath);
                } else {
                  $('#relateFieldToSalesforceCheckbox').prop('checked', false);
                }
              });
            } else {
              showMessages(result.messages);
              if (result.action !== 'ShowError') {
                var mergeFieldItemList = result.admin.customTag.mergeFieldItemList;
                dsGlobal.responseJson.admin.customTag.mergeFieldItemList = mergeFieldItemList;
                for (var i = 0; i < mergeFieldItemList.length; i++) {
                  var displayName = escapeJs(mergeFieldItemList[i].displayName);
                  if (i === 0)
                    sObjectDropDown.append($('<option>', {
                      value: mergeFieldItemList[i].name,
                      text: displayName,
                      updateable: mergeFieldItemList[i].isUpdateable
                    }));
                  else
                    sObjectDropDown.append($('<option>', {
                      value: mergeFieldItemList[i].name,
                      text: displayName + '(' + mergeFieldItemList[i].type + ')',
                      updateable: mergeFieldItemList[i].isUpdateable
                    }));
                }

                if (callback === null || callback === undefined) {
                  if ($(customTagNameText).val().trim() === '') {
                    showValidationErrorOnName();
                    disableSaveButton();
                  }
                } else {
                  callback(salesforcePath);
                }
              }
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      resetDivVisibility();
      sfData.hide();
      sObjectDropDown.empty();
      flDropDown.hide();
      flDropDown.empty();
      slDropDown.hide();
      slDropDown.empty();
      tlDropDown.hide();
      tlDropDown.empty();
      $('#AllowWritebackToSalesforceChkBox').attr('checked', false);
      $('#AllowSenderToEditCustomFieldsChkBox').attr('checked', false);

      var selectedVal = $('#tagTypeDropdown').val();
      chageTagTypeDropdown(selectedVal);
    }
  }

  // Handle visibility for relate to salesforce field
  $('#relateFieldToSalesforceCheckbox').click(function () {
    switchSalesforceRelatedCheckbox($(this).is(':checked'), null, null);
  });

  function switchSalesforceObjectDropDown(/*string*/ selectedValue, /*function*/ callback, /*string*/ path) {
    if (selectedValue === null || selectedValue === '' ||
      selectedValue.trim() === '-1' || selectedValue.trim() === 'undefined') {
      $(salesforceObjectDropDown).css({
        'border-color': '#E86B52',
        'border-width': '1px',
        'border-style': 'solid'
      });
      disableSaveButton();
      $('#firstLevelFieldSetDropDown').empty();
      $('#firstLevelFieldSetDropDown').hide();
      $('#secondLevelFieldSetDropDown').empty();
      $('#secondLevelFieldSetDropDown').hide();
      $('#thirdLevelFieldSetDropDown').empty();
      $('#thirdLevelFieldSetDropDown').hide();

    } else {
      try {
        if (callback === null || callback === undefined) {
          resetDivVisibility();
        }
        $('#firstLevelFieldSetDropDown').empty();
        $('#AllowWritebackToSalesforceChkBox').removeAttr('disabled');
        var objName = selectedValue;
        var objName = $('#salesforceObjectDropDown').val();
        //pulling first level objects
        Visualforce.remoting.Manager.invokeAction(
          dsGlobal.getLevelFieldSet, objName, 1,
          function (result, event) {
            $('.fullscreenload').hide();
            showMessages(result.messages);
            var mergeFieldItemList = result.admin.customTag.mergeFieldItemList;
            dsGlobal.responseJson.admin.customTag.mergeFieldItemList = mergeFieldItemList;
            for (var i = 0; i < mergeFieldItemList.length; i++) {
              var displayName = escapeJs(mergeFieldItemList[i].displayName);
              if (i === 0)
                $('#firstLevelFieldSetDropDown').append($('<option>', {
                  value: mergeFieldItemList[i].name,
                  text: displayName,
                  updateable: mergeFieldItemList[i].isUpdateable
                }));
              else if (mergeFieldItemList[i].type === 'reference' || mergeFieldItemList[i].type === 'child_relationship')
                $('#firstLevelFieldSetDropDown').append($('<option>', {
                  value: mergeFieldItemList[i].reference + '|' + mergeFieldItemList[i].type + '|' + mergeFieldItemList[i].name,
                  text: displayName + '(' + mergeFieldItemList[i].type + ')',
                  updateable: mergeFieldItemList[i].isUpdateable
                }));
              else
                $('#firstLevelFieldSetDropDown').append($('<option>', {
                  value: mergeFieldItemList[i].name + '|' + mergeFieldItemList[i].type,
                  text: displayName + '(' + mergeFieldItemList[i].type + ')',
                  updateable: mergeFieldItemList[i].isUpdateable
                }));
            }
            $('#firstLevelFieldSetDropDown').show();
            if (callback === null || callback === undefined) {

              if ($(customTagNameText).val().trim() === '') {
                showValidationErrorOnName();
                disableSaveButton();
              }

              $('#secondLevelFieldSetDropDown').hide();
              $('#secondLevelFieldSetDropDown').empty();
              $('#thirdLevelFieldSetDropDown').empty();
              $('#thirdLevelFieldSetDropDown').hide();
            } else {
              callback(path);
            }


          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  //Change handler for related to salesforce checkbox first level dropdown
  $('#salesforceObjectDropDown').change(function () {
    switchSalesforceObjectDropDown($('#salesforceObjectDropDown').val(), null, null);
  });

  function switchFirstLevelFieldSetDropDown(/*string*/ setvalue, /*function*/ callback, /*string*/ path, /*boolean*/ isChanging) {
    if (callback === null || callback === undefined) {
      resetDivVisibility();
    }
    $('#secondLevelFieldSetDropDown').hide();
    $('#secondLevelFieldSetDropDown').empty();
    $('#thirdLevelFieldSetDropDown').empty();
    $('#thirdLevelFieldSetDropDown').hide();

    if (setvalue !== null && setvalue !== '') {
      var updateable = ($('option:selected', '#firstLevelFieldSetDropDown').attr('updateable') === 'true');
      if (updateable) {
        $('#AllowWritebackToSalesforceChkBox').removeAttr('disabled');
        $('#AllowSenderToEditCustomFieldsChkBox').removeAttr('disabled');
      } else {
        $('#AllowWritebackToSalesforceChkBox').attr('checked', false);
        $('#AllowWritebackToSalesforceChkBox').attr('disabled', true);
        $('#AllowSenderToEditCustomFieldsChkBox').attr('checked', false);
        $('#AllowSenderToEditCustomFieldsChkBox').attr('disabled', true);
      }
      var arr = setvalue.split('|');
      if (arr[0].trim() !== '-1') {
        if ((arr[1].trim() === 'reference') || (arr[1].trim() === 'child_relationship')) {
          $('#secondLevelFieldSetDropDown').empty();
          $('#secondLevelFieldSetDropDown').show();
          try {
            //pulling first level objects
            Visualforce.remoting.Manager.invokeAction(
              dsGlobal.getLevelFieldSet, arr[0].trim(), 2,
              function (result, event) {
                $('.fullscreenload').hide();
                showMessages(result.messages);
                var mergeFieldItemList = result.admin.customTag.mergeFieldItemList;
                dsGlobal.responseJson.admin.customTag.mergeFieldItemList = mergeFieldItemList;
                for (var i = 0; i < mergeFieldItemList.length; i++) {
                  var displayName = escapeJs(mergeFieldItemList[i].displayName);
                  if (i === 0)
                    $('#secondLevelFieldSetDropDown').append($('<option>', {
                      value: mergeFieldItemList[i].name,
                      text: displayName,
                      updateable: mergeFieldItemList[i].isUpdateable
                    }));
                  else if (mergeFieldItemList[i].type === 'reference' || mergeFieldItemList[i].type === 'child_relationship')
                    $('#secondLevelFieldSetDropDown').append($('<option>', {
                      value: mergeFieldItemList[i].reference + '|' + mergeFieldItemList[i].type + '|' + mergeFieldItemList[i].name,
                      text: displayName + '(' + mergeFieldItemList[i].type + ')',
                      updateable: mergeFieldItemList[i].isUpdateable
                    }));
                  else
                    $('#secondLevelFieldSetDropDown').append($('<option>', {
                      value: mergeFieldItemList[i].name + '|' + mergeFieldItemList[i].type,
                      text: displayName + '(' + mergeFieldItemList[i].type + ')',
                      updateable: mergeFieldItemList[i].isUpdateable
                    }));

                }
                if (callback === null || callback === undefined) {
                  if ($(customTagNameText).val().trim() === '') {
                    showValidationErrorOnName();
                    disableSaveButton();
                  }
                } else {
                  setOptionsVisibility(arr[1].trim() === 'picklist');
                  callback(path);
                }
              }
            );

          } catch (err) {
            console.log(err);
          }
        } else {
          var isPicklist = (arr[1].trim() === 'picklist');
          $('#secondLevelFieldSetDropDown').empty();
          $('#secondLevelFieldSetDropDown').hide();
          if (isChanging) {
            selectCustomTagTypeBasedOnMergeField(arr[1].trim());
            if (isPicklist) {
              var mergeFieldItemList = dsGlobal.responseJson.admin.customTag.mergeFieldItemList;
              var value = arr[0];
              for (var i = 0; i < mergeFieldItemList.length; i++) {
                if (mergeFieldItemList[i].name === value) {
                  $('#dropDownOptionsTextArea').val(mergeFieldItemList[i].picklistvalues);
                }
              }

            }
          } else {
            setOptionsVisibility(isPicklist);
          }
        }
      } else {
        $(secondLevelFieldSetDropDown).css({
          'border-color': '#E86B52',
          'border-width': '1px',
          'border-style': 'solid'
        });
        disableSaveButton();
        if ($(customTagNameText).val().trim() === '') {
          showValidationErrorOnName();
          disableSaveButton();
        }
      }
    }
  }

  //Change handler for related to second level dropdown
  $('#firstLevelFieldSetDropDown').change(function () {
    switchFirstLevelFieldSetDropDown($('#firstLevelFieldSetDropDown').val(), null, null, true);
  });

  function switchSecondLevelFieldSetDropDown(/*string*/ setvalue, /*function*/ callback, /*string*/ path, /*boolean*/ isChanging) {
    if (callback === null || callback === undefined) {
      resetDivVisibility();
    }
    $('#thirdLevelFieldSetDropDown').empty();
    $('#thirdLevelFieldSetDropDown').hide();

    var setvalue = $('#secondLevelFieldSetDropDown').val();
    if (setvalue !== null && setvalue !== '') {
      var updateable = ($('option:selected', '#secondLevelFieldSetDropDown').attr('updateable') === 'true');
      if (updateable) {
        $('#AllowWritebackToSalesforceChkBox').removeAttr('disabled');
        $('#AllowSenderToEditCustomFieldsChkBox').removeAttr('disabled');
      } else {
        $('#AllowWritebackToSalesforceChkBox').attr('checked', false);
        $('#AllowWritebackToSalesforceChkBox').attr('disabled', true);
        $('#AllowSenderToEditCustomFieldsChkBox').attr('checked', false);
        $('#AllowSenderToEditCustomFieldsChkBox').attr('disabled', true);
      }
      var arr = setvalue.split('|');
      if (arr[0].trim() !== 'NaNval') {
        if ((arr[1].trim() === 'reference') || (arr[1].trim() === 'child_relationship')) {
          $('#thirdLevelFieldSetDropDown').empty();
          $('#thirdLevelFieldSetDropDown').show();

          try {
            //pulling first level objects
            Visualforce.remoting.Manager.invokeAction(
              dsGlobal.getLevelFieldSet, arr[0].trim(), 3,
              function (result, event) {
                $('.fullscreenload').hide();
                showMessages(result.messages);
                var mergeFieldItemList = result.admin.customTag.mergeFieldItemList;
                dsGlobal.responseJson.admin.customTag.mergeFieldItemList = mergeFieldItemList;
                for (var i = 0; i < mergeFieldItemList.length; i++) {
                  var displayName = escapeJs(mergeFieldItemList[i].displayName);
                  if (i === 0)
                    $('#thirdLevelFieldSetDropDown').append($('<option>', {
                      value: mergeFieldItemList[i].name,
                      text: displayName,
                      updateable: mergeFieldItemList[i].isUpdateable
                    }));
                  else
                    $('#thirdLevelFieldSetDropDown').append($('<option>', {
                      value: mergeFieldItemList[i].name + '|' + mergeFieldItemList[i].type,
                      text: displayName + '(' + mergeFieldItemList[i].type + ')',
                      updateable: mergeFieldItemList[i].isUpdateable
                    }));
                }
                if (callback === null || callback === undefined) {
                  if ($(customTagNameText).val().trim() === '') {
                    showValidationErrorOnName();
                    disableSaveButton();
                  }
                } else {
                  setOptionsVisibility(arr[1].trim() === 'picklist');
                  callback(path);
                }
              }
            );
          } catch (err) {
            console.log(err);
          }
        } else {
          var isPicklist = (arr[1].trim() === 'picklist');
          $('#thirdLevelFieldSetDropDown').empty();
          $('#thirdLevelFieldSetDropDown').hide();
          if (isChanging) {
            selectCustomTagTypeBasedOnMergeField(arr[1].trim());
            if (isPicklist) {
              var mergeFieldItemList = dsGlobal.responseJson.admin.customTag.mergeFieldItemList;
              var value = arr[0];
              for (var i = 0; i < mergeFieldItemList.length; i++) {
                if (mergeFieldItemList[i].name === value) {
                  $('#dropDownOptionsTextArea').val(mergeFieldItemList[i].picklistvalues);
                }
              }

            }

          } else {
            setOptionsVisibility(isPicklist);
          }
        }
      } else {
        $(thirdLevelFieldSetDropDown).css({
          'border-color': '#E86B52',
          'border-width': '1px',
          'border-style': 'solid'
        });
        disableSaveButton();
        if ($(customTagNameText).val().trim() === '') {
          showValidationErrorOnName();
          disableSaveButton();
        }
      }
    }
  }

  //Change handler for related to second level dropdown
  $('#secondLevelFieldSetDropDown').change(function () {
    switchSecondLevelFieldSetDropDown($(secondLevelFieldSetDropDown).val(), null, null, true);
  });

  function switchThirdLevelFieldSetDropDown(/*string*/ setvalue, /*boolean*/ isChanging) {
    if (callback === null || callback === undefined) {
      resetDivVisibility();
    }
    var objName = setvalue;
    var arr = objName.split('|');
    if ((arr[1].trim() === 'reference') || (arr[1].trim() === 'child_relationship')) {
    } else {
      var updateable = ($('option:selected', '#thirdLevelFieldSetDropDown').attr('updateable') === 'true');
      if (updateable) {
        $('#AllowWritebackToSalesforceChkBox').removeAttr('disabled');
        $('#AllowSenderToEditCustomFieldsChkBox').removeAttr('disabled');
      } else {
        $('#AllowWritebackToSalesforceChkBox').attr('checked', false);
        $('#AllowWritebackToSalesforceChkBox').attr('disabled', true);
        $('#AllowSenderToEditCustomFieldsChkBox').attr('checked', false);
        $('#AllowSenderToEditCustomFieldsChkBox').attr('disabled', true);
      }
      var selectedVal = arr[1].trim();
      var isPicklist = (arr[1].trim() === 'picklist');
      if (isChanging) {
        selectCustomTagTypeBasedOnMergeField(selectedVal);
        if (isPicklist) {
          var mergeFieldItemList = dsGlobal.responseJson.admin.customTag.mergeFieldItemList;
          var value = arr[0];
          for (var i = 0; i < mergeFieldItemList.length; i++) {
            if (mergeFieldItemList[i].name === value) {
              $('#dropDownOptionsTextArea').val(mergeFieldItemList[i].picklistvalues);
            }
          }

        }
      } else {
        setOptionsVisibility(isPicklist);
      }
    }
  }

  $('#thirdLevelFieldSetDropDown').change(function () {
    switchThirdLevelFieldSetDropDown($('#thirdLevelFieldSetDropDown').val(), true);

  });

  function setOptionsVisibility(/*string*/ show) {
    if (show) {
      $('#Options').show();
    } else {
      $('#Options').hide();
    }
  }

  function selectCustomTagTypeBasedOnMergeField(selectedVal) {

    switch (selectedVal) {
      case 'picklist':
        selectedVal = 'list';
        break;
      case 'boolean':
        selectedVal = 'checkBox';
        break;
      case 'datetime':
        selectedVal = 'text';
        $('#validationTypeDropdown').val('date');
        break;
      case 'email':
        selectedVal = 'text';
        $('#validationTypeDropdown').val('email');
        break;
      default:
        selectedVal = 'text';
    }

    $('#tagTypeDropdown').val(selectedVal);

    //handle visibility for all six divs

    handleCustomTagDiv(selectedVal);
    handleFormattingDiv(selectedVal);
    handleValidation(selectedVal);
    handleInputLimitDiv(selectedVal);
    handleAdvancedDiv(selectedVal);
    enableSaveButton();
    if ($(customTagNameText).val().trim() === '') {
      showValidationErrorOnName();
      disableSaveButton();
    }
  }

  $('#validationTypeDropdown').change(function () {
    var validationTypeVal = $(this).val();
    changeValidationTypeDropdown(validationTypeVal);
  });

  //Change handler for Validation Type Dropdown
  function changeValidationTypeDropdown(validationTypeVal) {
    if (dsGlobal.responseJson.admin.accountSettings.dataFieldSizeEnabled === false) {
      switch (validationTypeVal) {
        case 'date':
          disableFunction('#maxCharactersText');
          disableFunction('#fixedSizeChkBox');
          disableFunction('#charactersPerLineText');
          disableFunction('#linesText');
          break;
        case 'number':
          disableFunction('#maxCharactersText');
          disableFunction('#fixedSizeChkBox');
          disableFunction('#charactersPerLineText');
          disableFunction('#linesText');
          break;
        case 'email':
          disableFunction('#maxCharactersText');
          disableFunction('#fixedSizeChkBox');
          disableFunction('#charactersPerLineText');
          disableFunction('#linesText');
          break;
        case 'ssn':
          disableFunction('#widthText');
          disableFunction('#heightText');
          disableFunction('#maxCharactersText');
          break;
        case 'zip5':
          disableFunction('#widthText');
          disableFunction('#heightText');
          disableFunction('#maxCharactersText');
          break;
        case 'zip5Dash4':
          disableFunction('#widthText');
          disableFunction('#heightText');
          disableFunction('#maxCharactersText');
          break;
      }
    }
    if (validationTypeVal === 'RegExp') {
      $('#newCustomTagValidation').show();
      $('#validationTypeDiv').show();
      $('#RegExPatternDiv').show();
      $('#ValidationErrorMessageDiv').show();
      if ($(customTagNameText).val().trim() !== '') {
        enableSaveButton();
      }
      else {
        disableSaveButton();
      }
    } else {
      $('#newCustomTagValidation').show();
      $('#validationTypeDiv').show();
      $('#RegExPatternDiv').hide();
      $('#ValidationErrorMessageDiv').show();
      $(regExPatternText).css({
        'border-color': '',
        'border-width': '',
        'border-style': ''
      });
      if ($(customTagNameText).val().trim() !== '') {
        enableSaveButton();
      }
      else {
        disableSaveButton();
      }
    }
  }

  function enableSaveButton() {
    $('#saveCustomTagBtn').attr('href', '#').css({
      'cursor': 'auto',
      'pointer-events': 'all'
    });
  }

  function disableSaveButton() {
    $('#saveCustomTagBtn').attr('href', '').css({
      'cursor': 'pointer',
      'pointer-events': 'none'
    });
  }

  function hideValidationErrorOnName() {
    $('#customTagNameText').css({
      'border-color': '',
      'border-width': '',
      'border-style': ''
    });
  }

  function showValidationErrorOnName() {
    $('#customTagNameText').css({
      'border-color': '#E86B52',
      'border-width': '1px',
      'border-style': 'solid'
    });
  }

  function chageTagTypeDropdown(selectedVal) {
    //handle visibility for all six divs
    resetDivVisibility();
    handleCustomTagDiv(selectedVal);
    handleFormattingDiv(selectedVal);
    handleValidation(selectedVal);
    handleInputLimitDiv(selectedVal);
    handleAccountSettings(selectedVal);
    handleAdvancedDiv(selectedVal);
  }

  // Change handler for the Tag Type in newCustomTag
  $('#tagTypeDropdown').change(function () {
    var selectedVal = $(this).val();
    chageTagTypeDropdown(selectedVal);

  });

  function resetDivVisibility() {


    $('#newCustomTagInfo').show();
    $('#initialValue').show();
    $('#requiredField').show();
    $('#readOnly').show();
    $('#Options').hide();
    if (dsGlobal.responseJson.admin.accountSettings.sharedCustomTabsEnabled) {
      $('#shared').show();
    } else {
      $('#shared').hide();
    }

    $('#newCustomTagFormat').show();
    $('#fontDiv').show();
    $('#widthHeightDiv').show();
    $('#widthHeightDiv').hide();
    $('#hideWithAstericksDiv').show();

    $('#newCustomTagValidation').show();
    $('#validationTypeDiv').show();
    $('#RegExPatternDiv').hide();
    $('#ValidationErrorMessageDiv').show();

    $('#newCustomTagInputLimit').show();
    $('#maxCharacters').show();
    $('#charactersPerLine').show();
    $('#lines').show();

    $('#newCustomTagAdvanced').show();
    $('#fixedSizeDiv').show();
    $('#includeNoteInEmailDiv').hide();
  }

  //Handler for Custom tag Div

  function handleCustomTagDiv(tagType) {

    switch (tagType) {
      case 'approve':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'checkBox':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#Options').hide();
        break;

      case 'company':
        break;

      case 'dateSigned':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'emailAddress':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();

        break;

      case 'decline':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'list':
        $('#initialValue').show();
        $('#requiredField').show();
        $('#readOnly').show();
        $('#Options').show();
        break;

      case 'envelopeId':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'firstName':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'formula':
        break;

      case 'fullName':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'initialHere':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'initialHereOptional':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'lastName':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'note':
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'signHere':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'signHereOptional':
        $('#initialValue').hide();
        $('#requiredField').hide();
        $('#readOnly').hide();
        $('#Options').hide();
        break;

      case 'radio':
        $('#Options').hide();
        $('#initialValue').hide();
        break;

      case 'signerAttachment':
        $('#Options').hide();
        break;

      case 'title':
        $('#Options').hide();
        break;

      default:
        $('#initialValue').show();
        $('#requiredField').show();
        $('#readOnly').show();
        $('#Options').hide();
        if (dsGlobal.responseJson.admin.accountSettings.sharedCustomTabsEnabled) {
          $('#shared').show();
        } else {
          $('#shared').hide();
        }
    }

  }

  //Handler for Formatting Div

  function handleFormattingDiv(tagType) {
    switch (tagType) {
      case 'approve':
        $('#widthHeightDiv').show();
        $('#widthDiv').show();
        $('#heightDiv').show();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        break;
      case 'checkBox':
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'company':
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'dateSigned':
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'decline':
        $('#widthHeightDiv').show();
        $('#widthDiv').show();
        $('#heightDiv').show();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        break;

      case 'list':
        $('#widthHeightDiv').show();
        $('#widthDiv').show();
        $('#heightDiv').hide();
        $('#newCustomTagFormat').show();
        $('#fontDiv').show();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        break;

      case 'emailAddress':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'firstName':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'formula':
        $('#newCustomTagFormat').show();
        $('#fontDiv').show();
        $('#fixedSizeDiv').show();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'fullName':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'envelopeId':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'initialHere':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'initialHereOptional':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'lastName':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'note':
        $('#newCustomTagFormat').show();
        $('#fontDiv').show();
        $('#widthHeightDiv').show();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;
      case 'signHere':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'signHereOptional':
        $('#newCustomTagFormat').hide();
        $('#fontDiv').hide();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'radio':
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'signerAttachment':
        $('#newCustomTagFormat').show();
        $('#fontDiv').show();
        $('#fixedSizeDiv').show();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      case 'title':
        $('#newCustomTagFormat').show();
        $('#fontDiv').show();
        $('#hideWithAstericksDiv').hide();
        $('#fixedSizeDiv').hide();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        break;

      default:
        $('#newCustomTagFormat').show();
        $('#fontDiv').show();
        $('#widthHeightDiv').hide();
        $('#widthDiv').hide();
        $('#heightDiv').hide();
        $('#hideWithAstericksDiv').show();
        $('#fixedSizeDiv').show();
    }

  }

  //Handler for Validation Div

  function handleValidation(tagType) {
    switch (tagType) {
      case 'approve':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'checkBox':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'company':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'dateSigned':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'decline':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'list':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'emailAddress':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'envelopeId':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'firstName':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'formula':
        $('#newCustomTagValidation').show();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').show();
        break;
      case 'fullName':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'initialHere':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'initialHereOptional':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'lastName':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'note':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'radio':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'signHere':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'signHereOptional':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      case 'signerAttachment':
        $('#newCustomTagValidation').show();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').show();
        break;
      case 'title':
        $('#newCustomTagValidation').hide();
        $('#validationTypeDiv').hide();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').hide();
        break;
      default:
        $('#newCustomTagValidation').show();
        $('#validationTypeDiv').show();
        $('#RegExPatternDiv').hide();
        $('#ValidationErrorMessageDiv').show();
    }
    if (dsGlobal.responseJson.admin.accountSettings.dataFieldRegexEnabled === false) {
      $('#RegExPatternDiv').hide();
    }
  }

  //Handler for account settings

  function disableFunction(/*jquery selector */ jQuerySelector) {
    $(jQuerySelector).attr('disabled', 'disabled');
  }

  function handleAccountSettings(tagType) {
    if (dsGlobal.responseJson.admin.accountSettings.dataFieldSizeEnabled === false) {
      switch (tagType) {
        case 'text':
          disableFunction('#maxCharactersText');
          disableFunction('#fixedSizeChkBox');
          disableFunction('#charactersPerLineText');
          disableFunction('#linesText');
          break;
        case 'approve':
          disableFunction('#widthText');
          disableFunction('#heightText');
          break;
        case 'checkBox':
          break;
        case 'company':
          disableFunction('#charactersPerLineText');
          break;
        case 'dateSigned':
          disableFunction('#maxCharactersText');
          disableFunction('#fixedSizeChkBox');
          disableFunction('#charactersPerLineText');
          disableFunction('#linesText');
          break;
        case 'decline':
          disableFunction('#widthText');
          disableFunction('#heightText');
          break;
        case 'list':
          break;
        case 'emailAddress':
          disableFunction('#maxCharactersText');
          disableFunction('#fixedSizeChkBox');
          disableFunction('#charactersPerLineText');
          disableFunction('#linesText');
          break;
        case 'envelopeId':
          break;
        case 'firstName':
          break;
        case 'formula':
          break;
        case 'fullName':
          break;
        case 'initialHere':
          break;
        case 'initialHereOptional':
          break;
        case 'lastName':
          break;
        case 'note':
          disableFunction('#widthText');
          disableFunction('#heightText');
          break;
        case 'radio':
          break;
        case 'signHere':
          break;
        case 'signHereOptional':
          break;
        case 'signerAttachment':
          break;
        case 'title':
          disableFunction('#charactersPerLineText');
          break;
      }
    }
  }

  //Handler for InputLimit Div

  function handleInputLimitDiv(tagType) {
    switch (tagType) {
      case 'approve':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'checkBox':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'company':
        $('#newCustomTagInputLimit').show();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').show();
        break;
      case 'dateSigned':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'decline':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'list':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'emailAddress':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'envelopeId':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'firstName':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'formula':
        $('#newCustomTagInputLimit').show();
        $('#maxCharacters').show();
        $('#charactersPerLine').show();
        $('#lines').hide();
        break;
      case 'fullName':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'initialHere':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'initialHereOptional':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'lastName':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'note':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'radio':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'signHere':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'signHereOptional':
        $('#newCustomTagInputLimit').hide();
        $('#maxCharacters').hide();
        $('#lines').hide();
        $('#charactersPerLine').hide();
        break;
      case 'signerAttachment':
        $('#newCustomTagInputLimit').show();
        $('#maxCharacters').show();
        $('#charactersPerLine').show();
        $('#lines').hide();
        break;
      case 'title':
        $('#newCustomTagInputLimit').show();
        $('#maxCharacters').hide();
        $('#charactersPerLine').show();
        $('#lines').hide();
        break;
      default:
        $('#newCustomTagInputLimit').show();
        $('#maxCharacters').show();
        $('#lines').show();
        $('#charactersPerLine').show();
        break;
    }

  }

  //Handler for Addvanced Div
  function handleAdvancedDiv(tagType) {

    switch (tagType) {
      case 'approve':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'checkBox':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'company':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'dateSigned':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'decline':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'list':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').hide();
        break;
      case 'emailAddress':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'envelopeId':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'firstName':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'formula':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'fullName':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'initialHere':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'initialHereOptional':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'lastName':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'note':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').show();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'radio':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'signHere':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'signHereOptional':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'signerAttachment':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      case 'title':
        $('#newCustomTagAdvanced').show();
        $('#includeNoteInEmailDiv').hide();
        $('#newCustomTagToolTipDiv').show();
        break;
      default:
        $('#newCustomTagAdvanced').show();
        $('#newCustomTagToolTipDiv').show();
        $('#anchorTextDiv').show();
        $('#includeNoteInEmailDiv').hide();
    }

  }
});
