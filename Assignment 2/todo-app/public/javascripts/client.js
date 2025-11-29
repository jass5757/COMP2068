// Check for notifications on authenticated pages
document.addEventListener('DOMContentLoaded', () => {
  // Only check notifications on task pages
  if (window.location.pathname.startsWith('/tasks') && 
      !window.location.pathname.includes('/add') && 
      !window.location.pathname.includes('/edit') &&
      !window.location.pathname.includes('/delete')) {
    checkNotifications();
    // Check every minute
    setInterval(checkNotifications, 60000);
  }
});

// Check for overdue and due today tasks
async function checkNotifications() {
  try {
    const response = await fetch('/tasks/api/notifications');
    
    if (!response.ok) return;
    
    const data = await response.json();
    const totalNotifications = data.overdue + data.dueToday;
    
    const badge = document.getElementById('notificationBadge');
    const message = document.getElementById('notificationMessage');
    
    if (totalNotifications > 0 && badge && message) {
      let notificationText = '';
      
      if (data.overdue > 0) {
        notificationText = `You have ${data.overdue} overdue task${data.overdue > 1 ? 's' : ''}!`;
      } else if (data.dueToday > 0) {
        notificationText = `You have ${data.dueToday} task${data.dueToday > 1 ? 's' : ''} due today!`;
      }
      
      message.textContent = notificationText;
      badge.style.display = 'block';
      
      // Request browser notification permission
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Task Reminder', {
          body: notificationText,
          icon: '/favicon.ico'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  } catch (err) {
    console.error('Error checking notifications:', err);
  }
}

// Form validation for add/edit pages
const taskForm = document.querySelector('form[action*="/tasks"]');
if (taskForm) {
  taskForm.addEventListener('submit', (e) => {
    const title = document.getElementById('title');
    if (title && title.value.trim() === '') {
      e.preventDefault();
      alert('Please enter a task title');
      title.focus();
    }
  });
}