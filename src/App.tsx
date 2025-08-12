import { Suspense, type FC } from "react";
import { Route, Switch, Redirect } from "wouter";
import Loader from "./components/Loader";
import { Login } from "./views/Login";
import Users from "./views/Users";
import Groups from "./views/Groups";
import Pockets from "./views/Pockets";


const App: FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem("USER"));

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/log-in" component={Login} />
        {isAuthenticated && (
          <>
            <Route path="/admin/users" component={Users} />
            <Route path="/admin/groups" component={Groups} />
            <Route path="/admin/pockets" component={Pockets} />
          </>
        )}
        {!isAuthenticated && <Redirect to="/log-in" />}
      </Switch>
    </Suspense>
  );
};

export default App;
