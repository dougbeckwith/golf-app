import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddClub from "./pages/AddClub";
import Clubs from "./pages/Clubs";
import Club from "./pages/Club";
import EditClub from "./pages/EditClub";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Logout from "./pages/Logout";
import PrivateRoute from "./components/PrivateRoute";
import Forbidden from "./pages/Forbidden";
import Puts from "./pages/Puts";
import UnhandledError from "./pages/UnhandledError";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/clubs" element={<Layout />}>
            <Route index element={<Clubs />} />
            <Route path=":id" element={<Club />} />
            <Route path="new" element={<AddClub />} />
            <Route path=":id/edit" element={<EditClub />} />
          </Route>
          <Route path="/puts" element={<Layout />}>
            <Route index element={<Puts />} />
            <Route path="new" element={<AddClub />} />
          </Route>
        </Route>

        {/* public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/error" element={<UnhandledError />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* catch any non matching routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
