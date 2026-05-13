import { useState, useEffect } from "react";
import axios from "axios";

const Result = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWinners = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("❌ No token found! Redirecting to login...");
                    return;
                }

                const response = await axios.get("http://localhost:5000/api/vote/winners", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setWinners(response.data);
            } catch (error) {
                console.error("❌ Error fetching winners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWinners();
    }, []);

return (
    <div
        className="min-h-screen flex items-center justify-center bg-80% bg-center"
        style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2015/10/30/12/19/winner-1013979_1280.jpg')",backgroundSize:"50%",backgroundPosition:"center" }} // Change 'background.jpg' to your actual image path
    >
        <div className="bg-white bg-opacity-30 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h1 className="text-2xl font-bold mb-4 text-center">Election Results</h1>

            {loading ? (
                <p className="text-center">Loading results...</p>
            ) : winners.length === 0 ? (
                <p className="text-red-500 font-semibold text-center">Results have not been declared yet.</p>
            ) : (
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">Position</th>
                            <th className="border px-4 py-2">Winner</th>
                            <th className="border px-4 py-2">Votes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white bg-opacity-50">
                        {winners.map((winner) => (
                            <tr key={winner.candidateId} className="hover:bg-gray-100 transition">
                                <td className="border px-4 py-2">{winner.position}</td>
                                <td className="border px-4 py-2">{winner.firstname} {winner.lastname}</td>
                                <td className="border px-4 py-2">{winner.votes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);
};

export default Result;
