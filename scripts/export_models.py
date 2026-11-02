"""Run with Blender --background --python scripts/export_models.py. Originals stay untouched."""
import bpy, os, json, math
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'models')
os.makedirs(OUT, exist_ok=True)
report = []
for source, target in [('clay_workspace_deki.blend', 'workspace'), ('DekiModel_crown_filled_hair_ok.blend', 'deki')]:
    bpy.ops.wm.open_mainfile(filepath=os.path.join(os.path.dirname(ROOT), source))
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    scene = bpy.context.scene
    # Apply evaluated geometry once. Limit subdivision to one level for the web.
    depsgraph = bpy.context.evaluated_depsgraph_get()
    groups = {}
    for obj in list(scene.objects):
        if obj.type not in {'MESH', 'CURVE', 'FONT'} or obj.hide_render:
            continue
        if 'backdrop' in obj.name.lower() or obj.name in {'Display_Pedestal', 'Studio ground'}:
            continue
        for mod in obj.modifiers:
            if mod.type == 'SUBSURF':
                mod.levels = min(mod.levels, 1)
                mod.render_levels = min(mod.render_levels, 1)
        depsgraph.update()
        evaluated = obj.evaluated_get(depsgraph)
        mesh = bpy.data.meshes.new_from_object(evaluated, depsgraph=depsgraph)
        new = bpy.data.objects.new('web_' + obj.name, mesh)
        scene.collection.objects.link(new)
        new.matrix_world = obj.matrix_world.copy()
        label = obj.name.lower()
        group = 'deki' if target == 'deki' or label.startswith('deki') else 'monitor' if any(s in label for s in ['screen', 'syntax', 'monitor', 'ide ', 'file tree', 'toolbar', 'window control']) else 'plant' if any(s in label for s in ['leaf', 'plant', 'pot ', 'stem']) else 'room'
        groups.setdefault(group, []).append(new)
    bpy.ops.object.select_all(action='DESELECT')
    exports = []
    for name, objects in groups.items():
        for obj in objects:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = objects[0]
        bpy.ops.object.join()
        joined = bpy.context.object
        joined.name = name
        # Collapse identical-material mesh primitives at export, preserving interaction groups.
        exports.append(joined)
        joined.select_set(False)
    for obj in scene.objects:
        obj.select_set(False)
    for obj in exports:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = exports[0]
    path = os.path.join(OUT, target + '.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_animations=False, export_cameras=False, export_lights=False, export_yup=True, export_apply=True, export_extras=True, export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6)
    report.append({'source': source, 'output': target + '.glb', 'bytes': os.path.getsize(path), 'groups': [o.name for o in exports], 'vertices': sum(len(o.data.vertices) for o in exports)})
    print('EXPORTED', report[-1], flush=True)
with open(os.path.join(OUT, 'manifest.json'), 'w') as f:
    json.dump(report, f, indent=2)
