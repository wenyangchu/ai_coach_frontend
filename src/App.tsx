import React, { useEffect, useState } from "react";
import { apiUrl } from "./config";

function App() {
  const [data, setData] = useState({
    question: {
      id: "",
      text: "",
      topic: "",
      answers: [] as string[],
      explanation: ""
    } as Question,
    mastery: {} as Mastery,
    time_spent: {},
    total_time: 0,
    score: 0,
    total: 0,
    is_correct: false,
    feedback: "",
    explanation: "",
  });

  const [form, setForm] = useState({
    answer: "",
    confidence_rating: "3",
    emotional_state: "",
    fatigue: "",
    question_id: "",
    elapsed_time: 0,
  });

  useEffect(() => {
    fetch(`${apiUrl}/getUserLearningProgress`)
      .then((res) => res.json())
      .then((d) => {
        setData({
          ...d,
          total_time: Object.values(d.time_spent || {}).reduce((a, b) => (a as number) + (b as number), 0),
        });
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  interface Question {
    id: string;
    text: string;
    topic: string;
    answers: string[];
    explanation?: string;
  }

  interface Mastery {
    [topic: string]: number;
  }

  interface TimeSpent {
    [topic: string]: number;
  }

  interface Data {
    question: Question;
    mastery: Mastery;
    time_spent: TimeSpent;
    total_time: number;
    score: number;
    total: number;
    is_correct: boolean;
    feedback: string;
    explanation: string;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("question_id", data.question.id);

    fetch(`${apiUrl}/answerQuestion`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((d: Partial<Data>) => {
      setData({
        ...data,
        ...d,
        total_time: Object.values(d.time_spent || {}).reduce((a, b) => a + b, 0),
      });
      });
  };
  const handleNextQuestion = () => {
    fetch(`${apiUrl}/getQuestion`)
      .then((res) => res.json())
      .then((d) => {
        setData(prev => ({
          ...prev,
          question: d.question,
          is_correct: false,
          feedback: ""
        }));
        setForm({
          answer: "",
          confidence_rating: "3",
          emotional_state: "",
          fatigue: "",
          question_id: "",
          elapsed_time: 0,
        });
      });
  };
  return (
    <div>
      <h1>🧠 MedTrainer</h1>
      <h3>Topic: {data.question.topic}</h3>
      <p>
        <strong>Question:</strong> {data.question.text}
      </p>
      {!data.is_correct && (
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="answer"
            autoComplete="off"
            autoFocus
            required
            value={form.answer}
            onChange={handleChange}
          />
          <label htmlFor="confidence">Confidence rating(1-5):</label>
          <select
            name="confidence"
            id="confidence"
            required
            autoComplete="off"
            value={form.confidence_rating}
            onChange={handleChange}
          >
            <option value="1">1 (Not confident)</option>
            <option value="2">2</option>
            <option value="3">3 (Neutral)</option>
            <option value="4">4</option>
            <option value="5">5 (Very confident)</option>
          </select>
          <label htmlFor="emotional_state">Mood:</label>
          <select
            name="emotional_state"
            id="emotional_state"
            autoComplete="off"
            value={form.emotional_state}
            onChange={handleChange}
          >
            <option value="">--</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="frustrated">Frustrated</option>
            <option value="stressed">Stressed</option>
          </select>
          <label htmlFor="fatigue">Fatigue:</label>
          <select
            name="fatigue"
            id="fatigue"
            autoComplete="off"
            value={form.fatigue}
            onChange={handleChange}
          >
            <option value="">--</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      )}
      {data.feedback && (
        <p>
          <strong>{data.feedback}</strong>
        </p>
      )}
      {data.feedback && data.question.explanation && (
        <div style={{ margin: "1em 0", color: "#2ECC40" }}>
          <strong>📝 Explanation:</strong> {data.question.explanation}
        </div>
      )}

      {data.is_correct && (
        <button type="button" onClick={handleNextQuestion}>
          Next Question
        </button>
      )}

      <h3>📊 Mastery</h3>
      <ul>
        {Object.entries(data.mastery).map(([topic, score]) => (
          <li key={topic}>
            {topic}: {(score as number).toFixed(2)}
          </li>
        ))}
      </ul>
      <h3>⏱️ Time Spent</h3>
      <ul>
        {Object.entries(data.time_spent).map(([topic, seconds]) => (
          <li key={topic}>
            {topic}: {(seconds as number).toFixed(1)}s
          </li>
        ))}
      </ul>
      <p>Total time: {data.total_time.toFixed(1)}s</p>
      <p>
        🧮 Score: {data.score} / {data.total}
      </p>
    </div>
  );
}

export default App;