# Testing Guide - Admin Signal Management

## Prerequisites
✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:3000
✅ MongoDB connected
✅ Admin account available (admin@forex.com / admin123)

## Test Scenarios

### Test 1: Access Admin Signal Management
**Steps:**
1. Login as admin (admin@forex.com / admin123)
2. Navigate to Admin Panel
3. Click on "Manage Signals" tab

**Expected Result:**
- New "Manage Signals" tab is visible
- Can see list of signals with filter buttons (Active/Closed/All)
- Each signal card shows TP levels and status

---

### Test 2: Create a Test Signal
**Steps:**
1. Go to "Create Signal" tab
2. Fill in the form:
   - Pair: EUR/USD
   - Type: Buy
   - Entry Price: 1.0850
   - Stop Loss: 1.0800
   - Take Profit: 1.0900, 1.0950, 1.1000
   - Timeframe: H4
3. Click "Create Signal"

**Expected Result:**
- Signal created successfully
- Toast notification appears
- Signal appears in "Manage Signals" tab
- Signal visible to users in real-time

---

### Test 3: Mark TP1 as Hit
**Steps:**
1. In "Manage Signals" tab, find the test signal
2. Click "Update Status" button
3. Modal opens showing signal details
4. Click "Mark as Hit" for TP1 (1.0900)

**Expected Result:**
- Button changes to green "✓ Hit"
- Toast notification confirms update
- **Check user view**: TP1 should show checkmark and strikethrough
- Signal remains active (not all TPs hit yet)

---

### Test 4: Mark TP2 as Hit
**Steps:**
1. In the same modal, click "Mark as Hit" for TP2 (1.0950)

**Expected Result:**
- TP2 button turns green "✓ Hit"
- **Check user view**: TP2 now shows checkmark and strikethrough
- Signal still active

---

### Test 5: Mark TP3 as Hit (Auto-Close)
**Steps:**
1. Click "Mark as Hit" for TP3 (1.1000)

**Expected Result:**
- TP3 marked as hit
- Signal automatically closes
- Status changes to "closed"
- Result set to "win"
- Pips calculated automatically
- Modal can be closed
- **Check user view**: Signal shows as closed with all TPs hit

---

### Test 6: Create New Signal and Mark SL Hit
**Steps:**
1. Create another test signal (GBP/USD)
2. Go to "Manage Signals"
3. Click "Update Status"
4. Click "Mark SL Hit" in Quick Actions
5. Confirm the action

**Expected Result:**
- Signal closes immediately
- Status: "closed"
- Result: "loss"
- Negative pips calculated
- **Check user view**: Signal shows as loss
- Performance stats updated

---

### Test 7: Create Signal and Set Breakeven
**Steps:**
1. Create another test signal (USD/JPY)
2. Go to "Manage Signals"
3. Click "Update Status"
4. Click "Mark Breakeven" in Quick Actions
5. Confirm the action

**Expected Result:**
- Signal closes
- Status: "closed"
- Result: "breakeven"
- Pips: 0
- Yellow "Breakeven" badge appears
- **Check user view**: Shows breakeven badge

---

### Test 8: Custom Close
**Steps:**
1. Create another test signal
2. Go to "Manage Signals"
3. Click "Update Status"
4. Scroll to "Custom Close" section
5. Fill in:
   - Closing Price: 1.0925
   - Result: Win
   - Pips: +75
6. Click "Close Signal"

**Expected Result:**
- Signal closes with custom values
- All specified values saved correctly
- **Check user view**: Shows correct result and pips

---

### Test 9: Real-time Updates
**Steps:**
1. Open two browser windows:
   - Window 1: Admin panel
   - Window 2: User view (signals page)
2. In admin panel, update a signal (mark TP as hit)
3. Watch Window 2 (user view)

**Expected Result:**
- User view updates immediately
- No page refresh needed
- Checkmark appears on TP level
- Changes visible within 1 second

---

### Test 10: Delete Signal
**Steps:**
1. In "Manage Signals" tab
2. Click "Delete" button on a signal
3. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- Signal removed from list
- Toast notification confirms deletion
- **Check user view**: Signal no longer visible

---

## Visual Checks

### Admin View Checklist
- [ ] "Manage Signals" tab visible
- [ ] Filter buttons work (Active/Closed/All)
- [ ] Signal cards show all information
- [ ] "Update Status" button on active signals
- [ ] "Delete" button on all signals
- [ ] Modal opens correctly
- [ ] TP toggle buttons work
- [ ] Quick action buttons work
- [ ] Custom close form works

### User View Checklist
- [ ] TP hits show checkmarks (✓)
- [ ] Hit TPs have strikethrough styling
- [ ] Breakeven badge appears (yellow)
- [ ] Status updates in real-time
- [ ] Signal cards display correctly
- [ ] Signal details page enhanced
- [ ] No console errors

---

## API Testing (Optional)

### Using curl or Postman:

**Mark TP Hit:**
```bash
curl -X PUT http://localhost:5000/api/signals/{signalId}/tp-hit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"tpIndex": 0, "isHit": true}'
```

**Mark SL Hit:**
```bash
curl -X PUT http://localhost:5000/api/signals/{signalId}/sl-hit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Mark Breakeven:**
```bash
curl -X PUT http://localhost:5000/api/signals/{signalId}/breakeven \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"breakEvenPrice": 1.0850}'
```

**Custom Close:**
```bash
curl -X PUT http://localhost:5000/api/signals/{signalId}/close \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"closingPrice": 1.0925, "result": "win", "pips": 75}'
```

---

## Troubleshooting

### Issue: Modal doesn't open
**Solution:** Check browser console for errors, verify React components loaded

### Issue: Updates not saving
**Solution:** 
- Check admin authentication
- Verify network requests in browser dev tools
- Check backend logs

### Issue: Real-time updates not working
**Solution:**
- Check WebSocket connection in browser console
- Verify Socket.io is running on backend
- Check for CORS issues

### Issue: TP hits not showing
**Solution:**
- Clear browser cache
- Check signal object has `tpHits` array
- Verify component is receiving updated signal

---

## Performance Testing

1. **Create 20+ signals**
2. **Update multiple signals rapidly**
3. **Check for:**
   - Memory leaks
   - Slow rendering
   - Socket connection stability
   - Database performance

---

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)

---

## Success Criteria

✅ All 10 test scenarios pass
✅ No console errors
✅ Real-time updates work smoothly
✅ UI is responsive and intuitive
✅ All visual elements display correctly
✅ Performance is acceptable

---

**Happy Testing! 🧪**

If you find any issues, check:
1. Browser console for errors
2. Backend terminal for server errors
3. Network tab for failed requests
4. MongoDB connection status
