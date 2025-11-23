# Calendar Component Structure

## 📂 Component Organization

```
src/
├── pages/
│   └── CalendarPage.jsx          # Main calendar page
└── components/
    └── Calendar/
        ├── CalendarHeader.jsx    # Month/year header with navigation
        ├── CalendarGrid.jsx      # Main calendar grid layout
        ├── CalendarCell.jsx      # Individual date cell
        ├── CalendarEvent.jsx     # Event card display
        ├── CalendarSidebar.jsx   # Right sidebar with lists
        └── CalendarLegend.jsx    # Color legend items
```

## 🎨 Components Description

### 1. **CalendarPage.jsx**

Main page component that manages calendar state and events

- Handles month navigation (prev/next)
- Manages events data
- Coordinates all child components

**Props:** None (top-level page)

**State:**

- `currentDate`: Current displayed month/year
- `events`: Array of calendar events

---

### 2. **CalendarHeader.jsx**

Displays month/year title and navigation controls

**Props:**

- `currentDate`: Current date object
- `onPrevMonth`: Function to go to previous month
- `onNextMonth`: Function to go to next month
- `onToday`: Function to jump to today

**Features:**

- Large month/year display
- Previous/Next month buttons
- "Today" quick navigation button

---

### 3. **CalendarGrid.jsx**

Renders the calendar grid with week headers and date cells

**Props:**

- `currentDate`: Current date object
- `events`: Array of events to display

**Features:**

- Week day headers (SUN-SAT)
- 6-week grid layout (42 cells)
- Shows previous/next month overflow dates
- Passes events to individual cells

---

### 4. **CalendarCell.jsx**

Individual date cell in the calendar grid

**Props:**

- `day`: Day number (1-31)
- `isCurrentMonth`: Boolean if day belongs to current month
- `date`: Full date object
- `events`: Array of events for this date
- `isToday`: Boolean if this is today's date

**Features:**

- Gray background for non-current month dates
- Blue highlight for today
- Displays day number
- Renders event cards

---

### 5. **CalendarEvent.jsx**

Event card displayed inside calendar cells

**Props:**

- `event`: Event object
  - `id`: Unique identifier
  - `title`: Event title
  - `date`: Event date
  - `type`: Event type
  - `color`: Color theme (purple/pink/beige/blue)

**Features:**

- Color-coded by event type
- Truncated text with tooltip
- Hover effect
- Click support (extendable)

---

### 6. **CalendarSidebar.jsx**

Right sidebar with content type information

**Props:** None

**Features:**

- Content Type bullet list
- Color legend section
- Styled cards with white background

---

### 7. **CalendarLegend.jsx**

Individual legend item with color indicator

**Props:**

- `label`: Legend label text
- `color`: Color theme (purple/pink/beige/blue)

**Features:**

- Colored rounded indicator
- Label text

---

## 🎨 Color Scheme

### Event Colors

- **Purple**: Social Media content (`bg-purple-200`)
- **Pink**: Posts (`bg-pink-200`)
- **Beige**: Videos (`bg-amber-100`)
- **Blue**: Media Printing (`bg-blue-200`)

### Background

- Main page: `bg-[#F5F3EF]` (cream/beige)
- Cards: `bg-white` with `rounded-2xl`
- Dark mode support for all colors

---

## 🚀 Usage Example

```jsx
// In your App.jsx or routing
import CalendarPage from './pages/CalendarPage';

// Add route
<Route path="/calendar" element={<CalendarPage />} />
```

---

## 📝 Event Data Structure

```javascript
{
  id: 1,
  title: "How-to tutorials",
  date: new Date(2025, 3, 1), // April 1, 2025
  type: "social-media",
  color: "purple"
}
```

---

## ✨ Features

- ✅ Month/Year navigation
- ✅ Today quick jump
- ✅ Color-coded events
- ✅ Multi-event per day support
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Previous/next month overflow dates
- ✅ Today highlighting
- ✅ Hover effects
- ✅ Clean component separation

---

## 🔮 Future Enhancements

- [ ] Add event modal on click
- [ ] Drag & drop events
- [ ] Create new event functionality
- [ ] Week/Day view modes
- [ ] Event filtering by type
- [ ] Export calendar
- [ ] Event search
- [ ] Recurring events
- [ ] Integration with task system

---

## 🎯 Design Inspiration

Based on modern social media content calendar design with:

- Clean, minimalist layout
- Soft color palette
- Clear typography
- Intuitive navigation
- Professional appearance
