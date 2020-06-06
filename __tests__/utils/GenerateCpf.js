export default function generator() {
  return `${Math.floor(Math.random() * (999 - 100) + 100)}.${Math.floor(
    Math.random() * (999 - 100) + 100
  )}.${Math.floor(Math.random() * (999 - 100) + 100)}-${Math.floor(
    Math.random() * (100 - 0) + 0
  )}`;
}
