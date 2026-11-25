"""Export standalone pedestal.blend to public/models/pedestal.glb."""
import bpy, os, ctypes
from pathlib import Path

try:
    ctypes.CDLL('/run/host/usr/lib64/libdraco.so.9', mode=ctypes.RTLD_GLOBAL)
except OSError:
    pass

ROOT = Path('/home/kis/portfolio/dat-portfolio')
blend_path = ROOT / 'src/model/pedestal.blend'
glb_path = ROOT / 'public/models/pedestal.glb'

bpy.ops.wm.open_mainfile(filepath=str(blend_path))
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH' and not obj.hide_render:
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj

bpy.ops.export_scene.gltf(
    filepath=str(glb_path),
    export_format='GLB',
    use_selection=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_yup=True,
    export_apply=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)
print(f"Exported standalone pedestal: {glb_path} ({os.path.getsize(glb_path)} bytes)")
