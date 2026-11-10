"""Align desk props with the source typing clip's mouse-use intervals."""
import bpy
from mathutils import Vector, Matrix
s=bpy.context.scene;r=bpy.data.objects['Armature'];ad=r.animation_data
old_action,old_frame=ad.action,s.frame_current
old_mode=bpy.context.object.mode if bpy.context.object else 'OBJECT'
if old_mode!='OBJECT':bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.wm.save_as_mainfile(filepath='/home/kis/portfolio/dat-portfolio/src/model/clay_workspace_before_mouse_calibration.blend',copy=True)
ad.action=bpy.data.actions['typing'];ad.action_slot=ad.action.slots[0];s.frame_set(1);bpy.context.view_layer.update()
assert not s.get('mouse_contact_calibrated'), 'Already calibrated; do not apply twice'
palm=r.matrix_world@r.pose.bones['mixamorig:RightHand'].matrix@Vector((0,0.065,0))
center=Vector((palm.x,palm.y,0.842))
mouse=bpy.data.objects['Mouse']
old_center=Vector((-0.6286844,1.1280241,0.851))
# Rigid mouse mesh: align under palm and lower its profile to fit the source hand height.
transform=Matrix.Translation(center)@Matrix.Diagonal((1,1,0.4,1))@Matrix.Translation(-old_center)
mouse.data.transform(mouse.matrix_world.inverted()@transform@mouse.matrix_world)
mat=bpy.data.objects['Mouse mat'];mat.location+=Vector((-0.97+0.60868442,1.145-1.14802408,0))
# The old keyboard occupied the mouse-use area. Keep all keys together while resizing.
origin=Vector((-1.20368445,1.14802408,0.836))
keyboard_transform=Matrix.Translation(Vector((-1.33,origin.y,origin.z)))@Matrix.Diagonal((0.38/0.54,1,1,1))@Matrix.Translation(-origin)
for o in s.objects:
 if o.name.startswith('Keyboard ') or o.name=='Spacebar':o.data.transform(o.matrix_world.inverted()@keyboard_transform@o.matrix_world)
# Move the mouse reference bone to the new mesh center and re-key its hold pose in both clips.
bpy.context.view_layer.objects.active=r;r.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
b=r.data.edit_bones['PROP_Mouse'];length=b.length
b.head=r.matrix_world.inverted()@center;b.tail=b.head+Vector((0,length,0))
bpy.ops.object.mode_set(mode='OBJECT')
bpy.context.view_layer.update()
bind=r.matrix_world@r.data.bones['PROP_Mouse'].matrix_local
for name in ['wave','typing']:
 ad.action=bpy.data.actions[name];ad.action_slot=ad.action.slots[0]
 for frame in range(1,int(ad.action.frame_range[1])+1):
  s.frame_set(frame);bpy.context.view_layer.update()
  b=r.pose.bones['PROP_Mouse'];b.matrix=r.matrix_world.inverted()@bind
  for path in ['location','rotation_quaternion','scale']:b.keyframe_insert(path,frame=frame,group='PROP_Mouse')
 ad.action['mouse_contact']='Typing includes mouse use near frames 1-60, 225-295 and 382-396. Web MouseFollower drives palm contact inside the calibrated mat.'
s['mouse_contact_calibrated']=True
s['mouse_palm_probe_local']=[0,0.065,0]
ad.action=old_action;ad.action_slot=old_action.slots[0];s.frame_set(old_frame)
if old_mode!='OBJECT':bpy.ops.object.mode_set(mode=old_mode)
bpy.ops.wm.save_as_mainfile(filepath='/home/kis/portfolio/dat-portfolio/src/model/clay_workspace_animated.blend')
print('Calibrated mouse center',list(center),'and keyboard/mat to the actual hand path.')
