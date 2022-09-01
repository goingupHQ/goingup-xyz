// cut refers to how many numbers you want to show at the start and end of the string
export const trim = (number, firstCut, secondCut) =>
  number.slice(0, firstCut) + "..." + number.slice(-secondCut);
