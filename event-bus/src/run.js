// Simple long-running process for event-bus when running in containers
const bootstrap = require('./bootstrap');
console.log('Event-bus bootstrap complete. Running...');

// Keep process alive
setInterval(()=>{}, 1000);
