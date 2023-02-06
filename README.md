# Stacc code challenge V2023

## Task Description
The task for the Stacc code challenge V2023 was:
>So in this task, we want you to create an application or service that can help consumers choose the power provider that is cheapest for them.

I decided to try to solve this by making an application that uses meter data from the user's electricity meter to determine the cheapest supplier in January.
The application was meant to do the following:
- Receive user meter data.
- Present summarized user data along with spot prices.
- Visualize the total price with different suppliers.
- Show the supplier that would be cheapest for you in January.

## How to run
The project can be found at: https://future-of-fintech-v2023-eight.vercel.app/

>Due to the connection to personal database, requires some setup to run it locally, but all necessary files have been included.
>Enter the following in the terminal
```bash
npm install
```
>Set up prisma with a postgres account by following step 2 here: https://vercel.com/guides/nextjs-prisma-postgres
>Skriv inn 
```bash
npm run dev
```

## Comments
I chose to try Next.js and React as I see this as a good opportunity to learn.
Due to time constraints the application has some limitations:
- Only works for January 2023.
- Only works for price area NO5.
- Does not have upload data verificaton.


### Things I would do differently:
- This is the first time I have used the React framework, my understanding of how to use "props", "states", etc. has developed along the way and is not always the best solution currently.
- I wouldn't have put user data in the database. With what I have learned along the way, I see that it is perfectly possible to move the data so that it follows the session.
- CSS and general presentation is an area I see that there is a lot of room for improvement.

### What I would do next:
- Add more electricity suppliers.
- Option to choose which electricity area you belong to.
- Option to show and hide graphs for different power companies.
- Present the user with an explanation of why it pays off with this specific supplier.
- Add data verification on upload.
- Streamline rendering of charts.