import { Suspense } from "react";
import { Route, Switch } from "wouter";
import Loader from "./components/Loader";
import { Login } from "./views/Login";
import Users from "./views/Users";
import Campaigns from "./views/Campaigns";
import Groups from "./views/Groups";
import Pockets from "./views/Pockets";

function App() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/log-in" component={Login} />
          <Route path="/admin/users" component={Users} />
          <Route path="/admin/groups" component={Groups} />
          <Route path="/admin/campaigns" component={Campaigns} />
          <Route path="/admin/pockets" component={Pockets} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
