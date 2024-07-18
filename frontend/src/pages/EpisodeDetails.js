import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import DragSeason from '../components/DragSeason';
import '../assets/css/pages/EpisodeDetails.css';
import { FaArrowLeft } from 'react-icons/fa';
import DragPosters from '../components/DragPosters';
import ToggleButton from '../components/ToggleButton';

export default function EpisodeDetails() {
    const { id, season_number, episode_number } = useParams();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const language = queryParams.get('language') || 'en';
    const [episode, setEpisode]=useState({});

    const fetchEpisode = async () => {
        const url = `http://127.0.0.1:5252/api/TmdbData/episodeDetails?id=${id}&season_number=${season_number}&episode_number=${episode_number}&Language=${language}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEpisode(data);
        } catch (error) {
            console.error('Error fetching episode:', error);
            setEpisode({});
        }
    };

    useEffect((language) => {
        fetchEpisode();
    }, [id, season_number, episode_number]);

    function getDuration(runtime) {
        if(runtime>60){
            let min = (runtime%60).toString()
            if(min.length===1) min = "0"+min;
            return (Math.floor(runtime/60)).toString()+"h"+min;
        }else{
            return episode.runtime.toString()+"min"
        }
    }
    const navigate = useNavigate();
    const handleEpisodeChange=(mode)=>{
        const nextEpisode = mode === 'Next' ? parseInt(episode_number) + 1 : parseInt(episode_number) - 1;
        if (nextEpisode>parseInt(episode.episodes_count)||nextEpisode<1) return;
        const newPath = `/tv/${id}/${season_number}/${nextEpisode}?language=en`;
        console.log('Navigating to:', newPath); // Log the path to check correctness
        navigate(newPath, { replace: true });
    }

    return (
        <div className='section' id='episode-details'>
            <div className='content'>
                <div  className='back-link'>
                    <Link to={`/tv/${id}`}>
                        <h3><FaArrowLeft />Back to the show's page</h3>
                    </Link>
                </div>
                <div className='intro' style={{'--bg-image': `url(${episode.still_path})`}}>
                    <div className='overlay'/>
                    <div className='img-container'>
                        <img
                            src={episode.still_path}
                            alt={""}
                        />
                    </div>
                    <div className='description'>
                        <h3>{`Season ${episode.season_number}: Episode ${episode.episode_number}`}</h3>
                        <h2>{episode.name}</h2>
                        <h4>Release Date: {episode.air_date}</h4>
                        <p>{episode.overview}</p>
                        {episode.vote_average!==0 ? (
                        <p>Rating: {Math.round(episode.vote_average*5)/10} /5</p>
                        ): null}
                        {episode.runtime&&<h4>Duration: {getDuration(episode.runtime)}</h4>}
                    </div>
                </div>
                <ToggleButton
                    modes={['Previous', 'Next']}
                    onModeChange={handleEpisodeChange}
                    classes={[
                        parseInt(episode_number) - 1<1?"disable":"",
                        parseInt(episode_number) + 1>parseInt(episode.episodes_count)?"disable":""
                    ]}
                />
                <DragSeason
                    url={"http://127.0.0.1:5252/api/TmdbData/seasonsDetails"}
                    queryParams={`id=${id}&Language=${language}`}
                    season={season_number}
                    currentEpisode={episode_number}
                />
                <DragPosters
                    url={'http://127.0.0.1:5252/api/TmdbData/recommendation'}
                    title="Recommendations"
                    queryParams={`MediaType=tv&id=${id}&Language=${language}`}
                />
            </div>
        </div>
    );
}