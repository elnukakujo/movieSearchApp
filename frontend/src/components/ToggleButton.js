import React from "react";
import "../assets/css/components/toggleButton.css";

export default function ToggleButton({ modes, selectedMode, onModeChange }) {
    return (
        <div className="toggle-button-container">
          {modes.map((mode, index) => (
            <button
              key={index}
              className={`toggle-button ${selectedMode === mode ? "selected" : ""}`}
              onClick={() => onModeChange(mode)}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      );
    }