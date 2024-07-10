import { useState } from "react";
import '../assets/css/components/toggleButton.css';

export default function ToggleButton({selectedMode, onModeChange}) {
    return (
        <div className="toggle-button-container">
            <button 
                className={`toggle-button ${selectedMode === 'day' ? 'selected' : ''}`}
                onClick={()=>onModeChange('day')}
            >
                Day
            </button>
            <button 
                className={`toggle-button ${selectedMode === 'week' ? 'selected' : ''}`}
                onClick={()=>onModeChange('week')}
            >
                Week
            </button>
        </div>
    )
}