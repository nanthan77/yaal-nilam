#!/usr/bin/env python3
"""Update remaining pages to use green/gold theme consistently"""

pages = [
    '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/app/about/page.tsx',
    '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/app/contact/page.tsx',
    '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/app/properties/page.tsx',
    '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/app/add-listing/page.tsx',
    '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/components/PropertyDetailClient.tsx',
    '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/components/AreaPageClient.tsx',
]

for path in pages:
    try:
        with open(path, 'r') as f:
            content = f.read()

        orig = content

        # Replace teal button/accent colors with green primary (navy-700 = #1B4D3E)
        content = content.replace('bg-teal-500', 'bg-navy-700')
        content = content.replace('bg-teal-600', 'bg-navy-600')
        content = content.replace('hover:bg-teal-600', 'hover:bg-navy-600')
        content = content.replace('hover:bg-teal-500', 'hover:bg-navy-500')
        content = content.replace('text-teal-600', 'text-navy-700')
        content = content.replace('text-teal-500', 'text-navy-600')
        content = content.replace('text-teal-50', 'text-navy-100')
        content = content.replace('bg-teal-100', 'bg-navy-50')
        content = content.replace('bg-teal-50', 'bg-navy-50')
        content = content.replace('focus:ring-teal-500', 'focus:ring-navy-500')
        content = content.replace('focus:border-teal-500', 'focus:border-navy-500')
        content = content.replace('border-teal-500', 'border-navy-500')

        # CTA gradient
        content = content.replace('from-teal-500 to-teal-600', 'from-navy-800 to-navy-700')
        content = content.replace('from-teal-400 to-navy-600', 'from-navy-600 to-navy-800')

        if content != orig:
            with open(path, 'w') as f:
                f.write(content)
            print(f"Updated: {path.split('/')[-1]}")
        else:
            print(f"No changes: {path.split('/')[-1]}")
    except Exception as e:
        print(f"Error with {path.split('/')[-1]}: {e}")
