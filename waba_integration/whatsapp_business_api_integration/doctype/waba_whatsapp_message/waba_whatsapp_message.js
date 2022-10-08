// Copyright (c) 2022, Hussain Nagaria and contributors
// For license information, please see license.txt

frappe.ui.form.on("WABA WhatsApp Message", {
  add_send_button: (frm) => {
    if (frm.doc.docstatus !== 1 || frm.doc.id) {
      return
    }
    let label = "Send Message";
    if (frm.doc.status == "Failure") {
      label = "Retry"
    }

    frm.add_custom_button(__(label), () => {
      frm.call({
        doc: frm.doc,
        method: "send",
        freeze: true,
        callback: () => frm.refresh()
      });
    });
  },
  refresh: function (frm) {
    frm.trigger("add_send_button");

    if (
      frm.doc.type === "Incoming" &&
      ["Image", "Video", "Audio", "Document"].includes(frm.doc.message_type) &&
      !frm.doc.media_file
    ) {
      const btn = frm.add_custom_button("Download Attachment File", () => {
        frm
          .call({
            doc: frm.doc,
            method: "download_media",
            btn,
          })
          .then((data) => {
            const file = data.message;
            frm.refresh();
            frappe.msgprint({
              title: "Attachment downloaded successfully.",
              message: `Attachment File: <a href="${file.file_url}" target="_blank">${file.file_name}</a>`,
              indicator: "green",
            });
          });
      });
    }

    if (frm.doc.preview_html) {
      let wrapper = frm.get_field("preview_html_rendered").$wrapper;
      wrapper.html(frm.doc.preview_html);
    }

    if (
      frm.doc.type === "Outgoing" &&
      frm.doc.media_file &&
      !frm.doc.media_uploaded
    ) {
      const btn = frm.add_custom_button("Upload Attachment File", () => {
        frm
          .call({
            doc: frm.doc,
            method: "upload_media",
            btn,
          })
          .then(() => {
            frm.refresh();
            frappe.msgprint({
              title: "Attachment uploaded successfully.",
              message: "You can send this message now!",
              indicator: "green",
            });
          });
      });
    }

    if (frm.doc.type === "Incoming" && frm.doc.status !== "Marked As Seen") {
      const btn = frm.add_custom_button("Mark As Seen", () => {
        frm
          .call({
            doc: frm.doc,
            method: "mark_as_seen",
            btn,
          })
          .then(() => frm.refresh());
      });
    }
  },
});
