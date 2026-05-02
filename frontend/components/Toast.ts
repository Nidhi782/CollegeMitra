export const showSuccess = (message: string) => console.log(message);
export const showError = (message: string) => console.error(message);
export const showToast = {
  copied: () => console.log("Link copied!"),
  compareAdded: (name: string) => console.log(`${name} added to compare`),
  compareRemoved: (name: string) => console.log(`${name} removed from compare`),
  compareMax: () => console.log("Max 3 colleges can be compared"),
};
