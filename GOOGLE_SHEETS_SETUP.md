# 📊 Google Sheets Integration for "Book Your Strategy Session"

Follow these simple steps to save all candidate session bookings directly into your Google Sheet in real-time.

---

### Step 1: Add / Update Google Apps Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Replace all code in `Code.gs` with this updated script:

```javascript
function doPost(e) {
  try {
    var data = e.parameter || {};
    
    // Parse JSON if sent as payload
    if (e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var key in parsed) {
          data[key] = parsed[key];
        }
      } catch(err) {}
    }
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var expectedHeaders = [
      "Timestamp",
      "Full Name",
      "Email Address",
      "Country",
      "Phone / WhatsApp",
      "Target Tech Role",
      "Years of Experience",
      "Preferred Time Slot",
      "Career Goals / Notes"
    ];

    // If sheet is empty, create headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
      sheet.getRange(1, 1, 1, expectedHeaders.length)
           .setFontWeight("bold")
           .setBackground("#7C3AED")
           .setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    } else {
      // Auto-detect if "Country" column is missing from existing sheet
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var hasCountry = headers.some(function(h) { 
        return h.toString().toLowerCase().indexOf("country") !== -1; 
      });
      
      if (!hasCountry) {
        // Automatically insert "Country" column between Email Address and Phone / WhatsApp
        sheet.insertColumnAfter(3);
        sheet.getRange(1, 4).setValue("Country").setFontWeight("bold").setBackground("#7C3AED").setFontColor("#FFFFFF");
      }
    }
    
    // Ensure phone is stored as text so leading '+' doesn't trigger formula #ERROR!
    var phone = (data.phone || "").toString().trim();
    if (phone.charAt(0) === '+') {
      phone = "'" + phone;
    }

    // Append the candidate data row in exact column order
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.country || "US",
      phone,
      data.role || "",
      data.experience || "",
      data.slot || "",
      data.notes || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** icon (disk icon).

---

### Step 2: Deploy New Version
1. Click **Deploy** > **Manage deployments**.
2. Click the **Pencil (Edit)** icon next to your active deployment.
3. In the **Version** dropdown, select **New version**.
4. Click **Deploy**.

---

### Step 3: Clean up Row 9 in Google Sheets
In your Google Sheet, simply right-click row `9` (the test row that had shifted columns) and click **Delete row**.
Now submit the booking form from your website again — each field will land in its exact corresponding column!
