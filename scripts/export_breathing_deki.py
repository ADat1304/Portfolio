"""Convert public/models/Breathing Idle.fbx to public/models/deki.glb with workspace-matching outfit colors and breathing idle animation."""
import bpy, os, json, ctypes
from pathlib import Path
from mathutils import Vector

try:
    ctypes.CDLL('/run/host/usr/lib64/libdraco.so.9', mode=ctypes.RTLD_GLOBAL)
except OSError:
    pass

ROOT = Path('/home/kis/portfolio/dat-portfolio')
fbx_path = ROOT / 'public/models/Breathing Idle.fbx'
glb_path = ROOT / 'public/models/deki.glb'

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

bpy.ops.import_scene.fbx(filepath=str(fbx_path))

rig = bpy.data.objects.get('Armature')
if rig:
    # Mixamo FBX exporter scales the armature down by 0.01; restore 1.0 meter scale (~2.21m height)
    rig.scale = (1.0, 1.0, 1.0)
    if rig.animation_data and rig.animation_data.action:
        act = rig.animation_data.action
        act.name = 'breathing-idle'
        fr_start, fr_end = act.frame_range
        for frame in range(int(round(fr_start)), int(round(fr_end)) + 1):
            scene.frame_set(frame)
            rig.scale = (1.0, 1.0, 1.0)
            rig.keyframe_insert(data_path='scale', frame=frame)
        scene.frame_start = int(round(fr_start))
        scene.frame_end = int(round(fr_end))
        scene.frame_set(scene.frame_start)

# Exact linear RGB colors matching workspace-animated.glb character
object_colors = {
    'head': ('Workspace / Warm skin', (1.0, 0.6308, 0.3515)),
    'Cylinder.002': ('Workspace / Warm skin', (1.0, 0.6308, 0.3515)),
    'Hair': ('Workspace / Hair brown', (0.1912, 0.0802, 0.0284)),
    'Eyebrow': ('Workspace / Hair brown', (0.1912, 0.0802, 0.0284)),
    'Glasses': ('Workspace / Brown frames', (0.0953, 0.0529, 0.0284)),
    'Polo': ('Workspace / Polo', (0.0296, 0.0262, 0.0319)),
    'Polo_Button_0': ('Workspace / Polo_Button', (0.2918, 0.0137, 0.0296)),
    'Polo_Placket_Stitch_1': ('Workspace / Polo_Stitch', (0.3712, 0.0331, 0.0513)),
    'Cube.003': ('Workspace / Shorts', (0.1878, 0.2423, 0.3005)),
    'Shorts_BeltLoop_L0.073': ('Workspace / Shorts_BeltLoop', (0.1384, 0.1878, 0.2384)),
    'Sock': ('Workspace / Sock', (0.0331, 0.0296, 0.0409)),
    'boot_L': ('Workspace / boot_L', (0.0296, 0.0222, 0.0232)),
    'boot_L.001': ('Workspace / boot_R', (0.0296, 0.0222, 0.0232)),
    'Shoe': ('Workspace / Shoe', (0.0437, 0.0343, 0.0395)),
    'Backpack_Front_Pocket': ('Workspace / Backpack_Ochre', (0.38, 0.26, 0.095)),
    'Backpack_Pocket_Flap': ('Workspace / Backpack_Trim', (0.18, 0.105, 0.037)),
    'Backpack_Handle': ('Workspace / Backpack_Trim', (0.18, 0.105, 0.037)),
    'Backpack_Shoulder_Strap_R': ('Workspace / Backpack_Trim', (0.18, 0.105, 0.037)),
    'Backpack_Pocket_Snap': ('Workspace / Brass', (0.45, 0.30, 0.10)),
    'Strap_Adjuster_Bar': ('Workspace / Brass', (0.45, 0.30, 0.10)),
}

