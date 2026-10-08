import app from "./app.js";

const port = 3000;

app.listen(port, () => {
  console.log(`Job tracker API listening on ${port}`);
});
