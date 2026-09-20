# War Bot Web

This is the front-end web client for the grand strategy game called War Bot. 

## Brief Overview of War Bot
War Bot is a popular discord game bot that I have been developing since December 2023. It is a game where players run nations and conquer the map. Subsequent updates added different unit types, diplomacy, and more, and in-depth information about the bot can be found here: https://kushagra-pant.github.io/war-bot/ 

In 2026, I decided to create a web version of the bot. Using **Typescript** and **React** for the frontend, **Python FastAPI** for the backend, and **Supabase** for database, authentication, and realtime updates. Importantly, you would still be able to play the game using the discord bot, which would now be using the API as the source of truth.

## Technical Overview of War Bot Web
### Frontend

The frontend is built using:

<ul>
  <li> React — UI framework </li>
  <li> TypeScript — programming language </li>
  <li> PixiJS — map rendering and interaction </li>
  <li> Vite — development server and build tool </li>
  <li> Supabase Auth — user authentication </li>
</ul>

The frontend is responsible for displaying the game state and handling user interaction. Game logic is kept on the backend so that the web client and Discord bot use the same rules and game state.

### Backend

The frontend communicates with a separate FastAPI backend. The API is responsible for game logic, authentication and authorization, reading and modifying game state, communicating with the database, and providing data to both the web client and Discord bot.

### Database and Authentication

Supabase provides the underlying database for the game. The frontend does not directly access the game's database. Instead, authenticated requests are sent to the FastAPI API, which handles database access and game logic. The frontend does access Supabase for user authentication (logging in) and realtime updates, though there is extra security placed in the API and Supabase to ensure users only get access to what they are authorized for.
