import SuccessView from "./SuccessView";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import "./Home.css";
import Dashboard from "../Pages/Dashboard";
import  Navbar  from '../components/Navbar';

export default function Home() {
    const sessionContext = useSessionContext();

    if (sessionContext.loading === true) {
        return null;
    }

    return (
        <div className="fill" id="home-container">
            <Navbar/>
            {/* <SuccessView userId={sessionContext.userId} /> */}
            <Dashboard userId={sessionContext.userId} />
        </div>
    );
}
