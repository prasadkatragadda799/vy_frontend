# Google Sheets Troubleshooting Guide

## Current Status
- ✅ Website is sending data correctly
- ✅ Google Apps Script is deployed and active
- ❌ Data is not appearing in the spreadsheet

## The Problem
The data is being sent from the website, but it's not being saved to your Google Sheet. This is likely because the Apps Script cannot parse the incoming data correctly.

## Solution: Update Your Apps Script

### Step 1: Open Your Apps Script
1. Open your Google Spreadsheet
2. Click **Extensions → Apps Script**

### Step 2: Replace the Code
Delete everything and paste this EXACT code:

```javascript
function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('Received POST request');
    Logger.log('Content: ' + e.postData.contents);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Parse the JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      Logger.log('JSON Parse Error: ' + parseError.toString());
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Invalid JSON' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Create timestamp
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd-MMM-yyyy HH:mm:ss");
    
    // Get or create Donations sheet
    let sheet = ss.getSheetByName('Donations');
    
    if (!sheet) {
      Logger.log('Creating new Donations sheet');
      sheet = ss.insertSheet('Donations');
      sheet.appendRow([
        'Timestamp', 'Name', 'Phone', 'Amount (₹)', 'Transaction ID', 'Status'
      ]);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
    }
    
    // Add the donation data
    const rowData = [
      formattedDate,
      data.name || '',
      data.phone || '',
      data.amount || '',
      data.transactionId || 'Not provided',
      'Pending Verification'
    ];
    
    Logger.log('Adding row: ' + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    
    Logger.log('Row added successfully');
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Donation Handler Active!').setMimeType(ContentService.MimeType.TEXT);
}
```

### Step 3: Save and Deploy
1. Click **Save** (disk icon)
2. Click **Deploy → Manage deployments**
3. Click the **Edit** icon (pencil) next to your existing deployment
4. Under "Version", select **New version**
5. Click **Deploy**
6. **IMPORTANT**: Copy the new Web app URL if it changed

### Step 4: Check Execution Logs
1. In the Apps Script editor, click **Executions** (clock icon on the left sidebar)
2. Look for recent executions
3. Click on any execution to see the logs
4. You should see:
   - "Received POST request"
   - "Content: {your data}"
   - "Adding row: [...]"
   - "Row added successfully"

### Step 5: Test Again
1. Go back to your website
2. Submit a test donation
3. Wait 5 seconds
4. Refresh your Google Sheet
5. Check the "Donations" tab for the new row

## Common Issues

### Issue 1: "Cannot read property 'contents' of undefined"
**Solution**: The script isn't receiving POST data. Make sure:
- The deployment is set to "Execute as: Me"
- "Who has access" is set to "Anyone"

### Issue 2: "JSON Parse Error"
**Solution**: The data format is wrong. The website is sending the data correctly, so this shouldn't happen with the updated script.

### Issue 3: No executions appear in the log
**Solution**: The script isn't being triggered at all. This means:
- The URL in your website might be wrong
- The deployment isn't active

### Issue 4: Executions show but no data in sheet
**Solution**: Check the execution logs for errors. The script might be failing silently.

## Current Website Configuration

The website is configured to send data to:
```
https://script.google.com/macros/s/AKfycbxT19WjkobGbvd5PWvMg4HKDXcc6y3BYjhwGgzlvAKXn0zN3Iuqrz9cW4m5ZEzY9XS6/exec
```

Data format being sent:
```json
{
  "type": "donation",
  "name": "Test Name",
  "phone": "1234567890",
  "amount": "500",
  "transactionId": "TXN123",
  "submittedAt": "2026-02-07T11:00:00.000Z"
}
```

## Next Steps

After updating the script:
1. Submit a test donation from the website
2. Check the Executions log in Apps Script
3. Look for any error messages
4. Check if the data appears in your sheet

If you still don't see data, send me a screenshot of the Executions log and I'll help you debug further.
