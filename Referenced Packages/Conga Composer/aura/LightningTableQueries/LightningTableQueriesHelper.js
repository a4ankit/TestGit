({
	removeTableRow : function (rowIndexToRemove, cmp) {
		var rows = cmp.get("v.rowData");
		rows.splice(rowIndexToRemove, 1);
		cmp.set("v.rowData", rows);
	}
})