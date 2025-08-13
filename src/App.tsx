import { Suspense, type FC } from "react";
import { Route, Switch, Redirect } from "wouter";
import Loader from "./components/Loader";
import { Login } from "./views/Login";
import Users from "./views/Users";
import Groups from "./views/Groups";
import Pockets from "./views/Pockets";
import { isAuthenticated } from "./utils/IsAuthenticated";

type ProtectedRouteProps = {
  component: React.FC;
  path: string;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest}>
      {isAuthenticated() ? <Component /> : <Redirect to="/log-in" />}
    </Route>
  );
};

const App: FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/log-in">
          {isAuthenticated() ? <Redirect to="/admin/users" /> : <Login />}
        </Route>

        <ProtectedRoute path="/admin/users" component={Users}  />
        <ProtectedRoute path="/admin/groups" component={Groups} />
        <ProtectedRoute path="/admin/pockets" component={Pockets} />

        <Route path="*">
          {isAuthenticated() ? <Redirect to="/admin/users" /> : <Redirect to="/log-in" />}
        </Route>
      </Switch>
    </Suspense>
  );
};

export default App;
