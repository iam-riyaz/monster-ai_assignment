import multer from "multer";
import express, { Request, Response } from "express";
import cors from "cors";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import {
  middleware,
  errorHandler,
  SessionRequest,
} from "supertokens-node/framework/express";
import { getWebsiteDomain, SuperTokensConfig } from "./config";
import Multitenancy from "supertokens-node/recipe/multitenancy";
import dotenv from "dotenv";
import { connectDB } from "./config/database.config";
import { User } from "./models/user.model";
import { fileURLToPath } from "url";
import path from "path";
import helmet from "helmet";
import { Post } from "./models/post.model";

supertokens.init(SuperTokensConfig);

export const app = express();
dotenv.config();

app.use(
  cors({
    origin: getWebsiteDomain(),
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

// This exposes all the APIs from SuperTokens to the client.
app.use(middleware());
app.use(express.json());

// // configuration------
// // const __filename = fileURLToPath("");
// // const __dirname = path.dirname(__filename);

// app.use(express.json({ limit: "30mb",  }));
// app.use(express.urlencoded({ limit: "30mb", extended: true }));
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// app.use(cors());
// app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// app.use(express.static("public"));

// An example API that requires session verification
app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
  let session = req.session;
  res.send({
    sessionHandle: session!.getHandle(),
    userId: session!.getUserId(),
    accessTokenPayload: session!.getAccessTokenPayload(),
  });
});

// This API is used by the frontend to create the tenants drop down when the app loads.
// Depending on your UX, you can remove this API.
app.get("/tenants", async (req, res) => {
  let tenants = await Multitenancy.listAllTenants();
  res.send(tenants);
});

app.post("/user", async (req: SessionRequest, res: Response) => {
  let user;
  try {
    let { userId } = req.session?.getUserId() || req.body;
    user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId });
    }
    res.status(200).send({ status: true, data: { userId } });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post(
  "/images",
  verifySession(),
  async (req: SessionRequest, res: Response) => {
    try {
      const { imagePath } = req.body;
      const { userId } = req.body;

      const post = await Post.create({
        userId,
        imagePath,
      });
      res.status(201).send({
        status: true,
        data: { post },
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

app.post(
  "/images/getall",
  verifySession(),
  async (req: SessionRequest, res: Response) => {
    try {
      const { userId } = req.body;

      const posts = await Post.find({ userId });

      res.status(200).send({
        status: true,
        data: { posts },
      });
    } catch (err) {
      res.status(500).send(err);
      console.log(err);
    }
  }
);

app.get("/images/:id",verifySession(), async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    res.status(200).send({
      status: true,
      data: { post },
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/images/:id",verifySession(), async (req,res)=>{

    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);
        res.status(200).send({
          status: true,
          data: { post },
        });
      } catch (err) {
        res.status(500).send(err);
      }

})

// In case of session related errors, this error handler
// returns 401 to the client.
app.use(errorHandler());

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API Server listening on port ${PORT}`));
});
