import app from "./index.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const appenv = process.env.APP_ENV || 'quality';

const portDetails = {
  quality: process.env.PORT_QAS || 5502,
  production: process.env.PORT_PRD || 5501,
}
const port = portDetails[appenv] || 5502;

app.listen(port, () => {
  console.log(`Local API running at http://localhost:${port}`);
});
