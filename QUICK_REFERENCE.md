# Quick Reference Card - Admin Signal Management

## 🚀 Quick Access
- **URL**: http://localhost:3001/admin
- **Tab**: "Manage Signals"
- **Login**: admin@forex.com / admin123

---

## 📋 Common Tasks

### Mark TP as Hit
1. Click "Update Status"
2. Click "Mark as Hit" for desired TP
3. Done! ✓

### Mark SL Hit
1. Click "Update Status"
2. Click "Mark SL Hit"
3. Confirm
4. Done! Signal closed as loss

### Set Breakeven
1. Click "Update Status"
2. Click "Mark Breakeven"
3. Confirm
4. Done! Signal closed at breakeven

### Custom Close
1. Click "Update Status"
2. Scroll to "Custom Close"
3. Enter: Closing Price, Result, Pips
4. Click "Close Signal"
5. Done!

---

## 🎨 Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| ✓ Green checkmark | TP level hit |
| Strikethrough text | TP already hit |
| Yellow badge | Signal at breakeven |
| Green "✓ Hit" button | TP marked as hit |
| Gray "Mark as Hit" | TP not hit yet |
| Red "Mark SL Hit" | Close as loss |
| Yellow "Mark Breakeven" | Close at breakeven |

---

## 🔑 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | ESC |
| Confirm Dialog | Enter |
| Cancel Dialog | ESC |

---

## 📊 Signal States

```
ACTIVE → Can update TPs, mark SL/BE, or custom close
CLOSED → Can only view or delete
CANCELLED → Can only view or delete
```

---

## ⚡ Quick Tips

✅ **DO:**
- Mark TPs as they hit in real-time
- Use SL Hit for quick losses
- Use Breakeven when SL moved to entry
- Use Custom Close for partial closes

❌ **DON'T:**
- Delete signals with history (users need to see)
- Mark all TPs at once (unless all actually hit)
- Forget to confirm SL/Breakeven actions

---

## 🔄 Real-time Updates

Updates appear on user side:
- **Instantly** (< 1 second)
- **Automatically** (no refresh needed)
- **Reliably** (via WebSocket)

---

## 🎯 Best Practices

1. **Update signals as they happen** (real-time is best)
2. **Use appropriate actions** (TP hit vs SL hit vs Custom)
3. **Double-check before closing** (can't undo)
4. **Keep signals for history** (don't delete unless necessary)
5. **Monitor user view** (verify updates appear)

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Modal won't open | Refresh page, check console |
| Updates not saving | Check network tab, verify admin auth |
| Real-time not working | Check WebSocket connection |
| Button stuck | Refresh page |

---

## 📱 Mobile Access

✅ Fully responsive
✅ Touch-friendly buttons
✅ Optimized for tablets
⚠️ Best on desktop for admin tasks

---

## 🔒 Security Notes

- Only admins can update signals
- All actions logged
- Requires authentication
- Protected API endpoints

---

## 📞 Need Help?

1. Check `TESTING_GUIDE.md`
2. Check `ADMIN_SIGNAL_MANAGEMENT.md`
3. Check browser console
4. Check backend logs

---

## 🎓 Training Checklist

For new admins:
- [ ] Can access Manage Signals tab
- [ ] Can filter signals
- [ ] Can mark TP as hit
- [ ] Can mark SL hit
- [ ] Can set breakeven
- [ ] Can custom close
- [ ] Can delete signals
- [ ] Understands real-time updates
- [ ] Knows when to use each action

---

**Print this card for quick reference! 📄**
