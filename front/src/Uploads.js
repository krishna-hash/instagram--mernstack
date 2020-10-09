import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import db, { storage } from "./Firebase";
import firebase from "firebase";
import "./image.css";
import axios from "./Axios";

function Uploads({ name }) {
  const [image, setimage] = useState(null);
  const [progress, setprogress] = useState("");
  const [caption, setcaption] = useState("");
  const upload = (e) => {
    e.preventDefault();

    const uploader = storage.ref(`images/${image.name}`).put(image);

    uploader.on(
      "state_changed",
      (snapshot) => {
        const progres =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setprogress(progres);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((urlpath) => {
            axios.post("/uploads", {
              caption: caption,
              user: name,
              image: urlpath,
            });

            db.collection("posts").add({
              caption: caption,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              URL: urlpath,
              username: name,
            });
          });
        setcaption("");
        setprogress(0);
        setimage(null);
      }
    );
  };

  const handlechange = (e) => {
    if (e.target.files[0]) {
      setimage(e.target.files[0]);
    }
  };

  return (
    <div className="image">
      <progress value={progress} max="100"></progress>
      <Input
        type="text"
        placeholder="Enter the captions....."
        onChange={(e) => setcaption(e.target.value)}
      />
      <Input type="file" onChange={handlechange} />

      <Button onClick={upload}>upload</Button>
    </div>
  );
}

export default Uploads;
