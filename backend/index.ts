import express from "express";
import cors from "cors";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { middleware, errorHandler, SessionRequest } from "supertokens-node/framework/express";
import { getWebsiteDomain, SuperTokensConfig } from "./config";
import Multitenancy from "supertokens-node/recipe/multitenancy";
import dotenv from "dotenv"
import { connectDB } from "./config/database.config";

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

app.get("/images", async (req,res)=>{

} )

app.get("/images/:id", async (req,res)=>{
    
} )

app.post("/images", async (req,res)=>{
    
} )

// In case of session related errors, this error handler
// returns 401 to the client.
app.use(errorHandler());

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`API Server listening on port ${PORT}`));

})
