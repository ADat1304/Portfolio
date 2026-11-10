import bpy, math, json
from mathutils import Vector, Matrix
from pathlib import Path
s=bpy.context.scene
base='/home/kis/portfolio/dat-portfolio'
bpy.ops.wm.save_as_mainfile(filepath=base+'/src/model/clay_workspace_before_prop_rig.blend',copy=True)
with bpy.data.libraries.load(base+'/src/model/deki_greeting_sequence.blend',link=False) as (src,dst):
    dst.collections=['DEKI_ROOM_TRANSFER']
s.collection.children.link(dst.collections[0])
with bpy.data.libraries.load(base+'/src/model/deki_greeting_sequence.blend',link=False) as (src,dst):
    dst.actions=['wave']
r=bpy.data.objects['Armature'];r.animation_data.action=bpy.data.actions['typing'];r.animation_data.action_slot=r.animation_data.action.slots[0]
s.frame_set(1)
placement=bpy.data.objects.new('Deki_Workstation_Placement',None);s.collection.objects.link(placement)
placement.location=(-1.22368445,0.65,0.035);placement.rotation_euler.z=math.pi;placement.scale=(0.75,)*3
r.parent=placement
chair_names=[o.name for o in s.objects if o.name.startswith(('Chair ','Armrest stem')) or o.name in ['Back support','Ergonomic curved back','Lumbar cushion']]
shift=Vector((-1.22368445+1.367395639,0.65-0.43802416,0))
for name in chair_names:
    bpy.data.objects[name].location+=shift
bpy.context.view_layer.update()
print('Imported character and aligned chair. Chair objects:',chair_names)
# Save setup values for the next authoring step.
s['prop_rig_chair_objects']=json.dumps(chair_names)
s['prop_rig_pivot']=[-1.22368445,0.65,0]
bpy.ops.wm.save_as_mainfile(filepath=base+'/src/model/clay_workspace_animated.blend')
