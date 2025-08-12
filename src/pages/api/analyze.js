import { getSupabaseServerClient } from "@/lib/supabaseServerClient";

export default async function handler(req, res) {
  if (corsMiddleware(req, res)) {
    return; // Preflight request was handled
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { platform, postContent } = req.body;

  const token = req.headers.authorization?.replace("Bearer ", "");
  const supabase = getSupabaseServerClient(token);

  if (!postContent || !platform) {
    return res.status(400).json({ error: "Missing content or platform" });
  }

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // You can replace with your specific model
          messages: [
            {
              role: "system",
              content: `You are a social media algorithm expert. Analyze the given post for ${platform} and provide:
                1) engagement_prediction (1–100),
                2) algorithm_score (1–100),
                3) three optimization suggestions,
                4) optimized version of the post.
                Format your answer as a JSON object.
                
                Make sure to format your response as a JSON object.
                Make sure to include all the fields in the JSON object.
                Make sure keys formatted like this and all must present: "original", "algorithm_score", "engagement_prediction", "optimized_version", "optimization_suggestions"
                Make sure algorithm_score is a number between 1 and 100.
                Make sure engagement_prediction is a number between 1 and 100.
                Make sure optimization_suggestions is an array of strings.
                Make sure optimized_version is a string.
                `,
            },
            {
              role: "user",
              content: `Platform: ${platform}\nPost Content: ${postContent}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      }
    );

    const data = await groqRes.json();
    const rawResponse = data.choices?.[0]?.message?.content;

    try {
      // Extract JSON from the response, even if surrounded by text or markdown
      let jsonMatch =
        rawResponse && rawResponse.match(/```json([\s\S]*?)```|({[\s\S]*})/);
      let jsonString = null;
      if (jsonMatch) {
        if (jsonMatch[1]) {
          jsonString = jsonMatch[1].trim(); // from ```json ... ```
        } else if (jsonMatch[2]) {
          jsonString = jsonMatch[2].trim(); // from {...}
        }
      }
      const parsed = JSON.parse(jsonString || rawResponse);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(
        req.headers.authorization?.replace("Bearer ", "")
      );

      if (userError || !user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await supabase.from("analyses").insert([
        {
          user_id: user.id,
          platform: platform,
          original_content: postContent,
          optimized_content: parsed.optimized_version,
          suggestions: parsed.optimization_suggestions,
          algorithm_score: parsed.algorithm_score,
          engagement_prediction: parsed.engagement_prediction,
        },
      ]);
      // Map Groq response to frontend shape
      return res.status(200).json({
        original: postContent,
        optimized_content: parsed.optimized_version,
        algorithm_score: parsed.algorithm_score,
        engagement_prediction: parsed.engagement_prediction,
        suggestions: parsed.optimization_suggestions,
      });
    } catch (err) {
      console.error("Failed to parse Groq response as JSON:", rawResponse);
      return res
        .status(500)
        .json({ error: "Invalid response from Groq", raw: rawResponse });
    }
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
