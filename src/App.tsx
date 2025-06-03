import { Suspense } from "react";
import { Route, Switch } from "wouter";
import Loader from "./components/Loader";
import { Login } from "./views/Login";
import Users from "./views/Users";
import Campaigns from "./views/Campaigns";

function App() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/log-in" component={Login} />
          <Route path="/users" component={Users} />
          <Route path="/admin/campaigns" component={Campaigns} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
