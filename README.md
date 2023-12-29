# Upfesto

This project is a web-based event management application developed using Next.js 14, Server Actions, React, Prisma, Tailwind, and MySQL.

*Showcase of Upfesto event page*
![Event page showcase](https://upfesto.com/pictures/showcase.png "Showcase of Upfesto event page")

Key features:
1. **Event Creation and Management**: Users can create, update, and delete events. Each event includes details such as title, start and end dates and times, location, and description.
2. **Location Search and Map**: The application utilizes Google Maps API to allow users to search for event locations and view the location on a map, visually representing the event's location.
4. **User Authentication and Profile Management**: The application uses Clerk for user authentication, ensuring secure access to event data. Users can also manage their profiles, updating personal information and preferences as needed. 
5. **Attendance Tracking**: This feature allows event organizers to track attendance at their events. Users can RSVP to events, and their attendance status is tracked and displayed in the application.
6. **Calendar Integration**: Events can be integrated with user's personal calendars. This allows users to easily view their upcoming events and ensures they don't miss any important dates.
7. **Posts and Email notifications**: Event hosts can create posts within the event to inform their attendees about updates. The application also includes an email notification system using the Resend package, alerting users of new posts or any important changes to events they're attending.
8. **Image Upload**: Users can personalize their event pages by uploading their own cover images.
9. **Form Validation and Error Handling**: The application follows best practices in web development, including form validation and error handling. This ensures data integrity and provides a user-friendly experience.
10. **Dashboard**:  A one-stop dashboard for users to oversee and manage their events with ease. It offers sorting and filtering functionalities for enhanced event organization.
11. **Landing Page**: The landing page introduces users to the application, highlighting its features and offering a snapshot of what they can expect. 

Upfesto uses Prisma as an ORM for interacting with the MySQL database. The user interface is built using shadcnUI and TailwindCSS for a modern and responsive design.

To learn more about the business background of the project, see [`upfesto.com/about`](https://upfesto.com/about).

## Deployment 

The project is deployed using Vercel at [`upfesto.com`](https://upfesto.com/). 

## Prerequisites

Node version 18.x.x

## Cloning the repository

```bash
git clone https://github.com/MalaRuze/upfesto.git
```
## Install packages

```bash
npm i
```

## Setup .env file
```bash
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAP_ID=

RESEND_API_KEY=
```
## Setup Prisma
Add MySQL Database(This project uses PlanetScale}

```bash
npx prisma generate
npx prisma db push
```
## Star the app
```bash
npm run dev
```

