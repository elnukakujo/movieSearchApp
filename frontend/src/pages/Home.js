import DragMenu from '../components/dragMenu';
export default function Home() {
    return (
        <div>
            <h1>MovieSearchApp</h1>
            <p>What are we looking tonight boss?</p>
            <DragMenu
            url="http://127.0.0.1:5252/api/TmdbData/upcoming"
            title="Upcoming Movies"
            id="upcoming"
            queryParams='Language=en&region=US'
            />
            <DragMenu
            url="http://127.0.0.1:5252/api/TmdbData/trending"
            title="Trending Now"
            id="trending"
            queryParams='TimeInterval=week&Language=en'
            />
            <DragMenu
            url="http://127.0.0.1:5252/api/TmdbData/top_rated"
            title="Top Rated"
            id="top-rated"
            queryParams='Language=en'
            />
        </div>
    );
}