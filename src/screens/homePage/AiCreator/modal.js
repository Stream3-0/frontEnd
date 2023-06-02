import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebaseConfig";
import {
  ArrowForward,
  ArrowBack,
  CheckBoxOutlineBlank,
  CheckBox,
  SkipNext,
  ArrowLeft,
  ArrowRight,
} from "@mui/icons-material";



const Modal = ({ closeModal }) => {
  const uploadImageAndGetURL = async (filePath, file) => {
    const ref = storage.ref().child(filePath);
    const snapshot = await ref.put(file);
    const imageURL = await snapshot.ref.getDownloadURL();
    return imageURL;
  };
  const [step, setStep] = useState(1);
  const [gameInfo, setGameInfo] = useState({
    GameDescription: "",
    GameName: "",
    BackGroundImage: null,
    tags: [],
    killIndicatorImage: null,
    additionalFilters: [],
  });
  const [allGameNames, setAllGameNames] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const canProceedCase2 =
    gameInfo.GameDescription && gameInfo.GameName && gameInfo.BackGroundImage;
  const canProceedCase4 = gameInfo.killIndicatorImage;

  const disabledBtnStyle = {
    background: "gray",
    cursor: "not-allowed",
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGameInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const { name } = event.target;
    setGameInfo((prevState) => ({
      ...prevState,
      [name]: event.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (allGameNames.includes(gameInfo.GameName)) {
      alert("Game name already exists. Please choose another name.");
      return;
    }

   
    const BackGroundImageRef = storage
      .ref()
      .child(`BackGroundImages/${gameInfo.GameName}`);
    const backgroundSnapshot = await BackGroundImageRef.put(
      gameInfo.BackGroundImage
    );
    const BackGroundImageURL = await backgroundSnapshot.ref.getDownloadURL();

    const killIndicatorImageRef = storage
      .ref()
      .child(`killIndicatorImages/${gameInfo.GameName}`);
    const killIndicatorImageSnapshot = await killIndicatorImageRef.put(
      gameInfo.killIndicatorImage
    );
    const killIndicatorImageURL =
      await killIndicatorImageSnapshot.ref.getDownloadURL();

    const customFilters = await Promise.all(
      gameInfo.additionalFilters.map(async (filter, idx) => {
        const ref = storage
          .ref()
          .child(`additionalFilters/${gameInfo.GameName}_${idx}`);
        const snapshot = await ref.put(filter.DetectionImage);
        const DetectionImageURL = await snapshot.ref.getDownloadURL();
        return {
          name: filter.name || "",
          DetectionImage: DetectionImageURL,
          icon: filter.icon || "",
        };
      })
    );

   
    const newGame = {
      GameDescription: gameInfo.GameDescription,
      BackGroundImage: BackGroundImageURL, 
      GameName: gameInfo.GameName,
      tags: gameInfo.tags,
     
      AvailableEditors: [
        {
          name: "Kill Indicator",
          DetectionImage: killIndicatorImageURL,
          editorIcon:
            "https://firebasestorage.googleapis.com/v0/b/theta-hacks.appspot.com/o/abstract-user-flat-4.png?alt=media&token=1d4970a4-0443-43f2-81a5-35b2de0ce988",
        },
        ...customFilters,
      ],
    };
   
    await db.collection("editors").doc(gameInfo.GameName).set(newGame);

    alert("AI created successfully!");
    setSubmitted(true);
    closeModal();
  };
  const fetchGameNames = async () => {
    const gamesSnapshot = await db.collection("editors").get();
    const GameNames = gamesSnapshot.docs.map((doc) => doc.id);
    setAllGameNames(GameNames);
  };

  useEffect(() => {
    fetchGameNames();
  }, []);
  const handleAddFilter = () => {
    const newFilter = {
      name: "",
      DetectionImage: null,
      icon: null,
    };
    setGameInfo((prevState) => ({
      ...prevState,
      additionalFilters: [...prevState.additionalFilters, newFilter],
    }));
  };

  const handleCustomFilterChange = async (idx, field, value) => {
    if (field === "DetectionImage" || field === "icon") {
      const imageURL = await uploadImageAndGetURL(`${field}_${idx}`, value);
      setGameInfo((prevState) => {
        const updatedFilters = prevState.additionalFilters.map((filter, i) => {
          if (i === idx) {
            return { ...filter, [field]: imageURL };
          }
          return filter;
        });
        return { ...prevState, additionalFilters: updatedFilters };
      });
    } else {
      setGameInfo((prevState) => {
        const updatedFilters = prevState.additionalFilters.map((filter, i) => {
          if (i === idx) {
            return { ...filter, [field]: value };
          }
          return filter;
        });
        return { ...prevState, additionalFilters: updatedFilters };
      });
    }
  };
  const handleTagChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setGameInfo((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, value],
      }));
    } else {
      setGameInfo((prevState) => ({
        ...prevState,
        tags: prevState.tags.filter((tag) => tag !== value),
      }));
    }
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div
            style={{
              background: "#1a1a1d",
              color: "#FFFFFF",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <p style={{ marginBottom: "20px" }}>
              This guide will help you interactively create an AI for a game on
              our website. Please follow the steps and provide the required
              information. You can navigate to the different sections using the
              triangle buttons. Click Begin to start.
            </p>
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => setStep(2)}
            >
              Begin <ArrowForward />
            </button>
          </div>
        );
      case 2:
        const filledAllInputs2 = canProceedCase2;
        const styleContinue2 = filledAllInputs2
          ? {}
          : {
              ...disabledBtnStyle,
            };
        return (
          <div
            style={{
              background: "#1a1a1d",
              color: "#FFFFFF",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <label style={{ marginBottom: "10px" }}>Game Description</label>
            <input
              type="text"
              name="GameDescription"
              value={gameInfo.GameDescription}
              onChange={handleInputChange}
              required
              style={{ display: "block", marginBottom: "20px" }}
            />
            <label>Game Name</label>
            <input
              type="text"
              name="GameName"
              value={gameInfo.GameName}
              onChange={handleInputChange}
              required
              style={{ display: "block", marginBottom: "20px" }}
            />
            <label>Background Image</label>
            <input
              type="file"
              name="BackGroundImage"
              onChange={handleImageChange}
              required
              style={{ display: "block", marginBottom: "20px" }}
            />
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
              onClick={() => setStep(1)}
            >
              <ArrowBack /> Back
            </button>
            <button
              style={{
                ...{
                  background:
                    "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                },
                ...styleContinue2,
              }}
              onClick={filledAllInputs2 ? () => setStep(3) : null}
            >
              Continue <ArrowForward />
            </button>
          </div>
        );
      case 3:
        return (
          <div
            style={{
              background: "#1a1a1d",
              color: "#FFFFFF",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h4>Select Tags That Your Game May Be associated With</h4>
          
            {[
              "FPS",
              "RPG",
              "MMORPG",
              "Puzzle",
              "Platformer",
              "Multiplayer",
              "Indie",
              "TripleA",
              "Sandbox",
              "OpenWorld",
              "StoryDriven",
              "Retro",
              "EarlyAccess",
              "Casual",
              "Hardcore",
            ].map((tag) => (
              <label
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  onChange={handleTagChange}
                  style={{ marginRight: "10px" }}
                />
                <span>{tag}</span>
              </label>
            ))}
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
              onClick={() => setStep(2)}
            >
              <ArrowBack /> Back
            </button>
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => setStep(4)}
            >
              Continue <ArrowForward />
            </button>
          </div>
        );
      case 4:
        const filledAllInputs4 = canProceedCase4;
        const styleContinue4 = filledAllInputs4
          ? {}
          : {
              ...disabledBtnStyle,
            };
        return (
          <div
            style={{
              background: "#1a1a1d",
              color: "#FFFFFF",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <label style={{ marginBottom: "10px" }}>Kill Indicator Image</label>
            <input
              type="file"
              name="killIndicatorImage"
              onChange={handleImageChange}
              required
              style={{ display: "block", marginBottom: "20px" }}
            />
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
              onClick={() => setStep(3)}
            >
              <ArrowBack /> Back
            </button>
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
              onClick={() => setStep(5)}
            >
              <SkipNext /> Skip
            </button>
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => setStep(5)}
            >
              Continue <ArrowForward />
            </button>
            <button
              style={{
                ...{
                  background:
                    "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                },
                ...styleContinue4,
              }}
              onClick={filledAllInputs4 ? () => setStep(5) : null}
            >
              Continue <ArrowForward />
            </button>
          </div>
        );
      case 5:
        return (
          <div
            style={{
              background: "#1a1a1d",
              color: "#FFFFFF",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
          
            {gameInfo.additionalFilters.map((filter, idx) => (
              <div key={idx} style={{ marginBottom: "20px" }}>
                <label>Filter Name</label>
                <input
                  type="text"
                  name={`filterName_${idx}`}
                  value={filter.name}
                  onChange={(e) =>
                    handleCustomFilterChange(idx, "name", e.target.value)
                  }
                  style={{ display: "block", marginBottom: "10px" }}
                />
                <label>Detection Image</label>
                <input
                  type="file"
                  name={`DetectionImage_${idx}`}
                  onChange={(e) =>
                    handleCustomFilterChange(
                      idx,
                      "DetectionImage",
                      e.target.files[0]
                    )
                  }
                  style={{ display: "block", marginBottom: "10px" }}
                />
                <label>Filter Icon</label>
                <input
                  type="file"
                  name={`icon_${idx}`}
                  onChange={(e) =>
                    handleCustomFilterChange(idx, "icon", e.target.files[0])
                  }
                  style={{ display: "block", marginBottom: "10px" }}
                />
              </div>
            ))}
            <button
              type="button" 
              onClick={handleAddFilter}
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              Create More Filters
            </button>
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
              onClick={() => setStep(4)}
            >
              <ArrowBack /> Back
            </button>
            <button
              style={{
                background: "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              type="submit"
            >
              Create AI
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <div
        style={{
          backgroundColor: "#171c28",
          padding: "2rem",
          borderRadius: "5px",
          width: "60%",
          maxWidth: "800px",
          border: "1px solid #3f51b5",
        }}
      >
        <form onSubmit={handleSubmit} style={{ color: "white" }}>
          {renderStep()}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            {step !== 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background:
                    "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                  color: "white",
                  borderRadius: "50%",
                  border: "none",
                  padding: "0.5rem",
                  cursor: "pointer",
                  minWidth: "40px",
                  minHeight: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArrowLeft style={{ fontSize: "1.5rem" }} />
              </button>
            )}
            {step !== 5 && (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  background:
                    "linear-gradient(45deg, #6a5acd 30%, #0000ff 90%)",
                  color: "white",
                  borderRadius: "50%",
                  border: "none",
                  padding: "0.5rem",
                  cursor: "pointer",
                  minWidth: "40px",
                  minHeight: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArrowRight style={{ fontSize: "1.5rem" }} />
              </button>
            )}
          </div>
        </form>
        <button
          onClick={closeModal}
          style={{
            backgroundColor: "#3f51b5",
            color: "white",
            borderRadius: "3px",
            border: "none",
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
