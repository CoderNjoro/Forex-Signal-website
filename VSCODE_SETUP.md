# Running the Application in VSCode

## 🚀 Quick Start Methods

### Method 1: Using VSCode Tasks (Recommended)

1. **Open the project in VSCode**
   - Open VSCode
   - File → Open Folder → Select `ffsignal` folder

2. **Open Terminal Menu**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Tasks: Run Task"
   - Select **"Start Full Stack"**

   This will start both backend and frontend servers in separate terminal panels.

### Method 2: Using Integrated Terminal (Manual)

1. **Open VSCode Terminal**
   - Press `` Ctrl+` `` (backtick) or View → Terminal
   - Or use Terminal → New Terminal

2. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (Terminal 2)
   - Click the `+` button in terminal to create a new terminal
   - Or press `Ctrl+Shift+` `` (backtick) for new terminal
   ```bash
   cd frontend
   npm run dev
   ```

### Method 3: Using Debug Panel

1. **Open Debug Panel**
   - Press `F5` or click the Debug icon in sidebar
   - Or View → Run and Debug

2. **Select Configuration**
   - Choose **"Launch Full Stack"** from dropdown
   - Click the green play button

   This will start both servers with debugging enabled.

## 📋 Step-by-Step Guide

### First Time Setup

1. **Install Dependencies**
   ```bash
   # In VSCode terminal, run:
   cd backend
   npm install
   
   cd ../frontend
   npm install
   ```

2. **Configure Environment**
   - Make sure `backend/.env` exists with your MongoDB connection
   - Check that MongoDB is running locally

3. **Start Servers**
   - Use any of the methods above

### Running the Application

#### Option A: Two Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: `Server running in development mode on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:3000`

#### Option B: Using VSCode Tasks

1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "Start Full Stack"
4. Both servers will start automatically

## 🎯 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🛠️ VSCode Features

### Debugging

1. Set breakpoints in your code
2. Press `F5` to start debugging
3. Select "Launch Backend" or "Launch Frontend"
4. Code will pause at breakpoints

### Terminal Management

- **Split Terminal**: `` Ctrl+\ ``
- **New Terminal**: `` Ctrl+Shift+` ``
- **Kill Terminal**: Click trash icon or type `exit`

### Useful Extensions

Recommended VSCode extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **MongoDB for VS Code**
- **Thunder Client** (for API testing)

## 🐛 Troubleshooting

### Port Already in Use

If you see "port 5000/3000 already in use":
```bash
# Find and kill the process
# Windows PowerShell:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change the port in .env file
```

### MongoDB Connection Error

- Make sure MongoDB is running
- Check `backend/.env` has correct `MONGODB_URI`
- Verify database name is correct

### Dependencies Not Installed

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Hot Reload Not Working

- Save the file (`Ctrl+S`)
- Check terminal for errors
- Restart the dev server

## 📝 Quick Commands Reference

| Action | Command |
|-------|---------|
| New Terminal | `` Ctrl+Shift+` `` |
| Run Task | `Ctrl+Shift+P` → "Tasks: Run Task" |
| Start Debugging | `F5` |
| Stop Debugging | `Shift+F5` |
| Split Terminal | `` Ctrl+\ `` |
| Format Document | `Shift+Alt+F` |

## 🎨 Workspace Features

The `.vscode` folder includes:
- **launch.json** - Debug configurations
- **tasks.json** - Task runner configurations
- **settings.json** - Workspace settings

## 💡 Tips

1. **Use Integrated Terminal**: Keep everything in VSCode
2. **Split View**: View code and terminal side-by-side
3. **Debug Mode**: Use breakpoints to debug your code
4. **Tasks**: Use tasks for common operations
5. **Extensions**: Install recommended extensions for better experience

## 🔄 Restarting Servers

To restart servers:
1. Stop the terminal (click trash icon)
2. Run the task again or use terminal commands
3. Or use `Ctrl+C` in terminal, then restart

Happy coding! 🚀

