# List Management Page Standard Pattern

## Overview

All "All Items" pages in the Admin Panel now follow a consistent, professional UI pattern with:

- ✅ Table view with pagination
- ✅ Search functionality
- ✅ Sorting options (Newest, Oldest, A-Z, Z-A)
- ✅ Add/Create button in header
- ✅ Edit, View, Delete action buttons per row
- ✅ Responsive design (mobile-friendly)

## Pages Refactored

### Co-circular Management

- ✅ **AllMentor** (`/member/all`) - Members table with full CRUD actions
- ✅ **AllEvent** (`/event/all`) - Events table with view/edit/delete
- ✅ **AllNews** (`/news`) - News articles with visibility toggle
- ✅ **AllHeader** (`/landpage/header/all`) - Landing page headers
- ✅ **AllTestimorals** (`/landpage/testimorals/all`) - Testimonials
- ✅ **AllAchievement** (`/landpage/achievement/all`) - Achievements
- ✅ **AllGallary** (`/gallery`) - Gallery albums
- ✅ **Contact** (`/contact`) - Contact form submissions

## Component Structure

### 1. **ListPageHeader Component**

**Location:** `src/components/common/ListPageHeader.jsx`

**Props:**

```javascript
{
  title: string,              // Page title
  searchValue: string,        // Current search text
  onSearchChange: function,   // Search input handler
  addButtonText: string,      // Button label (default: "Add New")
  addButtonPath: string,      // Navigation path for Add button
  searchPlaceholder: string   // Search input placeholder
}
```

**Features:**

- Responsive title + Add button header (flex-col on mobile, flex-row on desktop)
- Search bar with icon
- Uses `.admin-btn` and `.admin-input` utility classes

### 2. **FilterToolbar Component**

**Location:** `src/components/common/FilterToolbar.jsx`

**Props:**

```javascript
{
  sortValue: string,          // Current sort selection
  onSortChange: function,     // Sort dropdown handler
  filterValue: string,        // Current filter selection (optional)
  onFilterChange: function,   // Filter dropdown handler (optional)
  sortOptions: array,         // Sort dropdown options (default: 4 options)
  filterOptions: array,       // Filter dropdown options (default: empty)
  showFilter: boolean         // Show/hide filter dropdown
}
```

**Features:**

- Sort dropdown (required, always visible)
- Conditional filter dropdown
- Responsive layout
- Uses `.admin-input` styling

### 3. **DataTable Component** (Enhanced)

**Location:** `src/components/common/DataTable.jsx`

**Props:**

```javascript
{
  columns: array,             // Column definitions
  rows: array,                // Data rows
  emptyText: string,          // Empty state message
  pageSize: number            // Items per page (default: 8)
}
```

**Column Definition:**

```javascript
{
  key: string,                // Data key to display
  label: string,              // Table header label
  render: function(row)       // Optional: custom cell renderer
}
```

**Features:**

- Automatic pagination at 8 items/page
- Hover states on rows
- Empty state handling
- Results counter ("Showing X to Y of Z")

## Implementation Template

```jsx
import { useState, useContext, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { YourContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import ListPageHeader from "../../common/ListPageHeader";
import FilterToolbar from "../../common/FilterToolbar";
import DataTable from "../../common/DataTable";
import { toast } from "react-toastify";

const AllItems = () => {
  const { getItems, handelgetItems } = useContext(YourContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("");
  const [itemsData, setItemsData] = useState(getItems || []);

  useEffect(() => {
    handelgetItems();
  }, []);

  useEffect(() => {
    setItemsData(getItems || []);
  }, [getItems]);

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let data = [...itemsData];

    // Search filter
    if (search.trim()) {
      data = data.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sort logic
    if (sort === "asc") {
      data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sort === "desc") {
      data.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sort === "newest") {
      data.reverse();
    }

    return data;
  }, [itemsData, search, sort, filter]);

  // Table Columns with Actions
  const columns = [
    { key: "name", label: "Item Name" },
    { key: "email", label: "Email" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/item/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/item/update/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Delete this item?")) {
                // TODO: Call delete handler
                toast.success("Item deleted");
              }
            }}
            className="admin-btn admin-btn-danger p-2 flex items-center gap-1"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (!itemsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="All Items"
        searchValue={search}
        onSearchChange={setSearch}
        addButtonText="Add Item"
        addButtonPath="/item/add"
        searchPlaceholder="Search items..."
      />

      <FilterToolbar
        sortValue={sort}
        onSortChange={setSort}
        filterValue={filter}
        onFilterChange={setFilter}
      />

      <DataTable
        columns={columns}
        rows={filteredData}
        emptyText="No items found"
        pageSize={8}
      />
    </div>
  );
};

export default AllItems;
```

## CSS Classes Used

- `.admin-heading` - Page title styling
- `.admin-input` - Input/select styling
- `.admin-btn admin-btn-primary` - Primary action button (add)
- `.admin-btn admin-btn-secondary` - Secondary action buttons (view/edit)
- `.admin-btn admin-btn-danger` - Delete button
- `.admin-card` - Card/table container styling
- `.admin-surface` - Surface area styling

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile responsive (tested on viewport widths from 320px+)
- ✅ Accessible keyboard navigation

## Performance Notes

- Pagination: 8 items/page by default
- Search/sort uses `useMemo` to avoid unnecessary recalculations
- DataTable includes overflow handling for wide tables on mobile

## Future Enhancements

- [ ] Bulk actions (select multiple, bulk delete)
- [ ] Column visibility toggle
- [ ] Export to CSV
- [ ] Advanced filter builder
- [ ] Inline editing for quick updates
- [ ] Custom page size selector
