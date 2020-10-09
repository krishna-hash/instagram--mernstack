import React, { useState, useEffect } from "react";
import "./App.css";
import Ipost from "./Ipost.js";
import db, { auth } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import Uploads from "./Uploads";
import Flipmove from "react-flip-move";
import InstagramEmbed from "react-instagram-embed";
import axios from "./Axios";
import Pusher from "pusher-js";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [model] = useState(getModalStyle);
  const [post, setpost] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [user, setuser] = useState("");
  const [open, setopen] = useState(false);
  const [USER, SETUSER] = useState("");
  const [signin, setsignin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((auth) => {
      if (auth) {
        console.log(auth);
        SETUSER(auth);
      } else {
        SETUSER(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const fetch = async () => {
    await axios.get("/getups").then((res) => {
      console.log("ressponse", res.data);
      setpost(res.data);
    });
  };
  useEffect(() => {
    const pusher = new Pusher("b92b632cd98031c54be9", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("instadbs");
    channel.bind("inserted", (data) => {
      console.log("data>>>>>>", data);
      fetch();
    });
  }, []);
  useEffect(() => {
    fetch();
  }, [post]);

  const signup = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).then((auther) => {
      auther.user.updateProfile({
        displayName: user,
      });
    });
    setopen(false);
  };
  const signn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => console.log(err.message));

    setsignin(false);
  };
  return (
    <div className="app">
      <Modal open={open} onClose={() => setopen(false)}>
        <div style={model} className={classes.paper}>
          <form className="form">
            <center>
              <img
                className="image"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2016%2F05%2Finstagram-logo.png&f=1&nofb=1"
                width="100px"
                style={{ objectFit: "contain" }}
                alt="image"
              />
              <Input
                type="text"
                value={user}
                placeholder="Enter Username"
                autoComplete="off"
                onChange={(e) => setuser(e.target.value)}
              ></Input>
              <Input
                type="text"
                value={email}
                placeholder="Enter email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                type="password"
                value={password}
                autoComplete="off"
                placeholder="Enter password"
                onChange={(e) => setpassword(e.target.value)}
              ></Input>
            </center>
            <Button type="submit" onClick={signup}>
              sign up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={signin} onClose={() => setsignin(false)}>
        <div style={model} className={classes.paper}>
          <form className="form">
            <center>
              <img
                className="image"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2016%2F05%2Finstagram-logo.png&f=1&nofb=1"
                width="100px"
                style={{ objectFit: "contain" }}
                alt="image"
              />

              <Input
                type="text"
                value={email}
                placeholder="Enter email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                type="password"
                value={password}
                autoComplete="off"
                placeholder="Enter password"
                onChange={(e) => setpassword(e.target.value)}
              ></Input>
            </center>
            <Button type="submit" onClick={signn}>
              signin
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2a%2FInstagram_logo.svg%2F1200px-Instagram_logo.svg.png&f=1&nofb=1"
          alt="instagram"
          className="app_header_image"
          height="100px"
          width="100px"
          style={{ objectFit: "contain" }}
        />
        {USER ? (
          <Button className="button" onClick={() => auth.signOut()}>
            Logout
          </Button>
        ) : (
          <div>
            <Button className="button" onClick={() => setopen(true)}>
              sign up
            </Button>
            <Button onClick={() => setsignin(true)}>sign in</Button>
          </div>
        )}
      </div>

      <div className="app_info">
        <div className="app_left">
          <Flipmove>
            {post.map((post) => (
              <Ipost
                key={post._id}
                name={USER}
                postid={post._id}
                username={post.user}
                caption={post.caption}
                url={post.image}
              ></Ipost>
            ))}
          </Flipmove>
        </div>
        <div className="app_right">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      {USER?.displayName ? (
        <Uploads name={USER.displayName} />
      ) : (
        <h3>Please Login</h3>
      )}
    </div>
  );
}

export default App;
