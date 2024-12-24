// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register';
import '@cypress/code-coverage/support';
import 'cypress-file-upload';

// Cypress.on('window:before:load', (win) => {
//     class MockWebSocket {
//       constructor(url) {
//         this.url = url;
//         this.readyState = WebSocket.CONNECTING;
        
//         setTimeout(() => {
//           this.readyState = WebSocket.OPEN;
//           if (this.onopen) this.onopen();
//         }, 100);
//       }
  
//       send(data) {
//         if (this.mockServerCallback) {
//           this.mockServerCallback(JSON.parse(data));
//         }
//       }
  
//       close() {
//         this.readyState = WebSocket.CLOSED;
//         if (this.onclose) this.onclose();
//       }
  
//       // Method to simulate receiving messages from server
//       mockReceive(data) {
//         if (this.onmessage) {
//           this.onmessage({ data: JSON.stringify(data) });
//         }
//       }
  
//       // Method to set up response handling
//       mockServerImplementation(callback) {
//         this.mockServerCallback = callback;
//       }
//     }
  
//     MockWebSocket.CONNECTING = 0;
//     MockWebSocket.OPEN = 1;
//     MockWebSocket.CLOSING = 2;
//     MockWebSocket.CLOSED = 3;
  
//     // Replace native WebSocket with mock
//     delete win.WebSocket;
//     win.WebSocket = MockWebSocket;
//   });


Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false prevents Cypress from failing the test
    return false;
  });


// Alternatively you can use CommonJS syntax:
// require('./commands')