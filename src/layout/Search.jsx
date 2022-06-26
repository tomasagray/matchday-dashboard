import {useLocation} from "react-router-dom";

export const Search = () => {
    let query = new URLSearchParams(useLocation().search)
    return (
        <div>
            <h1>Search</h1>
            <h3>Query: {query.get('q')}</h3>
        </div>
    )
}
