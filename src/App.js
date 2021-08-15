import "./App.css";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//import Typography from "@material-ui/core/Typography";
import { useAuth0 } from "@auth0/auth0-react";

//import TappyWindow from "./components/TappyWindow";

//import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/Create";
import Layout from "./components/Layout";
import ProtectedRoute from "./auth/protected-route";

function App() {

  const { isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <ProtectedRoute path="/create">
            <Create />
          </ProtectedRoute>
        </Switch>
      </Layout>
    </BrowserRouter>

  );
}

export default App;
