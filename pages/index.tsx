import { useState, useEffect } from 'react';

interface Data {
    name: string
    description: string
    _id: string
}

export default function Home() {
    const [lunches, setLunches] = useState<Data[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchLunches = async () => {
            const res = await fetch('/api/lunch');
            const data = await res.json();
            setLunches(data);
        };
        fetchLunches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/lunch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });
        const data = await res.json();
        if (res.ok) {
            setLunches([...lunches, data]);
            setName('');
            setDescription('');
        } else {
            alert('Chyba pri pridávaní obeda', res);
        }
    };

    const handleDelete = async ( id: string) => {
        const res = await fetch('/api/lunch', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            setLunches(lunches.filter(o => o._id !== id));
        } else {
            alert('Chyba pri zmazani obeda', res);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-5">Čoo sme mali na obed?</h1>

            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg mb-5 w-96">
                <input
                    type="text"
                    placeholder="Názov jedla"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    required
                />
                <textarea
                    placeholder="Popis"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    required
                />
                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Pridať obed</button>
            </form>

            <ul className="w-96">
                {lunches.map((obed) => (
                    <li key={obed._id} className="bg-white p-4 rounded-lg shadow-md mb-2">
                        <h3 className="text-xl font-bold">{obed.name}</h3>
                        <p>{obed.description}</p>
                        <button className="w-full py-2 bg-red-500 text-white rounded" onClick={()=> handleDelete(obed._id)} >Vymazať obed</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}