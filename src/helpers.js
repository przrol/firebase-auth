export const shuffleAnswers = (question) => {
  if (!question) return [];

  const shuffledAnswers = [];
  // const correctAnswerArray = JSON.parse(question.correctAnswers);
  // const incorrectAnswerArray = JSON.parse(question.incorrectAnswers);

  for (let index = 0; index < question.correctAnswers.length; index++) {
    const unshuffledAnswers = [
      ...question.correctAnswers[index],
      ...question.incorrectAnswers[index],
    ];

    shuffledAnswers.push(
      unshuffledAnswers
        .map((answer) => ({ sort: Math.random(), value: answer }))
        .sort((a, b) => a.sort - b.sort)
        .map((obj) => obj.value)
    );
  }

  return shuffledAnswers;
};

export const replaceWithBr = (text) => {
  return text ? text.replace(/\n/g, "<br />") : "";
};

export const getGermanFormattedTime = (isoString) => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Berlin",
    };
    const formattedTime = date.toLocaleString("de-DE", timeOptions);

    if (diffInDays === 0) {
      return `Today, ${formattedTime}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${formattedTime}`;
    } else if (diffInDays < 15) {
      // Up to 14 days ago
      return `${diffInDays} days ago ${formattedTime}`;
    } else {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Berlin",
      };
      return date.toLocaleString("de-DE", options);
    }
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid Date";
  }
};

export const arraysContainSameStrings = (currentAnswers, currentQuestion) => {
  for (let index = 0; index < currentQuestion.correctAnswers.length; index++) {
    const currentAnswer = currentAnswers[index];
    const correctAnswer = currentQuestion.correctAnswers[index];

    // Check if currentAnswer is iterable
    if (!Array.isArray(currentAnswer)) {
      // Handle the case where currentAnswer is not an array
      return false;
    }

    // If the lengths are not equal, the arrays are not the same.
    if (currentAnswer.length !== correctAnswer.length) {
      return false;
    }

    // Sort both arrays.
    const sortedArr1 = [...currentAnswer].sort();
    const sortedArr2 = [...correctAnswer].sort();

    // Check if sorted arrays are identical.
    if (!sortedArr1.every((value, idx) => value === sortedArr2[idx]))
      return false;
  }

  return true;
};

export const shuffle = (payload) => {
  let array = [...payload];

  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
