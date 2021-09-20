# socket-counter
A Web based synchronized counter using node.js ( express.js, socket.io ) and vue.js

First run `npm install` in both folders.

Add .env file to node folder with `MONGODB_URL`, `JWT_SECRET` and `PORT`.
Then run server with `npm start`.

Add .env file to vue folder with `VUE_APP_SOCKET_URI` which is your node server url and  `VUE_APP_LOCALES` which is format of date and time.
After that server your app in development mode with `npm run server` or build your app with `npm run build`.

PS:

  1. Note that you can change `src/components/counter.vue` and `Counter` model, (Make sure to update `updateCounter` and `resetCounts` emits to match your new structure)  for other structures of data.
  
  2. Also optimal number of counter is 3. if you changed it change `height-based` and `width-based` classes in `counter` component.
  
  (Main purpose of this project was to help in organizing dosage of vaccine used in one of covid-19 vaccination centers in Arak/Iran. So Stay Safe and Get Vaccinated)
