# 📊 Google Sheets Integration for "Book Your Strategy Session"

Follow these simple steps (takes 1-2 minutes) to save all session bookings directly into your Google Sheet in real-time.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it: **Bhuvix Technology — Strategy Sessions**

---

### Step 2: Add the Google Apps Script
1. In your Google Sheet, click **Extensions** in the top menu, then select **Apps Script**.
2. Delete any code inside `Code.gs` and paste the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;
    
    // Parse JSON if sent as payload
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {}
    }
    
    // Auto-create styled header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email Address",
        "Phone / WhatsApp",
        "Target Tech Role",
        "Years of Experience",
        "Preferred Time Slot",
        "Career Goals / Notes"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#7C3AED").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    // Append the candidate data row
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
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

### Step 3: Deploy as a Web App
1. At the top right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (Select type) > choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Bhuvix Booking Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial so candidate submissions are accepted)*
4. Click **Deploy**.
5. Click **Authorize access** (choose your Google account, click *Advanced* > *Go to Bhuvix Booking Webhook (unsafe)* > *Allow*).
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 4: Paste your URL in `js/main.js`
Open `js/main.js` line 4 and paste your URL:
```javascript
window.BHUVIX_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec";
```

That's it! Every time a visitor submits the "Book Your Strategy Session" modal on your website, a new row will instantly appear in your Google Sheet, and the candidate will receive the confirmation message.
