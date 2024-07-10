import { useState } from "react";
import '../assets/css/components/toggleButton.css';

export default function ToggleButton({modes, selectedMode, onModeChange}) {
    return (
        <div className="toggle-button-container">
            <button 
                className={`toggle-button ${selectedMode === modes[0] ? 'selected' : ''}`}
                onClick={()=>onModeChange(modes[0])}
            >
                {modes[0].toUpperCase()}
            </button>
            <button 
                className={`toggle-button ${selectedMode === modes[1] ? 'selected' : ''}`}
                onClick={()=>onModeChange(modes[1])}
            >
                {modes[1].toUpperCase()}
            </button>
        </div>
    )
}