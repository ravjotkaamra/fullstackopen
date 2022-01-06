import express from "express";
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

const app = express();

// middlewares
app.use(express.json());

// routes
app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  try {
    if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
      res.json({
        height: Number(height),
        weight: Number(weight),
        bmi: calculateBmi(Number(height), Number(weight)),
      });
    } else {
      throw new Error("Provided values were not numbers!");
    }
  } catch (error) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).json({
      error: "malformatted parameters",
      desciption: errorMessage,
    });
  }
});

app.post("/exercise", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;
  try {
    if (typeof target !== "number") {
      throw new Error("target is not a number");
    }

    if (!Array.isArray(daily_exercises)) {
      throw new Error("daily_exercises is not an array");
    }

    daily_exercises.forEach((h) => {
      if (typeof h !== "number") {
        throw new Error(`exercise hours [${h}] is not a number`);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    res.json(calculateExercises(target, daily_exercises));
  } catch (error) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).json({
      error: errorMessage,
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
