import React, { useState, useEffect } from "react";
import "./post.css";
import { Avatar, Button, Input } from "@material-ui/core";
import db from "./Firebase";
import firebase from "firebase"

function Ipost({ name, postid, username, url, caption }) {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postid) {
      unsubscribe = db
        .collection("posts")
        .doc(postid)
        .collection("comment").orderBy("timestamp","desc")
        .onSnapshot((snap) => setcomments(snap.docs.map((doc) => doc.data())));
    }
    return () => {
      unsubscribe();
    };
  }, [postid]);

  const change = (e) => {
    e.preventDefault();
    
    db.collection("posts").doc(postid).collection("comment").add({
      text: comment,
      username: name.displayName,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    });
    setcomment("")
  };
  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.advpulse.com%2Fwp-content%2Fuploads%2F2019%2F03%2FRoyal-Enfield-Himalayan-ABS-Sleet-2.jpg&f=1&nofb=1"
          alt="krishna"
        ></Avatar>
        <h2>{username}</h2>
      </div>
      <img alt="hrithick" src={url} className="post_image" />

      <h4 className="post_text">
        <strong>{username} </strong> {caption}
      </h4>

      
      <div className="post_comment">
        {comments.map(({ text, username }) => (
          <p>
            <strong>{username}</strong> {text}
          </p>
        ))}
      </div>

{name && 
 <form>
 <Input
   value={comment}
   className="input"
   style={{ marginLeft: "10px" }}
   type="text"
   placeholder="Add a comments..."
   onChange={(e) => setcomment(e.target.value)}
 />
 <Button
   type="submit"
   className="button"
   disabled={!comments}
   onClick={change}
   style={{ backgroundColor: "grey", marginLeft: "10px" }}
 >
   post
 </Button>
</form>}
     
    </div>
  );
}

export default Ipost;
