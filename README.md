# Vending Machine Simulation

## Overview
The **Vending Machine Simulation** is a web-based application designed to replicate the functionality of a physical vending machine. It allows users to interact with a 3D interface to select products, insert coins, and receive change. The project consists of a **frontend** built with React and A-Frame and a **backend API** built with Node.js.

---

## Features
- **3D Vending Machine Interface**: Interactive 3D environment using A-Frame.
- **Product Selection**: Select products via a keypad or directly in the 3D interface.
- **Coin Insertion**: Insert coins and see real-time balance updates.
- **Cart Management**: Add multiple products to the cart and view a summary.
- **Transaction Confirmation**: Confirm purchases and receive change.
- **Reset Functionality**: Reset the vending machine to its initial state.

---

## Technologies Used
### Frontend
- **React.js**: For building dynamic user interfaces.
- **A-Frame**: For rendering the 3D vending machine environment.
- **Bootstrap**: For responsive styling and pre-designed components.
- **SASS**: For modular and maintainable CSS.

### Backend
- **Node.js**: For building the API.
- **Express.js**: For handling API routes.

### Development & Deployment Tools
- **Visual Studio Code**: For code editing and debugging.
- **Docker**: For containerizing the application and ensuring consistent environments.

---

## Installation & Setup
You can set up the project using one of two methods: **Standard Installation** or **Docker Installation**.

### Option 1: Standard Installation (GitHub + VS Code)
#### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git
- Visual Studio Code (recommended)

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/designcraftsman/distributeur-automatique.git
   cd distributeur-automatique
   ```

2. Set up the backend:
   ```bash
   cd api
   npm install
   npm start
   ```
   The API will be available at `http://localhost:4200`.

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
   The application will be available at `http://localhost:3000`.

---

### Option 2: Docker Installation
#### Prerequisites
- Docker
- Docker Compose

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/designcraftsman/distributeur-automatique.git
   cd distributeur-automatique
   ```

2. Pull the Docker images:
   ```bash
   docker pull designcraftsman/vending-machine-api:latest
   docker pull designcraftsman/vending-machine-frontend:latest
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:4200`

#### Additional Docker Commands
- Stop the containers:
  ```bash
  docker-compose down
  ```
- Rebuild and start the containers:
  ```bash
  docker-compose up --build
  ```
- Run in detached mode:
  ```bash
  docker-compose up -d
  ```

---

## Documentation
Access the full documentation for the project here:  
[Distributeur Automatique Documentation](https://vending-machine-documentation.netlify.app/)

---

## Video Demonstration
Watch the full simulation walkthrough:  
[![Vending Machine Simulation](https://img.youtube.com/vi/oUYrvtr8TXY/0.jpg)](https://www.youtube.com/watch?v=oUYrvtr8TXY)

---

## Contact
For questions or support, contact:
- **Name**: Fayz Oussama
- **Email**: fzoussama25@gmail.com
- **GitHub**: [designcraftsman](https://github.com/designcraftsman)
- **Linkedin**: [Oussama Fayz](https://www.linkedin.com/in/oussama-fayz-9a3a22223/)