import "./App.css";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//import Typography from "@material-ui/core/Typography";
import { useAuth0 } from "@auth0/auth0-react";

//import TappyWindow from "./components/TappyWindow";

//import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/Create";
import Note from "./pages/Note";
import Layout from "./components/Layout";
import ProtectedRoute from "./auth/protected-route";
import PleaseLogin from "./components/PleaseLogin";

import Loading from './components/Loading'

function App() {

  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) return <Loading/>;

  if (!isAuthenticated) return <PleaseLogin/>

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
          <ProtectedRoute path="/note">
            <Note />
          </ProtectedRoute>
        </Switch>
      </Layout>
    </BrowserRouter>

  );
}

export default App;
