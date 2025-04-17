const exampleMails = [
  {
    "id": 1,
    "favorite": false,
    "from": "user1@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Wed, 12 Mar 2025 10:00:00 +0000",
    "messageId": "<msg1@example.com>",
    "inReplyTo": null,
    "references": null,
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": false
  },
  {
    "id": 2,
    "favorite": true,
    "from": "user2@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Thu, 13 Mar 2025 15:00:00 +0000",
    "messageId": "<msg2@example.com>",
    "inReplyTo": "<reply1@example.com>",
    "references": "<ref1@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 3,
    "favorite": false,
    "from": "user3@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Sat, 12 Apr 2025 01:00:00 +0000",
    "messageId": "<msg3@example.com>",
    "inReplyTo": "<reply2@example.com>",
    "references": "<ref2@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 4,
    "favorite": false,
    "from": "user4@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Fri, 28 Mar 2025 04:00:00 +0000",
    "messageId": "<msg4@example.com>",
    "inReplyTo": "<reply3@example.com>",
    "references": "<ref3@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 5,
    "favorite": false,
    "from": "user5@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Thu, 10 Apr 2025 18:00:00 +0000",
    "messageId": "<msg5@example.com>",
    "inReplyTo": "<reply4@example.com>",
    "references": "<ref4@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 6,
    "favorite": false,
    "from": "user6@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Sat, 08 Mar 2025 21:00:00 +0000",
    "messageId": "<msg6@example.com>",
    "inReplyTo": "<reply5@example.com>",
    "references": "<ref5@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 7,
    "favorite": false,
    "from": "user7@example.com",
    "to": "me@example.com",
    "subject": "Project Update",
    "date": "Mon, 31 Mar 2025 16:00:00 +0000",
    "messageId": "<msg7@example.com>",
    "inReplyTo": "<reply6@example.com>",
    "references": "<ref6@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 8,
    "favorite": true,
    "from": "user8@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Fri, 21 Mar 2025 06:00:00 +0000",
    "messageId": "<msg8@example.com>",
    "inReplyTo": "<reply7@example.com>",
    "references": "<ref7@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": false
  },
  {
    "id": 9,
    "favorite": false,
    "from": "user9@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Thu, 13 Mar 2025 11:00:00 +0000",
    "messageId": "<msg9@example.com>",
    "inReplyTo": "<reply8@example.com>",
    "references": "<ref8@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 10,
    "favorite": true,
    "from": "user10@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Wed, 19 Mar 2025 08:00:00 +0000",
    "messageId": "<msg10@example.com>",
    "inReplyTo": "<reply9@example.com>",
    "references": "<ref9@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": false
  },
  {
    "id": 11,
    "favorite": true,
    "from": "user11@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Thu, 27 Mar 2025 05:00:00 +0000",
    "messageId": "<msg11@example.com>",
    "inReplyTo": "<reply10@example.com>",
    "references": "<ref10@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 12,
    "favorite": true,
    "from": "user12@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Thu, 10 Apr 2025 06:00:00 +0000",
    "messageId": "<msg12@example.com>",
    "inReplyTo": "<reply11@example.com>",
    "references": "<ref11@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 13,
    "favorite": false,
    "from": "user13@example.com",
    "to": "me@example.com",
    "subject": "Project Update",
    "date": "Tue, 08 Apr 2025 06:00:00 +0000",
    "messageId": "<msg13@example.com>",
    "inReplyTo": "<reply12@example.com>",
    "references": "<ref12@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 14,
    "favorite": false,
    "from": "user14@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Fri, 28 Mar 2025 17:00:00 +0000",
    "messageId": "<msg14@example.com>",
    "inReplyTo": "<reply13@example.com>",
    "references": "<ref13@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 15,
    "favorite": true,
    "from": "user15@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Sun, 16 Mar 2025 20:00:00 +0000",
    "messageId": "<msg15@example.com>",
    "inReplyTo": "<reply14@example.com>",
    "references": "<ref14@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 16,
    "favorite": true,
    "from": "user16@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Wed, 19 Mar 2025 15:00:00 +0000",
    "messageId": "<msg16@example.com>",
    "inReplyTo": "<reply15@example.com>",
    "references": "<ref15@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 17,
    "favorite": false,
    "from": "user17@example.com",
    "to": "me@example.com",
    "subject": "Project Update",
    "date": "Wed, 09 Apr 2025 05:00:00 +0000",
    "messageId": "<msg17@example.com>",
    "inReplyTo": "<reply16@example.com>",
    "references": "<ref16@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 18,
    "favorite": true,
    "from": "user18@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Thu, 20 Mar 2025 19:00:00 +0000",
    "messageId": "<msg18@example.com>",
    "inReplyTo": "<reply17@example.com>",
    "references": "<ref17@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 19,
    "favorite": false,
    "from": "user19@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Wed, 16 Apr 2025 07:00:00 +0000",
    "messageId": "<msg19@example.com>",
    "inReplyTo": "<reply18@example.com>",
    "references": "<ref18@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 20,
    "favorite": true,
    "from": "user20@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Sun, 23 Mar 2025 13:00:00 +0000",
    "messageId": "<msg20@example.com>",
    "inReplyTo": "<reply19@example.com>",
    "references": "<ref19@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 21,
    "favorite": true,
    "from": "user21@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Sun, 30 Mar 2025 08:00:00 +0000",
    "messageId": "<msg21@example.com>",
    "inReplyTo": "<reply20@example.com>",
    "references": "<ref20@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": true
  },
  {
    "id": 22,
    "favorite": true,
    "from": "user22@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Sun, 13 Apr 2025 03:00:00 +0000",
    "messageId": "<msg22@example.com>",
    "inReplyTo": "<reply21@example.com>",
    "references": "<ref21@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 23,
    "favorite": false,
    "from": "user23@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Tue, 01 Apr 2025 23:00:00 +0000",
    "messageId": "<msg23@example.com>",
    "inReplyTo": "<reply22@example.com>",
    "references": "<ref22@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 24,
    "favorite": true,
    "from": "user24@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Sun, 09 Mar 2025 02:00:00 +0000",
    "messageId": "<msg24@example.com>",
    "inReplyTo": "<reply23@example.com>",
    "references": "<ref23@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 25,
    "favorite": false,
    "from": "user25@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Sun, 30 Mar 2025 21:00:00 +0000",
    "messageId": "<msg25@example.com>",
    "inReplyTo": "<reply24@example.com>",
    "references": "<ref24@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 26,
    "favorite": false,
    "from": "user26@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Mon, 24 Mar 2025 06:00:00 +0000",
    "messageId": "<msg26@example.com>",
    "inReplyTo": "<reply25@example.com>",
    "references": "<ref25@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 27,
    "favorite": false,
    "from": "user27@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Mon, 31 Mar 2025 21:00:00 +0000",
    "messageId": "<msg27@example.com>",
    "inReplyTo": "<reply26@example.com>",
    "references": "<ref26@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 28,
    "favorite": false,
    "from": "user28@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Sat, 15 Mar 2025 13:00:00 +0000",
    "messageId": "<msg28@example.com>",
    "inReplyTo": "<reply27@example.com>",
    "references": "<ref27@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 29,
    "favorite": true,
    "from": "user29@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Mon, 17 Mar 2025 18:00:00 +0000",
    "messageId": "<msg29@example.com>",
    "inReplyTo": "<reply28@example.com>",
    "references": "<ref28@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 30,
    "favorite": true,
    "from": "user30@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Tue, 11 Mar 2025 06:00:00 +0000",
    "messageId": "<msg30@example.com>",
    "inReplyTo": "<reply29@example.com>",
    "references": "<ref29@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": true
  },
  {
    "id": 31,
    "favorite": false,
    "from": "user31@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Fri, 14 Mar 2025 00:00:00 +0000",
    "messageId": "<msg31@example.com>",
    "inReplyTo": "<reply30@example.com>",
    "references": "<ref30@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 32,
    "favorite": false,
    "from": "user32@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Tue, 08 Apr 2025 23:00:00 +0000",
    "messageId": "<msg32@example.com>",
    "inReplyTo": "<reply31@example.com>",
    "references": "<ref31@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": false
  },
  {
    "id": 33,
    "favorite": false,
    "from": "user33@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Wed, 16 Apr 2025 17:00:00 +0000",
    "messageId": "<msg33@example.com>",
    "inReplyTo": "<reply32@example.com>",
    "references": "<ref32@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 34,
    "favorite": true,
    "from": "user34@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Tue, 01 Apr 2025 00:00:00 +0000",
    "messageId": "<msg34@example.com>",
    "inReplyTo": "<reply33@example.com>",
    "references": "<ref33@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": true
  },
  {
    "id": 35,
    "favorite": false,
    "from": "user35@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Sat, 05 Apr 2025 03:00:00 +0000",
    "messageId": "<msg35@example.com>",
    "inReplyTo": "<reply34@example.com>",
    "references": "<ref34@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 36,
    "favorite": false,
    "from": "user36@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Mon, 17 Mar 2025 13:00:00 +0000",
    "messageId": "<msg36@example.com>",
    "inReplyTo": "<reply35@example.com>",
    "references": "<ref35@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": false
  },
  {
    "id": 37,
    "favorite": true,
    "from": "user37@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Wed, 12 Mar 2025 18:00:00 +0000",
    "messageId": "<msg37@example.com>",
    "inReplyTo": "<reply36@example.com>",
    "references": "<ref36@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 38,
    "favorite": true,
    "from": "user38@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Sat, 05 Apr 2025 14:00:00 +0000",
    "messageId": "<msg38@example.com>",
    "inReplyTo": "<reply37@example.com>",
    "references": "<ref37@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": false
  },
  {
    "id": 39,
    "favorite": false,
    "from": "user39@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Sun, 30 Mar 2025 19:00:00 +0000",
    "messageId": "<msg39@example.com>",
    "inReplyTo": "<reply38@example.com>",
    "references": "<ref38@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 40,
    "favorite": false,
    "from": "user40@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Fri, 04 Apr 2025 15:00:00 +0000",
    "messageId": "<msg40@example.com>",
    "inReplyTo": "<reply39@example.com>",
    "references": "<ref39@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": false
  },
  {
    "id": 41,
    "favorite": false,
    "from": "user41@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Sun, 09 Mar 2025 09:00:00 +0000",
    "messageId": "<msg41@example.com>",
    "inReplyTo": "<reply40@example.com>",
    "references": "<ref40@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 42,
    "favorite": false,
    "from": "user42@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Fri, 07 Mar 2025 11:00:00 +0000",
    "messageId": "<msg42@example.com>",
    "inReplyTo": "<reply41@example.com>",
    "references": "<ref41@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 43,
    "favorite": true,
    "from": "user43@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Mon, 17 Mar 2025 13:00:00 +0000",
    "messageId": "<msg43@example.com>",
    "inReplyTo": "<reply42@example.com>",
    "references": "<ref42@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 44,
    "favorite": true,
    "from": "user44@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Thu, 10 Apr 2025 22:00:00 +0000",
    "messageId": "<msg44@example.com>",
    "inReplyTo": "<reply43@example.com>",
    "references": "<ref43@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": true
  },
  {
    "id": 45,
    "favorite": true,
    "from": "user45@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Wed, 09 Apr 2025 08:00:00 +0000",
    "messageId": "<msg45@example.com>",
    "inReplyTo": "<reply44@example.com>",
    "references": "<ref44@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": true
  },
  {
    "id": 46,
    "favorite": false,
    "from": "user46@example.com",
    "to": "me@example.com",
    "subject": "Project Update",
    "date": "Sat, 12 Apr 2025 08:00:00 +0000",
    "messageId": "<msg46@example.com>",
    "inReplyTo": "<reply45@example.com>",
    "references": "<ref45@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 47,
    "favorite": false,
    "from": "user47@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Thu, 20 Mar 2025 23:00:00 +0000",
    "messageId": "<msg47@example.com>",
    "inReplyTo": "<reply46@example.com>",
    "references": "<ref46@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": false
  },
  {
    "id": 48,
    "favorite": false,
    "from": "user48@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Fri, 04 Apr 2025 06:00:00 +0000",
    "messageId": "<msg48@example.com>",
    "inReplyTo": "<reply47@example.com>",
    "references": "<ref47@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": true
  },
  {
    "id": 49,
    "favorite": false,
    "from": "user49@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Fri, 21 Mar 2025 19:00:00 +0000",
    "messageId": "<msg49@example.com>",
    "inReplyTo": "<reply48@example.com>",
    "references": "<ref48@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 50,
    "favorite": true,
    "from": "user50@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Wed, 19 Mar 2025 17:00:00 +0000",
    "messageId": "<msg50@example.com>",
    "inReplyTo": "<reply49@example.com>",
    "references": "<ref49@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": false
  },
  {
    "id": 51,
    "favorite": false,
    "from": "user51@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Sat, 22 Mar 2025 12:00:00 +0000",
    "messageId": "<msg51@example.com>",
    "inReplyTo": "<reply50@example.com>",
    "references": "<ref50@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 52,
    "favorite": false,
    "from": "user52@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Sun, 09 Mar 2025 23:00:00 +0000",
    "messageId": "<msg52@example.com>",
    "inReplyTo": "<reply51@example.com>",
    "references": "<ref51@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": true
  },
  {
    "id": 53,
    "favorite": false,
    "from": "user53@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Mon, 10 Mar 2025 23:00:00 +0000",
    "messageId": "<msg53@example.com>",
    "inReplyTo": "<reply52@example.com>",
    "references": "<ref52@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 54,
    "favorite": false,
    "from": "user54@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Tue, 25 Mar 2025 03:00:00 +0000",
    "messageId": "<msg54@example.com>",
    "inReplyTo": "<reply53@example.com>",
    "references": "<ref53@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 55,
    "favorite": true,
    "from": "user55@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Mon, 24 Mar 2025 20:00:00 +0000",
    "messageId": "<msg55@example.com>",
    "inReplyTo": "<reply54@example.com>",
    "references": "<ref54@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 56,
    "favorite": false,
    "from": "user56@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Wed, 16 Apr 2025 21:00:00 +0000",
    "messageId": "<msg56@example.com>",
    "inReplyTo": "<reply55@example.com>",
    "references": "<ref55@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 57,
    "favorite": true,
    "from": "user57@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Sat, 15 Mar 2025 20:00:00 +0000",
    "messageId": "<msg57@example.com>",
    "inReplyTo": "<reply56@example.com>",
    "references": "<ref56@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 58,
    "favorite": false,
    "from": "user58@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Mon, 14 Apr 2025 14:00:00 +0000",
    "messageId": "<msg58@example.com>",
    "inReplyTo": "<reply57@example.com>",
    "references": "<ref57@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 59,
    "favorite": true,
    "from": "user59@example.com",
    "to": "me@example.com",
    "subject": "Vacation Notice",
    "date": "Sat, 15 Mar 2025 02:00:00 +0000",
    "messageId": "<msg59@example.com>",
    "inReplyTo": "<reply58@example.com>",
    "references": "<ref58@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 60,
    "favorite": false,
    "from": "user60@example.com",
    "to": "me@example.com",
    "subject": "Project Update",
    "date": "Thu, 20 Mar 2025 04:00:00 +0000",
    "messageId": "<msg60@example.com>",
    "inReplyTo": "<reply59@example.com>",
    "references": "<ref59@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 61,
    "favorite": false,
    "from": "user61@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Wed, 26 Mar 2025 21:00:00 +0000",
    "messageId": "<msg61@example.com>",
    "inReplyTo": "<reply60@example.com>",
    "references": "<ref60@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": false
  },
  {
    "id": 62,
    "favorite": false,
    "from": "user62@example.com",
    "to": "me@example.com",
    "subject": "Project Update",
    "date": "Sat, 05 Apr 2025 01:00:00 +0000",
    "messageId": "<msg62@example.com>",
    "inReplyTo": "<reply61@example.com>",
    "references": "<ref61@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 63,
    "favorite": false,
    "from": "user63@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Tue, 18 Mar 2025 05:00:00 +0000",
    "messageId": "<msg63@example.com>",
    "inReplyTo": "<reply62@example.com>",
    "references": "<ref62@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": false
  },
  {
    "id": 64,
    "favorite": true,
    "from": "user64@example.com",
    "to": "me@example.com",
    "subject": "Project Update",
    "date": "Mon, 24 Mar 2025 18:00:00 +0000",
    "messageId": "<msg64@example.com>",
    "inReplyTo": "<reply63@example.com>",
    "references": "<ref63@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": false
  },
  {
    "id": 65,
    "favorite": true,
    "from": "user65@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Wed, 19 Mar 2025 00:00:00 +0000",
    "messageId": "<msg65@example.com>",
    "inReplyTo": "<reply64@example.com>",
    "references": "<ref64@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": false
  },
  {
    "id": 66,
    "favorite": false,
    "from": "user66@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Mon, 14 Apr 2025 12:00:00 +0000",
    "messageId": "<msg66@example.com>",
    "inReplyTo": "<reply65@example.com>",
    "references": "<ref65@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [],
    "viewed": true
  },
  {
    "id": 67,
    "favorite": true,
    "from": "user67@example.com",
    "to": "me@example.com",
    "subject": "Greetings!",
    "date": "Fri, 21 Mar 2025 00:00:00 +0000",
    "messageId": "<msg67@example.com>",
    "inReplyTo": "<reply66@example.com>",
    "references": "<ref66@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": true
  },
  {
    "id": 68,
    "favorite": false,
    "from": "user68@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Sun, 30 Mar 2025 19:00:00 +0000",
    "messageId": "<msg68@example.com>",
    "inReplyTo": "<reply67@example.com>",
    "references": "<ref67@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 69,
    "favorite": false,
    "from": "user69@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Fri, 21 Mar 2025 17:00:00 +0000",
    "messageId": "<msg69@example.com>",
    "inReplyTo": "<reply68@example.com>",
    "references": "<ref68@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "invoice.docx",
        "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 51200
      }
    ],
    "viewed": false
  },
  {
    "id": 70,
    "favorite": true,
    "from": "user70@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Fri, 28 Mar 2025 18:00:00 +0000",
    "messageId": "<msg70@example.com>",
    "inReplyTo": "<reply69@example.com>",
    "references": "<ref69@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": false
  },
  {
    "id": 71,
    "favorite": true,
    "from": "user71@example.com",
    "to": "me@example.com",
    "subject": "Important Info",
    "date": "Thu, 20 Mar 2025 14:00:00 +0000",
    "messageId": "<msg71@example.com>",
    "inReplyTo": "<reply70@example.com>",
    "references": "<ref70@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": false
  },
  {
    "id": 72,
    "favorite": false,
    "from": "user72@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Sun, 06 Apr 2025 03:00:00 +0000",
    "messageId": "<msg72@example.com>",
    "inReplyTo": "<reply71@example.com>",
    "references": "<ref71@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": true
  },
  {
    "id": 73,
    "favorite": true,
    "from": "user73@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Thu, 10 Apr 2025 02:00:00 +0000",
    "messageId": "<msg73@example.com>",
    "inReplyTo": "<reply72@example.com>",
    "references": "<ref72@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "I'll be on vacation next week.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 74,
    "favorite": true,
    "from": "user74@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Sat, 05 Apr 2025 04:00:00 +0000",
    "messageId": "<msg74@example.com>",
    "inReplyTo": "<reply73@example.com>",
    "references": "<ref73@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": true
  },
  {
    "id": 75,
    "favorite": true,
    "from": "user75@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Thu, 17 Apr 2025 13:00:00 +0000",
    "messageId": "<msg75@example.com>",
    "inReplyTo": "<reply74@example.com>",
    "references": "<ref74@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [],
    "viewed": false
  },
  {
    "id": 76,
    "favorite": true,
    "from": "user76@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Thu, 20 Mar 2025 09:00:00 +0000",
    "messageId": "<msg76@example.com>",
    "inReplyTo": "<reply75@example.com>",
    "references": "<ref75@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "The project deadline has been updated.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": true
  },
  {
    "id": 77,
    "favorite": false,
    "from": "user77@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Tue, 08 Apr 2025 01:00:00 +0000",
    "messageId": "<msg77@example.com>",
    "inReplyTo": "<reply76@example.com>",
    "references": "<ref76@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Please review the attached documents.",
    "attachments": [
      {
        "filename": "image.png",
        "contentType": "image/png",
        "size": 102400
      }
    ],
    "viewed": false
  },
  {
    "id": 78,
    "favorite": false,
    "from": "user78@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Sun, 09 Mar 2025 22:00:00 +0000",
    "messageId": "<msg78@example.com>",
    "inReplyTo": "<reply77@example.com>",
    "references": "<ref77@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Don't forget our meeting at 4 PM.",
    "attachments": [
      {
        "filename": "agenda.pdf",
        "contentType": "application/pdf",
        "size": 204800
      }
    ],
    "viewed": false
  },
  {
    "id": 79,
    "favorite": true,
    "from": "user79@example.com",
    "to": "me@example.com",
    "subject": "Invoice Due",
    "date": "Sat, 12 Apr 2025 23:00:00 +0000",
    "messageId": "<msg79@example.com>",
    "inReplyTo": "<reply78@example.com>",
    "references": "<ref78@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Your invoice is due tomorrow.",
    "attachments": [
      {
        "filename": "report.xlsx",
        "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 307200
      }
    ],
    "viewed": false
  },
  {
    "id": 80,
    "favorite": false,
    "from": "user80@example.com",
    "to": "me@example.com",
    "subject": "Meeting Reminder",
    "date": "Wed, 12 Mar 2025 04:00:00 +0000",
    "messageId": "<msg80@example.com>",
    "inReplyTo": "<reply79@example.com>",
    "references": "<ref79@example.com>",
    "contentType": "text/plain; charset=utf-8",
    "content": "Hope you're having a great day!",
    "attachments": [],
    "viewed": true
  }
];

export default exampleMails;