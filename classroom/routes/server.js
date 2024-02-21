const express = require("express");
const app = express();

app.get("/",(req,res) => {
    res.send("Hi, I am root!");
});

//Index - users
app.get("/users", (req, res) =>  {
    res.send("GET for users");
})

//show - users
app.get("/users/:id", (req, res) => {
    res.send("GET for show users");
})

//post - users
app.get("/users", (req, res) => {
    res.send("POST for show users");
})


app.listen(3000, () => {
    console.log("server is listening to 3000");
});