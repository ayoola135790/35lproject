# Glucolog

This is the GitHub repository for **Glucolog**, created for **CS35L** by team members **Saanvi Nandanwar, Tiffany Orian, Constine, David, Ayoola, Emanuel**.

## About the Project  
**Glucolog** is a comprehensive web application designed to assist individuals with **Type 1 Diabetes** in tracking and managing their blood sugar levels. The app integrates with **DEXCOM** to collect blood sugar data and presents it in an interactive, user-friendly dashboard. Users can log and visualize their blood sugar levels, track historical data trends, and maintain a journal to record their responses and add notes. Additionally, users can choose to have their data analyzed using **ChatGPT** to gain insights and recommendations for managing their blood sugar levels.

### Key Features  
- **Blood Sugar Tracking:** Users can log and visualize their blood sugar levels through dynamic charts.
- **Historical Data View:** Track blood sugar trends over **days, weeks, months, and years**.
- **Manual AI Analysis:** Users can copy their historical blood sugar data and input it into **ChatGPT** for personalized insights.
- **Secure Authentication:** Users must sign in via **email and password** and authenticate their **DEXCOM account** for data access.
- **Journal/Log:** Users can maintain a journal to track their responses and add any notes.

---

## Built With  
### Frontend
- **React.js:** A JavaScript library for building user interfaces.
- **Vite:** A build tool that aims to provide a faster and leaner development experience for modern web projects.
- **HTML5 & CSS3:** For structuring and styling the web pages.
- **Chart.js:** A JavaScript library for creating charts.

### Backend
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js:** A minimal and flexible Node.js web application framework.
- **Python (Flask):** A micro web framework written in Python.

### Database
- **Firebase:** A platform developed by Google for creating mobile and web applications.

### API
- **DEXCOM API:** For accessing blood sugar data.

---

## Running the Web App  
To clone and run this project, follow these steps:  

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- **Python** and **pip** installed on your machine.

### 1. Clone the Repository  
```bash
git clone https://github.com/your-repo-name.git
cd your-repo-name
```

### 2. Install Frontend Dependencies  
```bash
cd T1D-BloodSugar-App/frontend
npm install
```

### 3. Install Backend Dependencies  
```bash
cd ../backend
npm install
```

### 4. Install Python Dependencies  
```bash
cd ../python-backend
pip install -r requirements.txt
```

### Running the Application
1. **Start the frontend:**
   ```bash
   cd T1D-BloodSugar-App/frontend
   npm run dev
   ```

2. **Start the backend:**
   ```bash
   cd ../backend
   npm start
   ```

3. **Start the Python backend:**
   ```bash
   cd ../python-backend
   flask run
   ```

### Usage
1. **Sign Up:** Create an account using your email, phone, or username.
2. **Log In:** Log in using your credentials.
3. **Track Blood Sugar:** View and analyze your blood sugar data on the dashboard.
4. **Journal:** Maintain a journal to track your responses and add notes.
5. **AI Analysis:** Copy your historical blood sugar data and input it into ChatGPT for personalized insights.

---

## Project Structure
```
T1D-BloodSugar-App/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── app.js
│   ├── package.json
├── python-backend/
│   ├── app.py
│   ├── requirements.txt
├── README.md
```

---

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact
For any questions or feedback, please contact the project maintainers:
- **Saanvi Nandanwar**
- **Tiffany Orian**
- **Constine**
- **David**
- **Ayoola**
- **Emanuel**