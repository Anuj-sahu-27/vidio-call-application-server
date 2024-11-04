// // Import necessary modules
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware to parse JSON requests
// app.use(express.json());

// // Basic route to check server status
// app.get('/', (req, res) => {
//     res.send('Welcome to the Express server!');
// });

// // A simple JSON response route
// app.get('/api/message', (req, res) => {
//     res.json({ message: 'Hello from the API!' });
// });

// // Error handling middleware

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on :${PORT}`);
// });


// ***********************************************************************this is for webrtc testing***************************
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
   cors: { origin: "*" },
});

io.on("connection", (socket) => {
   console.log("New client connected:", socket.id);
   
   socket.emit("onconnect", socket.id); 
   // Handle initiating call
   socket.on("call-user", ({ receiverId, offer }) => {
      io.to(receiverId).emit("incoming-call", { senderId: socket.id, offer });
   });

   // Handle answering call
   socket.on("answer-call", ({ senderId, answer }) => {
      io.to(senderId).emit("call-answered", { answer });
   });

   // Handle ICE candidates
   socket.on("ice-candidate", ({ target, candidate }) => {
      io.to(target).emit("ice-candidate", { candidate });
   });

   // Handle ending call
   socket.on("reject-call", ({senderId}) => {
      console.log("sneder id  after call reject is - ",senderId)
      
      io.to(senderId).emit("call-ended");
   });

   //this is for end call 
    socket.on("end-call", ({ target }) => {
      console.log("end call triggered reciver id ",target)
      io.to(target).emit("call-ended");  // Notify the target to end the call
      socket.emit("call-ended");         // Notify the initiator to end the call
   });

   socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
   });
});

server.listen(5000, () => console.log("Server is running on port 5000"));
