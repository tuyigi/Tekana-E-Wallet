export const generateReferenceNumber = () => {
  const randomNumber: number = Math.floor(Math.random() * 100000000);
  return randomNumber.toString().padStart(8, '0');
};
