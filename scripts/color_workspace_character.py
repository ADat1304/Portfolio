"""Apply the reference outfit palette to the exported workspace character."""
import json
import struct
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'public/models/workspace-animated.glb'
data = path.read_bytes()
json_size = struct.unpack_from('<I', data, 12)[0]
doc = json.loads(data[20:20 + json_size])
tail = data[20 + json_size:]
palette = {
    'Hair': ('Hair brown', '#79502f'),
    'Eyebrow': ('Hair brown', '#79502f'),
    'head.001': ('Warm skin', '#ffd0a0'),
    'Cylinder.003': ('Warm skin', '#ffd0a0'),
    'Polo': ('Cream polo', '#fff0d2'),
    'Polo_Button_0.001': ('Polo buttons', '#c4aa7d'),
    'Polo_Placket_Stitch_1.001': ('Polo stitching', '#decca4'),
    'Cube.001': ('Denim shorts', '#7799af'),
    'Shorts_BeltLoop_L0.001': ('Denim shorts', '#7799af'),
    'Glasses': ('Brown frames', '#57412f'),
    'Sock': ('Cream socks', '#fff6e4'),
    'boot_L': ('Brown shoes', '#a27c51'),
    'boot_L.001': ('Brown shoes', '#a27c51'),
    'Shoe': ('Sand soles', '#ddc9a3'),
}

def linear(channel):
    x = int(channel, 16) / 255
    return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4

materials = doc.setdefault('materials', [])
matched = set()
for node in doc['nodes']:
    name = node.get('name')
    if name not in palette or 'mesh' not in node:
        continue
    label, color = palette[name]
    label = 'Deki reference / ' + label
    index = next((i for i, m in enumerate(materials) if m.get('name') == label), None)
    if index is None:
        index = len(materials)
        materials.append({'name': label, 'pbrMetallicRoughness': {
            'baseColorFactor': [linear(color[i:i+2]) for i in (1, 3, 5)] + [1],
            'metallicFactor': 0, 'roughnessFactor': 0.85}})
    materials[index]['pbrMetallicRoughness']['baseColorFactor'] = [linear(color[i:i+2]) for i in (1, 3, 5)] + [1]
    for primitive in doc['meshes'][node['mesh']]['primitives']:
        primitive['material'] = index
    matched.add(name)
assert matched == set(palette), f'Missing character meshes: {set(palette) - matched}'
encoded = json.dumps(doc, separators=(',', ':')).encode()
encoded += b' ' * (-len(encoded) % 4)
result = struct.pack('<III', 0x46546C67, 2, 20 + len(encoded) + len(tail))
result += struct.pack('<II', len(encoded), 0x4E4F534A) + encoded + tail
path.write_bytes(result)
assert result[20 + len(encoded):] == tail, 'Geometry and animation must remain unchanged'
print(f'Colored {len(matched)} character meshes; geometry and animation preserved.')
