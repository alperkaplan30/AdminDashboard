# AdminDashboard

- AdminDashboard is a Node.js and Express-based admin panel with real-time socket communication, Pug template engine and a responsive UI.
- It is the admin panel for a blood collection tube labeling robot used by a health/software company. All real-time communication between the admin panel and the robot is provided by “Socket.io”. The on/off status of the robot, axes, doors and sensors, the movements of the robot on the axes can be observed and the current values can be set to new values. Other tube and label operations can be controlled and the relevant log file can be edited and saved from the log window.

## Installation

- Clone the repository and install dependencies:

- git clone https://github.com/alperkaplan30/AdminDashboard.git

- cd AdminDashboard

- npm install

## Dependencies

- express > Web framework

- socket.io > Real-time communication

- pug > Template engine

- cors, body-parser, cookie-parser > Middleware utilities

- sortablejs > Drag-and-drop sorting

Run the Project

- npm start




