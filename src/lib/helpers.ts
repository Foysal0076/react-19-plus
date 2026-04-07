export const expensiveProcessing = (count: number) => {
  console.log('Expensive Processing')
  // Simulate an expensive processing task, which returns an array of items(title, id) after a delay
  const start = Date.now()
  while (Date.now() - start < 2000) {
    // Simulating expensive processing for 2 seconds
  }

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
  }))
}
