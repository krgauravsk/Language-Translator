import React, { useState } from "react";
import { Spin, Select, Tooltip } from "antd";
import VolumeUpSharpIcon from "@mui/icons-material/VolumeUpSharp";
import SyncAltSharpIcon from "@mui/icons-material/SyncAltSharp";
import MicNoneSharpIcon from "@mui/icons-material/MicNoneSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { LoadingOutlined } from "@ant-design/icons";
import "./Translator.css";
import languageList from "./language.json";
import VoiceBars from "./VoiceBars";

export default function Translator() {
  const [inputFormat, setInputFormat] = useState("en");
  const [outputFormat, setOutputFormat] = useState("hi");
  const [translatedText, setTranslatedText] = useState("Translation");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakActive, setSpeakActive] = useState(false);

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  const handleReverseLanguage = () => {
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
    setInputText("");
    setTranslatedText("Translation");
  };

  const handleRemoveInputText = () => {
    setInputText("");
    setTranslatedText("Translation");
  };

  const handleTranslate = async () => {
    if (!inputText || !inputFormat || !outputFormat) return;

    setIsLoading(true);

    const url = `https://microsoft-translator-text-api3.p.rapidapi.com/translate?to=${outputFormat}&from=${inputFormat}&textType=plain`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "microsoft-translator-text-api3.p.rapidapi.com",
        "x-rapidapi-key": "77394a4461mshce838104022c0f0p18b433jsn2f65b8658909",
      },
      body: JSON.stringify([{ text: inputText }]),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result && result[0]?.translations?.length) {
        setTranslatedText(result[0].translations[0].text);
      } else {
        setTranslatedText("Translation failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Please Try Again! An error occurred.");
    }

    setIsLoading(false);
  };

  // Speech-to-Text Functionality
  const handleSpeechToText = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = inputFormat;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Text-to-Speech Functionality
  const markTextAsSpoken = () => {
    if (translatedText && translatedText !== "Translation") {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = outputFormat;

      // Activate the red color
      setSpeakActive(true);

      utterance.onend = () => {
        setSpeakActive(false); // Reset after speech ends
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container">
      <div className="row1">
        <Select
          className="select-lang"
          showSearch
          value={inputFormat}
          onChange={(value) => setInputFormat(value)}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          options={Object.keys(languageList).map((key) => ({
            value: key,
            label: languageList[key].name,
          }))}
        />

        <SyncAltSharpIcon
          className="reversesvg"
          onClick={handleReverseLanguage}
        />

        <Select
          className="select-lang"
          style={{ color: "#1a0dab !important" }}
          showSearch
          value={outputFormat}
          onChange={(value) => setOutputFormat(value)}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          options={Object.keys(languageList).map((key) => ({
            value: key,
            label: languageList[key].name,
          }))}
        />
      </div>

      <div className="row2">
        <div className="inputText">
          {inputText && (
            <CloseSharpIcon
              className="close-icon"
              onClick={handleRemoveInputText}
            />
          )}
          <textarea
            type="text"
            value={inputText}
            placeholder="Enter Text"
            onChange={(e) => setInputText(e.target.value)}
            className="text-input"
          />
          <div className="voice-container">
            {isListening && (
              <div className="voiceBar">
                <VoiceBars />
              </div>
            )}
            <Tooltip placement="bottom" title="Translate by voice">
              <MicNoneSharpIcon
                onClick={handleSpeechToText}
                className={isListening ? "mic-active mic" : "mic"}
                style={{
                  cursor: "pointer",
                  color: isListening ? "red" : "black",
                }}
              />
            </Tooltip>
          </div>
        </div>
        <div className="outputText">
          {translatedText}
          {translatedText && translatedText !== "Translation" && (
            <Tooltip placement="bottom" title="Listen">
              <div className="speaker">
                <VolumeUpSharpIcon
                  onClick={markTextAsSpoken}
                  style={{
                    cursor: "pointer",
                    color: speakActive ? "red" : "",
                  }}
                />
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="button-container">
        <button
          className="translate-button"
          onClick={handleTranslate}
          disabled={isLoading}
        >
          {isLoading ? <Spin indicator={antIcon} /> : <span>Translate</span>}
        </button>
      </div>
    </div>
  );
}
