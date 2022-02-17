import mongoose from "mongoose";
import { fastify } from "fastify";

mongoose.connect("mongodb://localhost:27017");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

//fastify es6 connection

const fastifyApp = fastify({});
fastifyApp.listen(3001, (err, address) => {
  if (err) throw err;
  console.log(`server listening on ${address}`);
});

fastifyApp.get("/", async (request, reply) => {
  reply.send({ hello: "world" });
});

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

fastifyApp.post("/createuser", async (request, reply) => {
  const user = new User(request.body);
  user
    .save()
    .then(() => {
      reply.send({ message: "User created successfully" }, 200);
    })
    .catch((err) => {
      console.error({ ...err });
      reply.send({ message: "Error creating user", error: err.message }, 400); // 400 is bad request
    });
});

// User.create({
//   name: "John12",
//   username: "john12",
//   password: "password",
// }).then((user) => {
//   console.log(user);
// });

// import mongojs from "mongojs";
// const db = mongojs("mongodb://localhost:27017/lms");

// db.on("error", function (err) {
//   console.log("database error", err);
// });

// db.on("connect", function () {
//   console.log("database connected");
// });
