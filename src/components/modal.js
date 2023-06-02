import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import "../App.css";
const LoginSignupModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  const createUserDocument = async (uid, name, email) => {
    try {
      await db.collection(uid).doc("userInfo").set({ name, email });
      console.log("User document created:", { uid, name, email });
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        const name = document.getElementById("name").value;
        const userCredential = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        const { user } = userCredential;
        await user.updateProfile({ displayName: name });

       
        await db.collection("users").doc(user.uid).set({
          name: name,
          email: email,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error in login/signup:", error.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          width: "400px",
          maxWidth: "90%",
          position: "relative",
          border: "3px solid",
          animation: "border-gradient 5s ease infinite",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          &times;
        </button>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required />
            </div>
          )}
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p
          className="toggle-form"
          onClick={toggleForm}
          style={{ cursor: "pointer" }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default LoginSignupModal;
