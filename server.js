const app = require("./index");
const connectDb = require("./services/database");

const PORT = process.env.PORT || 1337;

app.listen(PORT, async () => {
  console.log(`\nserver is listening, ${PORT}`);
  await connectDb()
    .then(el => console.log('Database connected\n'))
});