# Quick Start Guide - Forex Signals Platform

## ✅ Setup Complete!

Your platform is now running with:
- **Database**: `forex-signal-site` (connected to local MongoDB)
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## 🔑 Admin Login Credentials

**Email**: admin@forex.com  
**Password**: admin123  
**Username**: admin

## 📝 Steps to Start Using:

### 1. Access the Platform
- Open your browser and go to: **http://localhost:3000**

### 2. Login as Admin
- Click "Login" in the top right
- Enter:
  - Email: `admin@forex.com`
  - Password: `admin123`

### 3. Access Admin Panel
- After logging in, you'll see an "Admin" link in the navbar
- Click it or go directly to: **http://localhost:3000/admin**

### 4. Create Your First Signal
- In the Admin Panel, click "Create Signal" tab
- Fill in the form:
  - **Currency Pair**: Select from dropdown (e.g., EUR/USD)
  - **Type**: Buy or Sell
  - **Entry Price**: Current market price
  - **Stop Loss**: Your stop loss level
  - **Take Profit**: Add one or more TP levels
  - **Timeframe**: Select (e.g., H1, H4, D1)
  - **Analysis**: Optional notes
- Click "Create Signal"

### 5. View Signals
- Go to "Signals" page to see all signals
- Use filters to find specific signals
- Click on any signal to see details

## 🎯 Features Available:

✅ **User Management**: Register new users (they'll be regular users by default)  
✅ **Signal Creation**: Create, edit, and delete trading signals  
✅ **Real-time Updates**: New signals appear instantly for all users  
✅ **Filtering**: Filter by pair, status, type, timeframe  
✅ **Performance Tracking**: View statistics in Admin Panel  
✅ **Dashboard**: Users can see active signals on their dashboard  

## 📊 Database Information

- **Database Name**: `forex-signal-site`
- **Collections**:
  - `users` - All user accounts
  - `signals` - All trading signals
  - `performances` - Performance statistics

## 🔧 If You Need to Create More Admin Users

Run this command in the backend folder:
```bash
cd backend
node scripts/createAdmin.js email@example.com password username
```

## 💡 Tips

- All user registrations are saved to your MongoDB database
- Signals are stored and persist across server restarts
- Real-time updates work automatically via Socket.io
- You can update signal status (active → closed) and add results (win/loss/pips)

Enjoy using your Forex Signals Platform! 🚀


