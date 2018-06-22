<aura:application controller="AccountHelper" extends="force:slds">
    <!--<c:LightningTable/>-->
    <aura:handler event="c:SearchKeyChange" action="{!c.searchKeyChange}"/>
    <aura:attribute type="Account[]" name="records" />
    <aura:attribute type="Boolean" name="sortAsc" />
    <aura:attribute type="String" name="sortField" />
    <aura:handler name="init" value="{!this}" action="{!c.doInit}" />
    <div class="slds-grid">
        <div class="slds-col slds-align-bottom" style="margin-top:10px">
            <c:SearchBarCam />
        </div>
    </div>
    <table>
        <tr>
            <td>
                <div>
                    <button class="slds-button slds-button--brand" onclick="{!c.downloadCsv}">Download As CSV</button> <br/><br/>
                </div>
            </td>
            <td>
                <div align="right">
                    <c:FileUpload />
                </div>
            </td>
        </tr>
    </table> 
    <div >
        <table class="slds-table slds-table_bordered slds-table_cell-buffer" >
            <thead class="slds-text-heading--label">
                <td ><b>S.No</b> </td>
                <td onclick="{!c.sortByName}"><b>Name</b>
                    <aura:if isTrue="{!v.sortField=='Name'}">
                        <span>
                            {!v.sortAsc ? '&#8593;' : '&#8595;'}
                        </span>
                    </aura:if>
                </td>
                <td><b>Phone</b> </td>
                <td><b>Billing City</b> </td>
                <td onclick="{!c.sortByAmount}"><b>Id</b>
                    <aura:if isTrue="{!v.sortField=='Name'}">
                        <span>
                            {!v.sortAsc ? '&#8593;' : '&#8595;'}
                        </span>
                    </aura:if>
                </td>
            </thead>
            <tbody>
                <aura:iteration items="{!v.records}" var="record" indexVar="index">
                    <tr class="slds-hint-parent">
                        <td>{!index+1}.</td>
                        <td>{!record.Name}</td>
                        <td>{!record.Phone}</td>
                        <td>{!record.BillingCity}</td>
                        <td>{!record.Id}</td>
                        <!--<td>            
                        <div>
                            <lightning:button >
                                <lightning:icon iconName="utility:chevrondown
                                                          " size="xx-small" alternativeText="Indicates approval"/>
                                <span class="slds-assistive-text">Show More</span>
                            </lightning:button>
                        </div>
                    </td>-->
                    </tr>
                </aura:iteration>
            </tbody>
        </table>
    </div>
</aura:application>