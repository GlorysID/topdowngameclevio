import re, json

def extract_keys(filepath, var_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Find the opening brace after var assignment
    pattern = f'window.{var_name} = {{'
    idx = content.find(pattern)
    if idx == -1:
        print(f'  Variable {var_name} not found in {filepath}')
        return set()
    # Extract all "key": patterns after it
    rest = content[idx:]
    keys = set()
    for m in re.finditer(r'^\s+"([^"]+)":\s+"data:', rest, re.MULTILINE):
        keys.add(m.group(1))
    if not keys:
        # Try path-based format
        for m in re.finditer(r'^\s+"([^"]+)":\s+"[^"]*"', rest, re.MULTILINE):
            keys.add(m.group(1))
    return keys

def extract_layout_keys(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    return set(re.findall(r'"key":\s*"([^"]+)"', content))

live_keys = extract_keys('src/assetdesa-live.js', 'ASSETDESA_DATA')
data_keys = extract_keys('src/assetdesa-data.js', 'ASSETDESA_DATA')

print(f'Editor (live): {len(live_keys)} keys')
print(f'Game (data):   {len(data_keys)} keys')

only_in_editor = live_keys - data_keys
only_in_game = data_keys - live_keys

if only_in_editor:
    print(f'\nAda di EDITOR tapi TIDAK di GAME ({len(only_in_editor)}):')
    for k in sorted(only_in_editor):
        print(f'  - {k}')

if only_in_game:
    print(f'\nAda di GAME tapi TIDAK di EDITOR ({len(only_in_game)}):')
    for k in sorted(only_in_game):
        print(f'  - {k}')

if not only_in_editor and not only_in_game:
    print('\nSemua keys SAMA!')

layout_keys = extract_layout_keys('src/generated-layouts.js')
missing_in_game = layout_keys - data_keys
if missing_in_game:
    print(f'\nDipakai di LAYOUT tapi TIDAK ada di GAME assets ({len(missing_in_game)}):')
    for k in sorted(missing_in_game):
        print(f'  - {k}')
else:
    print(f'\nSemua {len(layout_keys)} layout keys tersedia di game assets!')
