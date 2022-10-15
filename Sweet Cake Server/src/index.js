import express from "express";
import { useRouter } from "./router.js";

const app = express();
const port = 3000;
app.use(express.json());
app.use("/assets", express.static("./static"));

useRouter(app);

app.listen(port, () => console.log(`Sweet Cake Server is running, listening on port ${port}!`));