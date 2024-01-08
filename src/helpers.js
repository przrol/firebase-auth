export const shuffleAnswers = (question) => {
  if (!question) return [];

  const shuffledAnswers = [];

  for (let index = 0; index < 6; index++) {
    if (`correctAnswers${index}` in question) {
      const unshuffledAnswers = [
        ...question[`correctAnswers${index}`],
        ...question[`incorrectAnswers${index}`],
      ];

      shuffledAnswers.push(
        unshuffledAnswers
          .map((answer) => ({ sort: Math.random(), value: answer }))
          .sort((a, b) => a.sort - b.sort)
          .map((obj) => obj.value)
      );
    } else {
      break;
    }
  }

  return shuffledAnswers;
};

export const replaceWithBr = (text) => {
  return text ? text.replace(/\n/g, "<br />") : "";
};

export const arraysContainSameStrings = (currentAnswers, currentQuestion) => {
  for (let index = 0; index < 6; index++) {
    if (`correctAnswers${index}` in currentQuestion) {
      const currentAnswer = currentAnswers[index];
      const correctAnswer = currentQuestion[`correctAnswers${index}`];

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
    } else {
      break;
    }
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
