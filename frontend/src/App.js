import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LandingPage from "./screens/LandingPage/LandingPage";
import MyNotes from "./screens/MyNotes/MyNotes";
import SingleNote from "./screens/SingleNote/SingleNote";
import Contact from "./screens/MyNotes/Contact";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen/RegisterScreen";
import CreateNote from "./screens/SingleNote/CreateNote";
import { useState } from "react";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import Chat from "./chat/Chat"

function App() {
  const [search, setSearch] = useState("");

  return (
    <Router>
      <Header setSearch={(s) => setSearch(s)} />
      <main className="App">
        <Route path="/" component={LandingPage} exact />
        <Route path="/login" component={LoginScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route
          path="/home"
          component={({ history }) => (
            <MyNotes search={search} history={history} my={false}/>
          )}
        />
        <Route
          path="/myposts"
          component={({ history }) => (
            <MyNotes search={search} history={history} my={true}/>
          )}
        />
        <Route path="/chat" component={Chat} />
        <Route path="/note/:id" component={SingleNote} />
        <Route path="/createnote" component={CreateNote} />
        <Route path="/contact/:id" component={Contact} />
        <Route path="/profile" component={ProfileScreen} />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
