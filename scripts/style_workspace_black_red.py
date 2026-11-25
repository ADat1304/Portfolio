"""Run in Blender with the animated workspace open to sync its black/red look to the web GLB."""

import json
import struct
from pathlib import Path

import bpy
from mathutils import Vector


root = Path(__file__).resolve().parents[1]
blend = root / "src/model/clay_workspace_animated.blend"
glb = root / "public/models/workspace-animated.glb"
manifest = glb.with_name("manifest.json")

palette = {
    "Back wall": "#272528",
    "Diorama plinth": "#373439",
    "White desk top": "#302C2D",
    "Ash desk apron": "#68272C",
    "Desk drawer": "#29262A",
    "Drawer pull": "#494146",
    "Corkboard oak frame": "#29282B",
    "Cork bulletin surface": "#393038",
    "Floating ash shelf": "#48362F",
    "Apricot rug": "#231F23",
    "Rug cream inset": "#8F262F",
    "Rug golden center": "#262326",
    "Rug woven stripe 02": "#862B35",
    "Chair seat": "#762933",
    "Ergonomic curved back": "#343037",
    "Lumbar cushion": "#63232D",
    "Mouse mat": "#41333A",
    "Pencil cup": "#322D33",
    "Coffee mug": "#362E33",
    "Shelf book 00": "#2C282B",
    "Shelf book 01": "#342D30",
    "Shelf book 03": "#373035",
    "Shelf book 04": "#972833",
    "Polo": "#302D32",
    "Polo_Button_0.001": "#931F30",
    "Polo_Placket_Stitch_1.001": "#A43340",
    "Cube.001": "#788795",
    "Shorts_BeltLoop_L0.001": "#687886",
    "Sock": "#333039",
    "boot_L": "#30292A",
    "boot_L.001": "#30292A",
    "Shoe": "#3B3438",
}

def srgb_to_linear(channel):
    value = int(channel, 16) / 255
    return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4

def color_for(hex_color):
    return [srgb_to_linear(hex_color[i:i + 2]) for i in (1, 3, 5)]

def material_name(object_name):
    return f"Workspace / {object_name}"

def bounds(name):
    obj = bpy.data.objects[name]
    points = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    return tuple(Vector([fn(point[axis] for point in points) for axis in range(3)]) for fn in (min, max))


if Path(bpy.data.filepath) != blend:
    raise RuntimeError(f"Open {blend.name} before applying the workspace palette")

data = glb.read_bytes()
json_size = struct.unpack_from("<I", data, 12)[0]
document = json.loads(data[20:20 + json_size])
binary_chunks = data[20 + json_size:]
nodes = {node.get("name"): node for node in document["nodes"] if "mesh" in node}
missing = palette.keys() - (nodes.keys() & set(bpy.data.objects.keys()))
if missing:
    raise RuntimeError(f"Workspace meshes missing from Blender or GLB: {sorted(missing)}")

for name, hex_color in palette.items():
    rgb = color_for(hex_color)
    label = material_name(name)
    material = bpy.data.materials.get(label) or bpy.data.materials.new(label)
    material.diffuse_color = (*rgb, 1)
    material.use_nodes = True
    shader = next(node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    shader.inputs["Base Color"].default_value = (*rgb, 1)
    shader.inputs["Roughness"].default_value = 0.85
    for slot in bpy.data.objects[name].material_slots:
        slot.link = "OBJECT"
        slot.material = material

    materials = document["materials"]
    index = next((i for i, entry in enumerate(materials) if entry.get("name") == label), len(materials))
    entry = {
        "name": label,
        "pbrMetallicRoughness": {"baseColorFactor": [*rgb, 1], "metallicFactor": 0, "roughnessFactor": 0.85},
    }
    if name == "Cube.001":
        entry["doubleSided"] = True  # Both sides of the open shorts hems are visible.
    if index == len(materials):
        materials.append(entry)
    else:
        materials[index] = entry
    for primitive in document["meshes"][nodes[name]["mesh"]]["primitives"]:
        primitive["material"] = index

desk_min, desk_max = bounds("White desk top")
wall_min, wall_max = bounds("Back wall")
desk_center = (desk_min + desk_max) / 2
wall_center = (wall_min + wall_max) / 2
wall_axis = min(range(2), key=lambda axis: wall_max[axis] - wall_min[axis])
across = 1 - wall_axis
light_color = color_for("#FF2539")

extension = "KHR_lights_punctual"
used = document.setdefault("extensionsUsed", [])
if extension not in used:
    used.append(extension)
lights = document.setdefault("extensions", {}).setdefault(extension, {}).setdefault("lights", [])
scene_roots = document["scenes"][document["scene"]]["nodes"]
for index, direction in enumerate((-1, 1), start=1):
    name = f"Workspace red backlight {index}"
    location = desk_center.copy()
    location[across] += direction * (desk_max[across] - desk_min[across]) * 0.23
    location[wall_axis] = wall_center[wall_axis] * 0.78 + desk_center[wall_axis] * 0.22
    location.z = desk_max.z + 0.16
    light = bpy.data.lights.get(name) or bpy.data.lights.new(name, "POINT")
    light.color = light_color
    light.energy = 22
    light.shadow_soft_size = 0.16
    object = bpy.data.objects.get(name)
    if object is None:
        object = bpy.data.objects.new(name, light)
        bpy.context.scene.collection.objects.link(object)
    object.location = location

    light_spec = {"name": name, "type": "point", "color": light_color, "intensity": 3.0, "range": 1.25}
    node_index = next((i for i, node in enumerate(document["nodes"]) if node.get("name") == name), None)
    if node_index is None:
        node_index = len(document["nodes"])
        document["nodes"].append({"name": name, "extensions": {extension: {"light": len(lights)}}})
        scene_roots.append(node_index)
        lights.append(light_spec)
    node = document["nodes"][node_index]
    node["translation"] = [location.x, location.z, -location.y]
    lights[node["extensions"][extension]["light"]] = light_spec

encoded = json.dumps(document, separators=(",", ":")).encode()
encoded += b" " * (-len(encoded) % 4)
result = struct.pack("<IIIII", 0x46546C67, 2, 20 + len(encoded) + len(binary_chunks), len(encoded), 0x4E4F534A)
result += encoded + binary_chunks
entries = json.loads(manifest.read_text())
next(entry for entry in entries if entry["output"] == glb.name)["bytes"] = len(result)

bpy.ops.wm.save_as_mainfile(filepath=str(blend))
glb.write_bytes(result)
manifest.write_text(json.dumps(entries, indent=2) + "\n")
print(f"Updated {len(palette)} workspace meshes and two backlights.")
