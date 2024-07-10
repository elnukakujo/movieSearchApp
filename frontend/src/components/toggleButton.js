import { useState } from "react";
import '../assets/css/components/toggleButton.css';

export default function ToggleButton({mode, onModeChange}) {
    return (
        <div className="toggle-button-container">
            <button 
                className={`toggle-button ${mode === 'day' ? 'selected' : ''}`}
                onClick={()=>onModeChange('day')}
            >
                Day
            </button>
            <button 
                className={`toggle-button ${mode === 'week' ? 'selected' : ''}`}
                onClick={()=>onModeChange('week')}
            >
                Week
            </button>
        </div>
    )
}