# Personal Internship Tracker

A cute, full-stack web app designed for tracking internships. It keeps deadlines, interviews, companies, and more stored in one place. Built with React, TypeScript, and Supabase.

## Live Demo
[Try it out here!](https://internship-tracker-silk.vercel.app/)

## Features

* User sign-up, login, and logout
* Add, edit, delete, applications
* Filter applications by status
* Search by company, role, or location
* Application data sycned across devices and browsers
* Supabase Row Level Security

## Application Statuses

Applications can be tracked using statuses like:

* Saved
* Applied
* Technical Assessment
* Interview
* Rejected
* Offer

## Tech Stack

* React
* TypeScript
* Supabase
* Vite
* CSS
* Vercel

## Getting Started

Clone the repository:

```bash
git clone https://github.com/yumengwei88/internship-tracker.git
```

Go into the project folder:

```bash
cd internship-tracker
```

Install dependencies:

```bash
npm install
```
Create a .env file in the root of the project and add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Future Improvements

* Add separate page for account creation
* Add user profiles
* Sort applications by deadline or date added
* Add deadline reminders
* Add a dashboard with application stats
* Add confirmation message before application deletion

## Why I Built This

After trying out Google Sheets and other applications designed to track internships, none of them were quite what I was looking for. So, I decided to build one myself. This process was not easy, partly because I spent hours making aesthetic changes, but mostly because I challenged myself by adding features like filtering, searching, and browser storage. This was also my first time working with user authentication. It was challenging, but I gained invaluable experience from building it.
