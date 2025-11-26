import app from "./app.js"
import { connectDB } from "./db.js";
import { PORT, URI, TOKEN } from "./config.js"

connectDB(URI);

app.listen(PORT);

console.log("Server on port", PORT);