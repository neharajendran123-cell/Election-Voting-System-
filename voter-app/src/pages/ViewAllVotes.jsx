import { useState, useEffect } from "react";
import axios from "axios";

const Result = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("❌ No token found!");
                    return;
                }

                const res = await axios.get("http://localhost:5000/api/vote/public-results", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setResults(res.data);
            } catch (error) {
                console.error("❌ Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-80% bg-center"
            style={{
                backgroundImage: "url('https://lexlife.in/wp-content/uploads/2021/02/qt-haryana-election.jpg?w=1024')",
                backgroundSize: "100%",
                backgroundPosition: "center"
            }}>
            <div className="bg-white bg-opacity-30 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-4 text-center">Election Results</h1>

                {loading ? (
                    <p className="text-center">Loading results...</p>
                ) : results.length === 0 ? (
                    <p className="text-red-500 font-semibold text-center">No results available yet.</p>
                ) : (
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border px-4 py-2">Position</th>
                                <th className="border px-4 py-2">Candidate</th>
                                <th className="border px-4 py-2">Votes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white bg-opacity-50">
                            {results.map((r, i) => (
                                <tr key={i} className="hover:bg-gray-100 transition">
                                    <td className="border px-4 py-2">{r.position}</td>
                                    <td className="border px-4 py-2">{r.firstname} {r.lastname}</td>
                                    <td className="border px-4 py-2">{r.votes}</td>
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
