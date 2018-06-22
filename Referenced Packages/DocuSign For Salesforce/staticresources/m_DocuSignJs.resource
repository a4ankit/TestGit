// release dollar sign for other libraries possible
jQuery.noConflict();
// all docusign front end logic starts from document.loaded event
jQuery(document).ready(function($) {

    var ngScope = $("#dsContainer").scope();

    /*
     * Hide all pages.
     */
    function hideAll() {
        hideError();
        hideAddSigner();
        hideInstall();
        hideMobileLoading();
        hideEditEnvelope();
    }
    
    /*
     * Show Mobile Loading page.
     */
    function showMobileLoading() {
        $("#dsMobileLoading").show();
    };
    
    /*
     * Hide Mobile Loading page.
     */
    function hideMobileLoading() {
        $("#dsMobileLoading").hide();
    };

    /*
     * Show Edit Envelope page.
     */
    function showEditEnvelope() {
        hideAll();
        $('#dsEditEnvelope').show();      
    }
    
    /*
     * Hide Edit Envelope page.
     */
    function hideEditEnvelope() {
        $("#dsEditEnvelope").hide();
    }

    /*
     * Show Add Signer page.
     */
    function showAddSigner() {
        hideAll();
        $("#dsSignerName, #dsSignerEmail").val('');
        $("#dsAddSignerBtn").addClass('inactive');
        $('#dsAddSignerBtn').prop('disabled', true);          
        $("#dsAddSignerModal").show();
    };
    
    /*
     * Hide Add Signer page.
     */
    function hideAddSigner() {
        $("#dsAddSignerModal").hide();
    };   

    /*
     * Show Mobile App Install page.
     */
    function showInstall() {
        $('#dsInstall').show();
    }
    
    /*
     * Hide Mobile App Install page.
     */
    function hideInstall() {
        $('#dsInstall').hide();
    };

    /*
     * Show error page.
     * @param errorCode - errorCode from backend
     * @param errorDescription - description of error from backend
     * @param showAtTop - just show error at top of page
     */
    function showError(errorCode, errorDescription, showAtTop) { 
        if(!showAtTop) {
            hideAll();
        }
        var code = '';
        if(errorCode && errorCode != '') {
            code = ' ('+errorCode+')';
        }
        $("#dsAlert ul").empty().append('<li><p>'+errorDescription+code+'</p></li>');        
        $("#dsAlert").show();
        ngScope.scrollTo('dsContainer');
    };
    
    /*
     * Hide Error page.
     */
    function hideError() {
        $("#dsAlert").hide();
    };

    /*
     * This function to unescape all html special characters
     * @param str  the string to be modified
     */
    function unescapeHTMLSpecialCharacters(str) {
        return str.replace(/&quot;/g,'"').replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");
    }
    
    /**
     * All action button handlers
     */
    $('#docusignBtn').click(function(){
        console.log('DocuSign btn clicked.');
        console.log(ngScope);
        $('#docusignBtn').prop('disabled', true);
        $('#docusignBtn').addClass('inactive');
        if(ngScope.newDocOrders) {
            var docs = [];
            for(var i = 0; i < ngScope.newDocOrders.length; i++) {
                var docPos = parseInt(ngScope.newDocOrders[i].replace('doc-', '')) - 1;
                var doc = ngScope.docs[docPos];
                doc.order = (i + 1);
                delete doc.$$hashKey;
                docs.push(doc);
            }
            ngScope.docs = docs;
        } else {
            for(var i = 0; i < ngScope.docs.length; i++) {
                delete ngScope.docs[i].$$hashKey;
            }  
        }
        if(ngScope.newSignerOrders) {
            var signers = [];
            for(var i = 0; i < ngScope.newSignerOrders.length; i++) {
                var signerPos = parseInt(ngScope.newSignerOrders[i].replace('signer-', '')) - 1;
                var signer = ngScope.signers[signerPos];
                signer.routingOrder = (i + 1);
                delete signer.$$hashKey;
                signers.push(signer);
            }
            ngScope.signers = signers;
        } else {
            for(var i = 0; i < ngScope.signers.length; i++) {
                delete ngScope.signers[i].$$hashKey;
            }
        }
        var firstSigner = true;
        for(var i = 0; i < ngScope.signers.length; i++) {
            if(ngScope.signers[i].selected === true) {
                if(firstSigner === true) {
                    firstSigner = false;
                } else {
                    if(ngScope.signers[i].signerType !== 'email') {
                        showError('', dsGlobal.InPersonOptionError, true);
                        $('#docusignBtn').prop('disabled', false);
                        $('#docusignBtn').removeClass('inactive');                        
                        return;
                    } 
                }
            }
        }
        console.log(ngScope);
        showMobileLoading();
        try {
            Visualforce.remoting.Manager.invokeAction(
                dsGlobal.editDSEnvelopeRemoteAction,
                dsGlobal.objId,
                dsGlobal.dsEnvId,
                JSON.stringify(ngScope.docs),
                JSON.stringify(ngScope.signers), 
                function(result, event) {
                    console.log(result);
                    if (event.status) {
                        if (result == '') {
                            submitEnvelope();
                        } else {
                            showRemoteActionError(result);
                        }
                    } else {
                        showRemoteActionError(event.message);
                    }
                }
            );
        } catch (err) {
            showRemoteActionError(err.message);
        }        
    });
    
    /**
     * 
     */
    function submitEnvelope() {
        Visualforce.remoting.Manager.invokeAction(
            dsGlobal.submitEnvelopeRemoteAction,
            dsGlobal.objId,
            dsGlobal.dsEnvId,
            dsGlobal.deviceType,
            getUserAgent(),
            function(result, event) {
                console.log(result);
                if (event.status) {
                    var taggingUrl = decodeURIComponent(result);
                    if (taggingUrl.substring(0, 5) == 'https') {
                        showIframe(taggingUrl);
                    } else if (taggingUrl.substring(0, 11) == 'docusign-v1') {
                        sforce.one.navigateToURL(result);
                        setTimeout(function() { hideMobileLoading(); showInstall(); }, 10000);
                    } else {
                        hideMobileLoading();
                        if (result == '') {
                            sforce.one.navigateToSObject(dsGlobal.objId); // No Error
                        } else {
                            showRemoteActionError(result); // DocuSign Error...
                        }
                    }
                } else {
                    hideMobileLoading();
                    showRemoteActionError(event.message); // SF Remote Action Error...
                }
            },
            {escape: false}
        );
    }
    
    /**
     * 
     */
    function getURLParameter(parameterName, url) {
        return decodeURIComponent((new RegExp('[?|&]' + parameterName + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
    }
    
    /**
     * 
     */
    function getUserAgent() {
        return navigator.userAgent.toLowerCase();
    }
    
    /**
     * 
     */
    function showRemoteActionError(message) {
        $j("#errorDialog" ).bind({
            popupafterclose: function(event, ui) {
                sforce.one.navigateToSObject(dsGlobal.objId);
            }
        });
        $j('#errorMessge').html(message);
        $j("#errorDialog").show();
    }
    
    /**
     * Show Mobile App Install page.
     */
    function showInstall() {
        $j('#dsInstall').show();
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    }
    
    /**
     * Show Embedding (iframe) Tagger page.
     */
    function showIframe(taggingUrl) {
        hideAll();
        
        $j('#sendIframe').attr('src', taggingUrl);
        $j('#taggingDialog').show();
        
        $j('#sendIframe').load(function() {
            var dsUserAction = getURLParameter( "event", document.getElementById("sendIframe").contentWindow.location.href );
            if (dsUserAction) {
                if (dsUserAction == 'Send') {               
                    var envelopeId = getURLParameter( "envelopeId", document.getElementById("sendIframe").contentWindow.location.href );
                    Visualforce.remoting.Manager.invokeAction(
                        dsGlobal.signNowUrlRemoteAction,
                        dsGlobal.objId,
                        envelopeId,
                        function(result, event) {
                            console.log(result);
                            if (event.status) {
                                var signNowUrl = decodeURIComponent(result);
                                if (signNowUrl.substring(0, 5) == 'https' ) {
                                    $j('#signIframe').attr('src', signNowUrl);
                                    $j('#taggingDialog').hide();
                                    $j('#signingDialog').show();
                                    $j('#signIframe').load(function() {
                                        dsUserAction = getURLParameter( "event", document.getElementById("signIframe").contentWindow.location.href );
                                        if (dsUserAction) {
                                            sforce.one.navigateToSObject(dsGlobal.objId);
                                        }
                                    });
                                } else if (result == '') {
                                    sforce.one.navigateToSObject(dsGlobal.objId);
                                } else {
                                    showRemoteActionError(result); // DocuSign Error...
                                }
                            } else {
                                showRemoteActionError(event.message); // SF Remote Action Error...
                            }
                    });
                } else {
                    sforce.one.navigateToSObject(dsGlobal.objId);
                }
            }
        });
    }

    function hideInstall() {
        $j('#dsInstall').hide();
    };

    $('#addSignerBtn').click(function(){
        console.log('Add Signer btn clicked.');
        showAddSigner();
    });

    $('#dsCancelBtn').click(function(){
        console.log('Cancel btn clicked.');
        showEditEnvelope();
    });

    $('#dsSignerName, #dsSignerEmail').bind('keyup change', function() {
        if($('#dsSignerName').val() && $('#dsSignerEmail').val()) {
            $('#dsAddSignerBtn').removeClass('inactive');
            $('#dsAddSignerBtn').prop('disabled', false);
        } else {
            $('#dsAddSignerBtn').addClass('inactive');
            $('#dsAddSignerBtn').prop('disabled', true);
        }
    });

    $("#dsAddSignerBtn").click(function(){
        console.log('Add Signer btn clicked.');
        if(!/^([\w-\.+-]+@([\w-]+\.)+[\w-]{2,4})?$/.test($('#dsSignerEmail').val())) {
            showError('', dsGlobal.InvalidEmailError, true);
            return;
        }
        ngScope.signers.push({
            name: $('#dsSignerName').val(), 
            email: $('#dsSignerEmail').val(), 
            routingOrder: (ngScope.signers.length + 1).toString(),
            signerType: "email",
            selected: true
        });
        ngScope.$apply();
        ngScope.updateUI(ngScope.signers[ngScope.signers.length - 1]);
        showEditEnvelope();
    });

    $('#dsInstallInkBtn').click(function(){
        hideInstall();
        $('#docusignBtn').removeClass('inactive');
        $('#docusignBtn').prop('disabled', false);
        if(dsGlobal.device === 'apple') {
            sforce.one.navigateToURL(dsGlobal.DownloadiOSlUrl);
        } else {
            sforce.one.navigateToURL(dsGlobal.DownloadAndroidUrl);
        }
    });

    $('#dsDocsList').sortable({
        axis: 'y',
        opacity: 0.6,
        items: '> li',
        containment: 'document',
        placeholder: 'ui-placeholder',
        stop: function (event, ui) {
            ngScope.newDocOrders = $('#dsDocsList').sortable('toArray');
            console.log(ngScope.newDocOrders);
        }
    });

    $('#dsSingersList').sortable({
        axis: 'y',
        opacity: 0.6,
        items: '> li',
        containment: 'document',
        placeholder: 'ui-placeholder',
        stop: function (event, ui) {
            ngScope.newSignerOrders = $('#dsSingersList').sortable('toArray');
            console.log(ngScope.newSignerOrders);
        }
    });

    $('#dsDocsList, #dsSingersList').sortable('disable');
    $('#dsDocsList, #dsSingersList').disableSelection();

    $('#docusignBtn, #dsAddSignerBtn').prop('disabled', true);

    /* instantiate FastClick on the body */

    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);

    /* Unscape HTML Special Characters for Doc and Signer name */

    for(var i = 0; i < ngScope.docs.length; i++) {
        ngScope.docs[i].name = unescapeHTMLSpecialCharacters(ngScope.docs[i].name);
    }

    for(var i = 0; i < ngScope.signers.length; i++) {
        ngScope.signers[i].name = unescapeHTMLSpecialCharacters(ngScope.signers[i].name);
    }  

    showEditEnvelope();

    console.log(ngScope);
});