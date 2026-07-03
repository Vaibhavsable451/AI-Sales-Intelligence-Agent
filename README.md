# 🤖 AI Sales Intelligence Agent
### Multi-Agent AI Workflow using n8n, Groq LLM, SerpAPI & Automation



---

# 📌 Overview

AI Sales Intelligence Agent is an end-to-end automation workflow built with **n8n** that analyzes a company's website, researches the business, identifies pain points using multiple AI agents, generates personalized sales outreach emails, and automatically sends reports via Gmail, Google Sheets, and Slack.

The workflow combines web scraping, AI reasoning, automation, and CRM logging into a single pipeline.

---

# 🚀 Features

✅ Website Scraping

✅ HTML Extraction

✅ Company Research

✅ Pain Point Analysis

✅ AI Personalization

✅ AI Sales Copywriter

✅ HTML Report Generation

✅ Gmail Integration

✅ Google Sheets Logging

✅ Slack Notifications

✅ REST API Webhook

✅ Responsive Frontend Dashboard

---

# 🧠 AI Multi-Agent Architecture

```
                User
                  │
                  ▼
          n8n Webhook
                  │
                  ▼
        Website Scraper
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 HTML Extraction      Company Search
        │                   │
        └─────────┬─────────┘
                  ▼
        Merge Website Data
                  │
                  ▼
        Pain Point Agent
                  │
                  ▼
      Company Research Agent
                  │
                  ▼
      Personalization Agent
                  │
                  ▼
       Sales Copywriter Agent
                  │
                  ▼
         HTML Report Builder
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
 Gmail      Google Sheets     Slack
```

---

# ⚙ Workflow

## Step 1

Receive

- Company Name
- Website URL

↓

## Step 2

Scrape Website

Extract

- Title
- Description
- Body Text
- Tech Signals

↓

## Step 3

Search Company

Using

- SerpAPI

↓

## Step 4

Run AI Agents

### Agent 1

Pain Point Analysis

Outputs

- Website Weaknesses
- Missing Features
- Business Problems

---

### Agent 2

Company Research

Outputs

- Industry
- Company Summary

---

### Agent 3

Personalization

Generates

- Personalized Sales Pitch

---

### Agent 4

Sales Copywriter

Creates

- Subject Line
- Cold Email
- CTA

---

## Step 5

Generate HTML Report

↓

## Step 6

Deliver Report

- Gmail
- Google Sheets
- Slack

---

# 🖥 Frontend

Modern Dashboard includes

- Live Workflow
- Progress Bar
- AI Agent Status
- HTML Report Viewer
- Copy Email
- Download Report
- Responsive Design
- Dark Theme

---

# 📂 Project Structure

```
AI-Sales-Intelligence-Agent/

│

├── index.html

├── css/
│   ├── style.css
│   ├── dashboard.css
│   ├── responsive.css
│   └── animations.css

├── js/
│   ├── app.js
│   ├── api.js
│   ├── workflow.js
│   ├── ui.js
│   └── charts.js

├── assets/

├── workflow/
│   └── AI Sales Intelligence Agent.json

└── README.md
```

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript

## Automation

- n8n

## AI

- Groq API
- Llama 3.3 70B

## Search

- SerpAPI

## Integrations

- Gmail
- Slack
- Google Sheets

---

# 📊 Workflow Statistics

| Feature | Status |
|----------|--------|
| Website Scraping | ✅ |
| AI Analysis | ✅ |
| Company Research | ✅ |
| Personalized Email | ✅ |
| Gmail | ✅ |
| Google Sheets | ✅ |
| Slack | ✅ |

---

# 🔥 AI Agents

## 1️⃣ Pain Point Analysis Agent

Detects

- Weak CTA
- No Chatbot
- Poor SEO
- Outdated Design
- Slow Website

---

## 2️⃣ Company Research Agent

Researches

- Company
- Industry
- Recent News

---

## 3️⃣ Personalization Agent

Generates

- Personalized Sales Pitch

---

## 4️⃣ Sales Copywriter

Creates

- Email Subject
- Cold Email
- CTA

---

# 📧 Output

The workflow automatically generates

✔ Personalized Email

✔ HTML Report

✔ Lead Entry

✔ Slack Notification

---

# 📸 Screenshots

## Dashboard

_Add your screenshot here_

```
assets/dashboard.png
```

---

## Workflow

_Add your n8n workflow screenshot_

```
assets/workflow.png
```

---

# 🚀 Future Improvements

- OpenAI Support
- Claude Support
- Gemini Support
- CRM Integration
- HubSpot Integration
- Salesforce Integration
- Vector Database
- RAG Pipeline
- PDF Reports
- Docker Deployment
- Kubernetes Deployment

---

# 👨‍💻 Author

**Vaibhav Sable**

MCA Student

AI Engineer | Java Developer | GenAI | n8n Automation | Spring Boot | React

---

# ⭐ If you like this project

Give it a ⭐ on GitHub.

---

# 📜 License

MIT License

---

## 🙏 Acknowledgements

- n8n
- Groq
- SerpAPI
- Gmail API
- Slack API
- Google Sheets API
