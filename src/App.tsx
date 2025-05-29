import { Suspense } from "react";
import { Route, Switch } from "wouter";
import Loader from "./components/Loader";
import { Login } from "./views/Login";
import { Dashboard } from "./views/Dashboard";

function App() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/log-in" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
