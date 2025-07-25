module.exports = {
  dashboard: {
    functionality: {
      weight: 3,
      criteria: [
        'Metrics display correctly',
        'Refresh button works',
        'Data updates in real-time',
        'Filter dropdown functions properly',
        'Loading states work correctly'
      ]
    },
    usability: {
      weight: 2.5,
      criteria: [
        'Intuitive navigation',
        'Clear visual hierarchy',
        'Responsive design',
        'Accessible controls',
        'Helpful error messages'
      ]
    },
    performance: {
      weight: 2,
      criteria: [
        'Page loads in < 2s',
        'Smooth animations',
        'No layout shifts',
        'Efficient data loading',
        'Optimized bundle size'
      ]
    },
    design: {
      weight: 2,
      criteria: [
        'Consistent styling',
        'Professional appearance',
        'Proper spacing',
        'Color contrast',
        'Typography hierarchy'
      ]
    },
    testing: {
      weight: 0.5,
      criteria: [
        'Test selectors present',
        'Error boundaries',
        'Edge case handling',
        'Cross-browser compatibility'
      ]
    }
  },
  prompts: {
    functionality: {
      weight: 3,
      criteria: [
        'Create prompt button works',
        'Title and content fields function',
        'Search functionality works',
        'Prompt saving works correctly',
        'Prompt deletion works'
      ]
    },
    usability: {
      weight: 2.5,
      criteria: [
        'Clear form structure',
        'Intuitive workflow',
        'Search is responsive',
        'Validation messages clear',
        'Keyboard navigation works'
      ]
    },
    performance: {
      weight: 2,
      criteria: [
        'Fast form interactions',
        'Quick search results',
        'Efficient data handling',
        'No input lag',
        'Smooth transitions'
      ]
    },
    design: {
      weight: 2,
      criteria: [
        'Clean form layout',
        'Consistent button styles',
        'Proper field spacing',
        'Visual feedback on actions',
        'Mobile-responsive design'
      ]
    },
    testing: {
      weight: 0.5,
      criteria: [
        'Form validation works',
        'Error states handled',
        'Success feedback shown',
        'Data persistence checked'
      ]
    }
  },
  folders: {
    functionality: {
      weight: 3,
      criteria: [
        'Create folder button works',
        'Folder items display correctly',
        'Drag and drop functions',
        'Drop zones work properly',
        'Folder nesting works'
      ]
    },
    usability: {
      weight: 2.5,
      criteria: [
        'Clear drag indicators',
        'Visual drop feedback',
        'Intuitive organization',
        'Undo/redo capability',
        'Context menus work'
      ]
    },
    performance: {
      weight: 2,
      criteria: [
        'Smooth drag animations',
        'Fast folder operations',
        'No lag with many items',
        'Efficient re-rendering',
        'Quick state updates'
      ]
    },
    design: {
      weight: 2,
      criteria: [
        'Clear folder hierarchy',
        'Visual nesting indicators',
        'Consistent icons',
        'Proper hover states',
        'Clean drag preview'
      ]
    },
    testing: {
      weight: 0.5,
      criteria: [
        'Drag constraints work',
        'Invalid drops prevented',
        'State consistency maintained',
        'Edge cases handled'
      ]
    }
  }
};
