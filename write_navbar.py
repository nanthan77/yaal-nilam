#!/usr/bin/env python3
"""Update Navbar with gold accent CTA button"""

with open('/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/components/Navbar.tsx', 'r') as f:
    content = f.read()

# Update Add Listing button to gold accent (desktop)
content = content.replace(
    'className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200"',
    'className="hidden sm:flex items-center gap-2 px-4 py-2 bg-warm-500 text-navy-900 rounded-lg font-bold hover:bg-warm-400 transition-all duration-200 shadow-sm hover:-translate-y-0.5"'
)

# Update Add Listing button to gold accent (mobile)
content = content.replace(
    'className="block mx-2 mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200 text-center"',
    'className="block mx-2 mt-4 px-4 py-2 bg-warm-500 text-navy-900 rounded-lg font-bold hover:bg-warm-400 transition-all duration-200 text-center"'
)

# Update hover states on nav links to match green theme better
content = content.replace(
    'hover:text-teal-500 transition-colors duration-200 rounded-md hover:bg-teal-50',
    'hover:text-navy-500 transition-colors duration-200 rounded-md hover:bg-navy-50'
)

# Mobile nav links
content = content.replace(
    'hover:text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200',
    'hover:text-navy-500 hover:bg-navy-50 rounded-md transition-colors duration-200'
)

with open('/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/components/Navbar.tsx', 'w') as f:
    f.write(content)

print(f"Navbar updated: {len(content)} chars")
print(f"Gold CTA: {'warm-500' in content}")
