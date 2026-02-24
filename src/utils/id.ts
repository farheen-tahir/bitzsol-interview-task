export function makeLocalId() {
  // negative IDs avoid collision with API ids (1..200)
  return -Math.floor(Date.now() / 1000);
}
