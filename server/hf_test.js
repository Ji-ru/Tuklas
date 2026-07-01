import { HfInference } from '@huggingface/inference';

const hf = new HfInference('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');

async function test() {
  try {
    const res = await hf.chatCompletion({
      model: "google/gemma-2-2b-it",
      provider: "hf-inference",
      messages: [{ role: "user", content: "Test message" }],
      max_tokens: 3000,
    });
    console.log("Success:", res);
  } catch (err) {
    console.log("Error status:", err.statusCode);
    if (err.httpResponse && err.httpResponse.body) {
      console.log("Body:", JSON.stringify(err.httpResponse.body));
    } else {
      console.log("Error:", err);
    }
  }
}
test();
