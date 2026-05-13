
import { useState, useEffect } from "react";
import axios from "axios";

const VoteResults = () => {
    const [results, setResults] = useState([]);
    const [winners, setWinners] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("❌ No token found! Redirecting to login...");
                    return;
                }

                const response = await axios.get("http://localhost:5000/api/vote/results", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setResults(response.data);

                // Check if user is admin
                const userResponse = await axios.get("http://localhost:5000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setIsAdmin(userResponse.data.role === "admin");
            } catch (error) {
                console.error("❌ Error fetching results:", error);
            }
        };
        fetchResults();
    }, []);

    const handleDeclareWinners = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/api/vote/declare-winners", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(response.data.message);
            setWinners(response.data.winners);
        } catch (error) {
            console.error("Error declaring winners:", error);
            alert(error.response?.data?.message || "Failed to declare winners.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Election Results</h1>

            {results.length === 0 ? (
                <p>No votes have been cast yet.</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Position</th>

                            <th className="border px-4 py-2">Candidate</th>
                            <th className="border px-4 py-2">Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((candidate) => (
                            <tr key={candidate._id}>
                                <td className="border px-4 py-2">{candidate.position}</td>
                                <td className="border px-4 py-2">{candidate.firstname}{candidate.lastname}</td>
                                <td className="border px-4 py-2">{candidate.votes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isAdmin && (
                <button onClick={handleDeclareWinners} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                    Declare Winners
                </button>
            )}

            {winners.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-2">Winners</h2>
                    <table className="w-full border">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Position</th>
                                <th className="border px-4 py-2">Winner</th>
                                <th className="border px-4 py-2">Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {winners.map((winner) => (
                                <tr key={winner.candidateId}>
                                    <td className="border px-4 py-2">{winner.position}</td>
                                    <td className="border px-4 py-2">{winner.firstname}{winner.lastname}</td>
                                    <td className="border px-4 py-2">{winner.votes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VoteResults;