def get_or_make_mat(name, rgb):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    m.diffuse_color = (*rgb, 1.0)
    bsdf = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*rgb, 1.0)
        bsdf.inputs['Roughness'].default_value = 0.85
        bsdf.inputs['Metallic'].default_value = 0.0
    return m

for obj_name, (mat_name, rgb) in object_colors.items():
    obj = bpy.data.objects.get(obj_name)
    if obj and obj.type == 'MESH':
        mat = get_or_make_mat(mat_name, rgb)
        obj.data.materials.clear()
        obj.data.materials.append(mat)

# Assign 4 eye component colors on eyes_cover by connected component width
eyes_obj = bpy.data.objects.get('eyes_cover')
if eyes_obj and eyes_obj.type == 'MESH':
    eye_colors = [
        ('Deki reference / Eye whites', (0.8879, 0.8228, 0.7157)),
        ('Deki reference / Brown iris', (0.1845, 0.0802, 0.0319)),
        ('Deki reference / Pupil', (0.0091, 0.0060, 0.0048)),
        ('Deki reference / Eye highlight', (1.0, 1.0, 1.0)),
    ]
    eyes_obj.data.materials.clear()
    for name, rgb in eye_colors:
        eyes_obj.data.materials.append(get_or_make_mat(name, rgb))

    adj = [[] for _ in eyes_obj.data.vertices]
    for e in eyes_obj.data.edges:
        a, b = e.vertices
        adj[a].append(b)
        adj[b].append(a)
    seen = set()
    comps = []
    for v in eyes_obj.data.vertices:
        if v.index in seen:
            continue
        stack = [v.index]
        seen.add(v.index)
        ids = []
        while stack:
            i = stack.pop()
            ids.append(i)
            for j in adj[i]:
                if j not in seen:
                    seen.add(j)
                    stack.append(j)
        width = max(eyes_obj.data.vertices[i].co.x for i in ids) - min(eyes_obj.data.vertices[i].co.x for i in ids)
        comps.append((width, ids))
    # Sort 8 components by width descending: top 2 = whites, next 2 = iris, next 2 = pupil, smallest 2 = highlight
    comps.sort(key=lambda x: x[0], reverse=True)
    assign = {}
    for idx, (_, ids) in enumerate(comps):
        slot = min(3, idx // 2)
        for i in ids:
            assign[i] = slot
    for p in eyes_obj.data.polygons:
        p.material_index = assign.get(p.vertices[0], 0)
    print(f"Colored eyes_cover into {len(comps)} components.")

# Check character world bounding box at frame 1
bpy.context.view_layer.update()
depsgraph = bpy.context.evaluated_depsgraph_get()
min_v = Vector((1e9, 1e9, 1e9))
max_v = Vector((-1e9, -1e9, -1e9))
for o in scene.objects:
    if o.type == 'MESH' and not o.hide_render:
        eval_o = o.evaluated_get(depsgraph)
        for corner in eval_o.bound_box:
            w = eval_o.matrix_world @ Vector(corner)
            for i in range(3):
                min_v[i] = min(min_v[i], w[i])
                max_v[i] = max(max_v[i], w[i])
print("Evaluated Bounds Min:", tuple(round(x, 4) for x in min_v))
print("Evaluated Bounds Max:", tuple(round(x, 4) for x in max_v))
print("Evaluated Size:", tuple(round(max_v[i] - min_v[i], 4) for i in range(3)))

bpy.ops.object.select_all(action='SELECT')
if rig:
    bpy.context.view_layer.objects.active = rig

bpy.ops.export_scene.gltf(
    filepath=str(glb_path),
    export_format='GLB',
    use_selection=True,
    export_animations=True,
    export_animation_mode='ACTIONS',
    export_frame_range=True,
    export_force_sampling=True,
    export_skins=True,
    export_cameras=False,
    export_lights=False,
    export_yup=True,
    export_apply=False,
    export_optimize_animation_size=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)
print(f"Exported animated deki.glb: {glb_path} ({os.path.getsize(glb_path)} bytes)")
