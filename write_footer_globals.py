#!/usr/bin/env python3
"""Update Footer teal references to navy and update globals.css"""

# Fix Footer - replace teal hover colors with navy-based green
with open('/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/components/Footer.tsx', 'r') as f:
    footer = f.read()

# Update footer teal references to use green theme consistently
footer = footer.replace('text-teal-400', 'text-warm-400')  # Icons -> gold
footer = footer.replace('hover:text-teal-400', 'hover:text-warm-400')  # Hover -> gold
footer = footer.replace('text-teal-600', 'text-navy-500')

with open('/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/components/Footer.tsx', 'w') as f:
    f.write(footer)
print(f"Footer updated: {len(footer)} chars, gold accents: {'warm-400' in footer}")

# Update globals.css to add green theme custom properties
import os
globals_path = '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/app/globals.css'
with open(globals_path, 'r') as f:
    css = f.read()

# Add custom scrollbar and selection colors if not already present
if '--primary' not in css:
    css += """
/* Green Theme Custom Properties */
:root {
  --primary: #1B4D3E;
  --primary-light: #2D7A5F;
  --primary-dark: #0F2E25;
  --accent: #D4A853;
  --accent-light: #E8C97A;
}

::selection {
  background: rgba(27, 77, 62, 0.2);
  color: #0F2E25;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #2D7A5F; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #1B4D3E; }
"""

with open(globals_path, 'w') as f:
    f.write(css)
print(f"Globals.css updated: {len(css)} chars")
