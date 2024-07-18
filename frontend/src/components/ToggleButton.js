import React from "react";
import "../assets/css/components/toggleButton.css";
import { useNavigate } from 'react-router-dom';

export default function ToggleButton({ modes, selectedMode, onModeChange, classes }) {
  return (
    <div className="toggle-button-container">
      {modes.map((mode, index) => (
        <button
          key={index}
          className={`toggle-button ${selectedMode === mode ? "selected" : ""} ${classes ? classes[index] : null}`}
          onClick={() => onModeChange(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}