export const shuffleAnswers = (question) => {
  const unshuffledAnswers = [
    ...question.correctAnswers,
    ...question.incorrectAnswers,
  ];

  return unshuffledAnswers
    .map((answer) => ({ sort: Math.random(), value: answer }))
    .sort((a, b) => a.sort - b.sort)
    .map((obj) => obj.value);
};

export const replaceWithBr = (text) => {
  return text.replace(/\n/g, "<br />");
};

export const arraysContainSameStrings = (arr1, arr2) => {
  // If the lengths are not equal, the arrays are not the same.
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort both arrays.
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  // Check if sorted arrays are identical.
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
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
