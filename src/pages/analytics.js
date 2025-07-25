import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthGuard } from "@/lib/authGuard";

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  //   const router = useRouter();
  const { user, loading: authLoading } = useAuthGuard();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setData(data);
    };

    if (user) fetchHistory();
  }, [user]);

  const formatted = data.map((d) => ({
    date: new Date(d.created_at).toLocaleDateString(),
    engagement: d.engagement_prediction,
    score: d.algorithm_score,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Post Performance Trends</h2>

      <div className="bg-white shadow rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatted}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#8884d8"
              name="Engagement %"
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#82ca9d"
              name="Algorithm Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-xl font-semibold mt-6">Recent Analyses</h3>
      <ul className="mt-2 space-y-2">
        {data.map((item, idx) => (
          <li key={idx} className="p-4 border rounded">
            <p>
              <strong>Platform:</strong> {item.platform}
            </p>
            <p>
              <strong>Score:</strong> {item.algorithm_score}
            </p>
            <p>
              <strong>Engagement:</strong> {item.engagement_prediction}
            </p>
            <p>
              <strong>Analyzed On:</strong>{" "}
              {new Date(item.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
