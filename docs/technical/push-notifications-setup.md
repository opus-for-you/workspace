# Push Notifications Setup Guide

This guide documents how to implement push notifications in Opus for future development.

## Overview

Push notifications will enable:
- Weekly review reminders sent to user's browser
- Goal check-in notifications
- Daily reflection prompts
- Custom milestone celebrations

## Architecture

### Components Needed

1. **Service Worker** (`public/sw.js`)
   - Handles push events from the server
   - Displays notifications to users
   - Manages notification clicks/actions

2. **VAPID Keys**
   - Public/private key pair for push authentication
   - Generated once and stored as environment variables
   - Ensures notifications come from trusted source

3. **Subscription Management**
   - Store user's push subscription in database
   - Update when permissions change
   - Handle unsubscribe requests

4. **Server Push System**
   - Send notifications via web-push library
   - Integrate with existing scheduler (node-cron)
   - Queue and retry failed deliveries

## Implementation Steps

### 1. Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Add to `.env`:
```
VAPID_PUBLIC_KEY=your-public-key-here
VAPID_PRIVATE_KEY=your-private-key-here
VAPID_SUBJECT=mailto:your-email@example.com
```

### 2. Database Schema

Add push_subscriptions table:
```typescript
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3. Service Worker Registration

Create `public/sw.js`:
```javascript
self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

Register in `client/src/main.tsx`:
```typescript
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(err => console.error('SW registration failed', err));
}
```

### 4. Frontend: Request Permission

Create `client/src/lib/push-notifications.ts`:
```typescript
export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });
    
    // Send subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
    
    return true;
  }
  
  return false;
}
```

### 5. Backend: Subscription Routes

Create `server/routes/notifications.ts`:
```typescript
import webPush from 'web-push';

webPush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export function registerNotificationRoutes(app: Express) {
  app.post('/api/notifications/subscribe', requireAuth, async (req, res) => {
    const subscription = req.body;
    
    await storage.savePushSubscription(req.user!.id, {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });
    
    res.sendStatus(201);
  });
  
  app.post('/api/notifications/unsubscribe', requireAuth, async (req, res) => {
    await storage.deletePushSubscription(req.user!.id);
    res.sendStatus(204);
  });
}
```

### 6. Backend: Send Notifications

Update `server/lib/scheduler.ts`:
```typescript
async function sendWeeklyReviewReminders() {
  const users = await storage.getAllUsers();
  
  for (const user of users) {
    const subscriptions = await storage.getPushSubscriptions(user.id);
    
    for (const sub of subscriptions) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        }
      };
      
      const payload = JSON.stringify({
        title: 'Weekly Review Time',
        body: 'Reflect on your week and plan ahead',
        url: '/reflect',
      });
      
      try {
        await webPush.sendNotification(pushSubscription, payload);
      } catch (error) {
        if (error.statusCode === 410) {
          // Subscription expired, remove it
          await storage.deletePushSubscription(user.id);
        }
      }
    }
  }
}
```

### 7. User Settings UI

Add notification preferences page:
```tsx
function NotificationSettings() {
  const [enabled, setEnabled] = useState(false);
  
  const handleToggle = async () => {
    if (!enabled) {
      const success = await requestNotificationPermission();
      setEnabled(success);
    } else {
      await fetch('/api/notifications/unsubscribe', { method: 'POST' });
      setEnabled(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Receive reminders and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Switch checked={enabled} onCheckedChange={handleToggle} />
          <span>Enable browser notifications</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Testing

### Local Testing
1. Use HTTPS or localhost (push requires secure context)
2. Open DevTools → Application → Service Workers
3. Verify service worker is registered
4. Use Application → Push Messaging to test

### Production Testing
1. Deploy to Replit (automatically HTTPS)
2. Test permission request flow
3. Verify notifications appear
4. Test notification clicks navigate correctly

## Browser Compatibility

- Chrome: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ iOS 16.4+, macOS 13+
- Edge: ✅ Full support

## Security Considerations

1. **VAPID Keys**: Keep private key secret, never expose in frontend
2. **User Consent**: Always request permission explicitly
3. **Subscription Storage**: Encrypt sensitive subscription data
4. **Rate Limiting**: Prevent notification spam
5. **Unsubscribe**: Provide easy opt-out mechanism

## Integration with Existing Systems

### Scheduler Integration
The existing `server/lib/scheduler.ts` already has placeholder notification logic. Replace console.log statements with actual push notifications once implemented.

### AI Integration
Combine AI-generated reflection prompts with push notifications for personalized reminders.

### Week Gating
Send milestone notifications when users complete weeks (week 4, 13, 26, 52).

## Future Enhancements

1. **Notification Preferences**: Let users choose which notifications to receive
2. **Quiet Hours**: Don't send notifications during user's sleep time
3. **Custom Schedules**: User-defined reminder times
4. **Action Buttons**: Quick actions in notifications (mark complete, snooze)
5. **Rich Notifications**: Images, progress bars, interactive elements

## Resources

- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [web-push NPM Package](https://www.npmjs.com/package/web-push)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## Current Status

✅ Dependencies installed (web-push package)
✅ Environment variables documented in .env.example
✅ Scheduler foundation ready for integration
⏳ Implementation pending - see steps above
