import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./db/data-source";
import cron from "node-cron";
import { marketplaceRouter } from "./routes/marketplace.route";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "reflect-metadata";
import {
  initEventService,
  rebuildLostTransactions,
} from "./services/events.service";
dotenv.config();

const app: Express = express();
const { PORT, CRON_TIMER, CONTRACT_ADDRESS } = process.env;
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));
app.get("/healthcheck", (_: Request, res: Response) => res.sendStatus(200));
app.use("/v1", marketplaceRouter);

AppDataSource.initialize()
  .then(async () => {
    console.log("DB Initialized, now starting the server.");
    app.listen(PORT, async () => {
      console.log("rebuildLostTransactions");
      rebuildLostTransactions();
      console.log("init event service");
      initEventService();
      console.log(`Server is running at http://localhost:${PORT}`);
      // cron.schedule(CRON_TIMER, () => {
      //   console.log(
      //     `Updating Marketplace with Moralis, for wallet: \n ${CONTRACT_ADDRESS}`
      //   );
      //   updateListings(CONTRACT_ADDRESS);
      // });
    });
  })
  .catch((error) => console.log(error));
