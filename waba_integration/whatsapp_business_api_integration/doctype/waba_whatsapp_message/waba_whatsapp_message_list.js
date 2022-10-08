frappe.listview_settings['WABA WhatsApp Message'] = {
	get_indicator: function(doc) {
		var colors = {
			"Pending": "grey",
			"Sent": "blue",
			"Delivered": "lightgreen",
      "Read": "green",
      "Received": "darkgrey",
      "Marked As Seen": "darkgreen",
      "Failure": "red"
		};
		return [__(doc.status), colors[doc.status], "status,=," + doc.status];
	}
};
