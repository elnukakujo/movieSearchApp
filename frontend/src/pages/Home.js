import DragMenu from '../components/DragMenu';
import '../assets/css/pages/home.css'
export default function Home() {
    return (
        <div>
            <h1>MovieSearchApp</h1>
            <p>What are we looking tonight boss?</p>
            <DragMenu
            url="http://127.0.0.1:5252/api/TmdbData/upcoming"
            title="Upcoming Movies"
            queryParams='Language=en&region=US'
            />
            <DragMenu
            url="http://127.0.0.1:5252/api/TmdbData/trending"
            title="Trending Now"
            queryParams='Language=en'
            toggleButton={['day', 'week']}
            />
            <DragMenu
            url="http://127.0.0.1:5252/api/TmdbData/top_rated"
            title="Top Rated"
            queryParams='Language=en'
            toggleButton={['movie', 'tv']}
            />
        </div>
    );
}