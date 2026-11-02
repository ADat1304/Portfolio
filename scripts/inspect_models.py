import bpy, json
from mathutils import Vector
for filename in ['clay_workspace_deki.blend', 'DekiModel_crown_filled_hair_ok.blend']:
    bpy.ops.wm.open_mainfile(filepath='D:/port/' + filename)
    objects = []
    for o in bpy.context.scene.objects:
        bounds = [o.matrix_world @ Vector(v) for v in o.bound_box] if o.type == 'MESH' else []
        objects.append({'name': o.name, 'type': o.type, 'hidden': o.hide_render, 'vertices': len(o.data.vertices) if o.type == 'MESH' else 0, 'min': [min(v[i] for v in bounds) for i in range(3)] if bounds else [], 'max': [max(v[i] for v in bounds) for i in range(3)] if bounds else [], 'materials': [m.name for m in o.data.materials if m] if o.type == 'MESH' else []})
    data = {'file': filename, 'objects': objects, 'materials': [{'name': m.name, 'color': list(m.diffuse_color), 'nodes': [(n.type, list(n.inputs['Base Color'].default_value) if n.type == 'BSDF_PRINCIPLED' else '') for n in m.node_tree.nodes] if m.use_nodes else []} for m in bpy.data.materials], 'cameras': [{'name': o.name, 'matrix': [list(row) for row in o.matrix_world], 'lens': o.data.lens} for o in bpy.context.scene.objects if o.type == 'CAMERA']}
    with open('D:/port/Portfolio/scripts/' + filename + '.json', 'w') as f:
        json.dump(data, f, indent=2)
    print(filename, 'objects:', len(objects), 'vertices:', sum(o['vertices'] for o in objects))
