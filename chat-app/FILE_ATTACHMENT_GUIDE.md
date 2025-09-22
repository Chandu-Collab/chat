# File Attachment System

## Overview
The enhanced "+" button now provides a dropdown menu with different file type options that the AI can recognize and respond to appropriately.

## Features

### File Type Options
When users click the "+" button, they see options for:

1. **📷 Image** (JPG, PNG, GIF, WebP)
   - AI Response: "I've attached an image file. Please analyze and describe what you see in this image."

2. **📄 PDF** (PDF documents)
   - AI Response: "I've attached a PDF document. Please read and summarize the key points from this document."

3. **📊 Spreadsheet** (Excel, CSV files)
   - AI Response: "I've attached a spreadsheet file. Please analyze the data and provide insights about the information contained."

4. **📝 Documents** (Word, Text files)
   - AI Response: "I've attached a document file. Please read and summarize the main content and key points."

### User Experience
- Click the "+" button to see file type options
- Select the appropriate file type
- Choose your file from the file picker
- See file preview with name and size
- AI automatically receives context about the file type
- Send button activates when either text or file is ready

### AI Context
The system automatically provides context to the AI about:
- File name and type
- Appropriate instructions for analysis
- File size information
- Specific analysis requests based on file type

### Visual Feedback
- "+" button rotates 45° when dropdown is open
- File preview shows name, size, and type
- Color-coded icons for different file types:
  - 🟢 Green for images
  - 🔴 Red for PDFs  
  - 🔵 Blue for spreadsheets
  - 🟣 Purple for documents

### Smart Send Button
The send button now activates when:
- User types a message (existing behavior)
- User attaches a file (new behavior)
- Both message and file are present

### File Context Messages
Each file type gets a specialized prompt:
- **Images**: Ask for visual analysis and description
- **PDFs**: Request document summarization
- **Spreadsheets**: Ask for data analysis and insights
- **Documents**: Request content summary and key points

## Implementation
- `FileAttachment` component handles dropdown and file selection
- `MessageInput` component integrated with file attachment
- AI service receives enhanced messages with file context
- Visual feedback throughout the selection process

This creates a professional file handling experience where the AI knows exactly what type of analysis to perform based on the file type selected.