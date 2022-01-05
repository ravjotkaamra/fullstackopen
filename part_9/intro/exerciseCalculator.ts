interface TrainingResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  dailyHours: Array<number>;
}

const parseExerciseArguments = (args: Array<string>): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 10) throw new Error("Too many arguments");

  if (isNaN(Number(args[2]))) {
    throw new Error("Provided target hours was not a number!");
  }

  const dailyHours: Array<number> = [];
  const target: number = Number(args[2]);

  for (let i = 3; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error("Provided daily exercise hours were not numbers!");
    } else {
      dailyHours.push(Number(args[i]));
    }
  }

  return { dailyHours, target };
};

const calculateExercises = (
  targetHours: number,
  dailyExerciseHours: Array<number>
): TrainingResult => {
  const average =
    dailyExerciseHours.reduce((prev, curr) => prev + curr, 0) /
    dailyExerciseHours.length;
  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: dailyExerciseHours.filter((hours) => hours > 0).length,
    success: average > targetHours,
    rating: 2,
    ratingDescription: "not too bad but could be better",
    target: targetHours,
    average,
  };
};

try {
  const { target, dailyHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(target, dailyHours));
} catch (error: unknown) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
