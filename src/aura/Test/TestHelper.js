({
    onClick: function (component, event) 
    {
        
        var allValid = cmp.find('field').reduce(function (validSoFar, inputCmp) 
                                                {
                                                    inputCmp.showHelpMessageIfInvalid();
                                                    return validSoFar && inputCmp.get('v.validity').valid;
                                                }, true);
        if (allValid) 
        {
            alert('All form entries look valid. Ready to submit!');
        } else 
        {
            alert('Please update the invalid form entries and try again.');
        }
    },
    handleClick: function (component, event) {
        var address = cmp.find("myaddress");
        var isValid = address.checkValidity();
        if(isValid) {
            alert("Creating new address");
        }
        else {
            address.showHelpMessageIfInvalid();
        }
    } 
})