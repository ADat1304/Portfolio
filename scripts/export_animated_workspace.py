"""Run in Blender with clay_workspace_animated.blend open. Preserve skinning/actions."""
import bpy, os, json, ctypes
# Flatpak Blender needs its host Draco dependency loaded explicitly.
try:
    ctypes.CDLL('/run/host/usr/lib64/libdraco.so.9', mode=ctypes.RTLD_GLOBAL)
except OSError:
    pass
from pathlib import Path
ROOT=Path('/home/kis/portfolio/dat-portfolio')
old_mode=bpy.context.object.mode if bpy.context.object else 'OBJECT'
if old_mode!='OBJECT':bpy.ops.object.mode_set(mode='OBJECT')
s=bpy.context.scene
rig=bpy.data.objects['Armature']
old_action=rig.animation_data.action
old_frame=s.frame_current
old_range=(s.frame_start,s.frame_end)
selection=list(bpy.context.selected_objects)
active=bpy.context.view_layer.objects.active
try:
    rig.animation_data.action=bpy.data.actions['typing']
    rig.animation_data.action_slot=rig.animation_data.action.slots[0]
    s.frame_set(1)
    s.frame_start=1;s.frame_end=396
    bpy.ops.object.select_all(action='DESELECT')
    for o in s.objects:
        if o.type in {'MESH','ARMATURE'} and not o.hide_render:
            o.select_set(True)
        if o.name=='Deki_Workstation_Placement':o.select_set(True)
    bpy.context.view_layer.objects.active=rig
    path=ROOT/'public/models/workspace-animated.glb'
    bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,
        export_animations=True,export_animation_mode='ACTIONS',export_merge_animation='ACTION',
        export_frame_range=False,export_force_sampling=True,export_skins=True,
        export_cameras=False,export_lights=False,export_yup=True,export_apply=False,
        export_extras=False,export_optimize_animation_size=True,
        export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
    print('Animated export:',path,os.path.getsize(path),'bytes')
finally:
    rig.animation_data.action=old_action
    if old_action:rig.animation_data.action_slot=old_action.slots[0]
    s.frame_start,s.frame_end=old_range;s.frame_set(old_frame)
    bpy.ops.object.select_all(action='DESELECT')
    for o in selection:o.select_set(True)
    bpy.context.view_layer.objects.active=active

    if old_mode!='OBJECT':bpy.ops.object.mode_set(mode=old_mode)
