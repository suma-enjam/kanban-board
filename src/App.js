import { useEffect, useState } from 'react';
import { fetchTickets } from './services/api';
import KanbanBoard from './components/KanbanBoard';

function App() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]); // New state for users data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const ticketsData = await fetchTickets();
                setTickets(ticketsData.tickets); // Assuming the data has tickets in the 'tickets' field
                setUsers(ticketsData.users); // Assuming the users are in the 'users' field
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <KanbanBoard tickets={tickets} users={users} />
            )}
        </div>
    );
}

export default App;
