import 'dotenv/config'; 
import app from "./src/app.js";
import { initDB } from "./src/db/pool.js";

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log("Server starting on port: " + port);
  await initDB();
});