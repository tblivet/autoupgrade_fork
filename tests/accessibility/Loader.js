class Loader {
  constructor() {
    this.spinnerChars = ['|', '/', '-', '\\'];
    this.idx = 0;
    this.loaderInterval = null;
  }

  start() {
    if (this.loaderInterval) return; // Prevent starting multiple loaders

    this.loaderInterval = setInterval(() => {
      process.stdout.write(`\rLoading... ${this.spinnerChars[this.idx]}`);
      this.idx = (this.idx + 1) % this.spinnerChars.length; // Loop through spinner chars
    }, 100);
  }

  stop() {
    if (!this.loaderInterval) return; // Only stop if the loader is running

    clearInterval(this.loaderInterval);
    this.loaderInterval = null; // Reset the loader interval
    process.stdout.write('\rDone!         \n'); // Clear line and print "Done!"
  }
}

// Export the Loader class
export default Loader;