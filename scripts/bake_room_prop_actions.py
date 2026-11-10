import bpy, math, json
from mathutils import Vector, Matrix
s=bpy.context.scene;r=bpy.data.objects['Armature'];ad=r.animation_data
ad.action=bpy.data.actions['typing'];ad.action_slot=ad.action.slots[0];s.frame_set(1)
bpy.context.view_layer.update()
pivot=Vector(s['prop_rig_pivot'])
mouse=bpy.data.objects['Mouse']
points=[mouse.matrix_world@Vector(v) for v in mouse.bound_box]
mouse_center=sum(points,Vector())/8
chair_names=json.loads(s['prop_rig_chair_objects'])
inv=r.matrix_world.inverted()
bpy.ops.object.select_all(action='DESELECT');r.select_set(True);bpy.context.view_layer.objects.active=r
bpy.ops.object.mode_set(mode='EDIT')
for name,point in [('PROP_ChairBase',pivot),('PROP_ChairSwivel',pivot+Vector((0,0,0.52))),('PROP_Mouse',mouse_center)]:
 b=r.data.edit_bones.new(name);b.head=inv@point;b.tail=inv@(point+Vector((0,0,0.16)));b.use_deform=True
bpy.ops.object.mode_set(mode='OBJECT')
bpy.context.view_layer.update()
bind={name:r.matrix_world@r.data.bones[name].matrix_local for name in ['PROP_ChairBase','PROP_ChairSwivel','PROP_Mouse']}
for name in chair_names+['Mouse']:
 o=bpy.data.objects[name]
 world=o.matrix_world.copy();o.parent=r;o.matrix_parent_inverse=r.matrix_world.inverted();o.matrix_world=world
 bone='PROP_Mouse' if name=='Mouse' else ('PROP_ChairBase' if name.startswith(('Chair pneumatic','Chair star','Chair caster')) else 'PROP_ChairSwivel')
 group=o.vertex_groups.new(name=bone);group.add(list(range(len(o.data.vertices))),1.0,'REPLACE')
 mod=o.modifiers.new('Deki synchronized prop rig','ARMATURE');mod.object=r;mod.use_vertex_groups=True
 o['animation_controller']='Armature: select wave or typing'
for name in ['wave','typing']:
 a=bpy.data.actions[name];a.use_fake_user=True
 ad.action=a;ad.action_slot=a.slots[0]
 for frame in range(1,int(a.frame_range[1])+1):
  s.frame_set(frame);bpy.context.view_layer.update()
  inverse=r.matrix_world.inverted()
  yaw=r.rotation_euler.z
  swivel=Matrix.Translation(pivot)@Matrix.Rotation(yaw,4,'Z')@Matrix.Translation(-pivot)
  for bone_name in bind:
   b=r.pose.bones[bone_name];b.rotation_mode='QUATERNION'
   world=swivel@bind[bone_name] if bone_name=='PROP_ChairSwivel' else bind[bone_name]
   b.matrix=inverse@world
   b.keyframe_insert('location',frame=frame,group=bone_name)
   b.keyframe_insert('rotation_quaternion',frame=frame,group=bone_name)
   b.keyframe_insert('scale',frame=frame,group=bone_name)
 a['includes']='character, chair swivel, stationary chair base, mouse hold'
 a['mouse_contact']='No mouse grip in source motion; mouse stays on mat.'
# Both clips start at frame 1; no NLA sequencing or scripts are required for synchronization.
ad.action=bpy.data.actions['wave'];ad.action_slot=ad.action.slots[0]
s.frame_start=1;s.frame_end=156;s.frame_set(36)
s['animation_usage']='Select Armature, Action Editor: wave (1-156), typing (1-396). Chair and mouse bones are inside the same action.'
for o in bpy.data.objects:
 if o.name.startswith('REF_'):o.hide_set(True)
r.show_in_front=True
bpy.ops.wm.save_as_mainfile(filepath='/home/kis/portfolio/dat-portfolio/src/model/clay_workspace_animated.blend')
print('Baked two independent synchronized actions; 3 prop bones; 20 rigid mesh bindings.')
