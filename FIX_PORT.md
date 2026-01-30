# Fixing Port Already in Use Error

## Quick Fix

If you get `EADDRINUSE: address already in use :::5000`, here's how to fix it:

### Method 1: Kill the Process (Windows PowerShell)

```powershell
# Find the process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with the actual process ID)
Stop-Process -Id <PID> -Force
```

### Method 2: Change the Port

If you want to use a different port, edit `backend/.env`:

```env
PORT=5001
```

Then update `frontend/vite.config.js` proxy:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5001',  // Change this
    changeOrigin: true,
  },
},
```

### Method 3: One-Liner to Kill Port 5000

```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

## Prevention

Always stop servers properly:
- Press `Ctrl+C` in the terminal
- Or close the terminal window
- Or use `taskkill` command

## Check What's Running

```powershell
# Check all Node processes
Get-Process node

# Check specific port
netstat -ano | findstr :5000
```


